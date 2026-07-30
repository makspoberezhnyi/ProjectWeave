import React, { useRef } from 'react';
import { PanResponder, Platform, View } from 'react-native';
import { Button, Text, XStack, YStack } from 'tamagui';
import { CARD_H, CARD_W } from '../data/canvas';
import { useWeaveStore } from '../state/store';
import { CanvasCard } from '../components/CanvasCard';
import { CanvasSidebar } from '../components/CanvasSidebar';
import { ConnectionsOverlay } from '../components/ConnectionsOverlay';

function ZoomControl({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Button unstyled onPress={onPress} width={36} height={36} br="$2" ai="center" jc="center" pressStyle={{ opacity: 0.7 }}>
      <Text fontSize={15} fontWeight="700" color="$color">{label}</Text>
    </Button>
  );
}

export function CanvasScreen() {
  const items = useWeaveStore((s) => s.items);
  const canvasScale = useWeaveStore((s) => s.canvasScale);
  const canvasOffset = useWeaveStore((s) => s.canvasOffset);
  const sidebarOpen = useWeaveStore((s) => s.sidebarOpen);
  const toggleSidebar = useWeaveStore((s) => s.toggleSidebar);
  const setCanvasTransform = useWeaveStore((s) => s.setCanvasTransform);
  const zoomBy = useWeaveStore((s) => s.zoomBy);
  const fitToScreen = useWeaveStore((s) => s.fitToScreen);
  const setTempLine = useWeaveStore((s) => s.setTempLine);
  const addConnection = useWeaveStore((s) => s.addConnection);
  const openExport = useWeaveStore((s) => s.openExport);

  const placed = items.filter((i) => i.placed);

  const canvasRef = useRef<View>(null);
  const originRef = useRef({ pageX: 0, pageY: 0, width: 800, height: 600 });
  const dragStartOffset = useRef(canvasOffset);

  const measureOrigin = () => {
    canvasRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      originRef.current = { pageX, pageY, width, height };
    });
  };

  const toWorld = (pageX: number, pageY: number) => {
    const localX = pageX - originRef.current.pageX;
    const localY = pageY - originRef.current.pageY;
    return { x: (localX - canvasOffset.x) / canvasScale, y: (localY - canvasOffset.y) / canvasScale };
  };

  const bgPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragStartOffset.current = canvasOffset;
      },
      onPanResponderMove: (_evt, g) => {
        setCanvasTransform(canvasScale, { x: dragStartOffset.current.x + g.dx, y: dragStartOffset.current.y + g.dy });
      },
    })
  ).current;

  const handleConnectMove = (fromId: string) => (pageX: number, pageY: number) => {
    setTempLine({ fromId, ...toWorld(pageX, pageY) });
  };
  const handleConnectEnd = (fromId: string) => (pageX: number, pageY: number) => {
    const { x, y } = toWorld(pageX, pageY);
    const target = items.find(
      (i) => i.placed && i.id !== fromId && x >= i.x && x <= i.x + CARD_W && y >= i.y && y <= i.y + CARD_H
    );
    if (target) addConnection(fromId, target.id);
    setTempLine(null);
  };

  const webWheelProps =
    Platform.OS === 'web'
      ? ({
          onWheel: (e: any) => {
            e.preventDefault?.();
            const delta = e.deltaY > 0 ? -0.12 : 0.12;
            const anchor = { x: e.clientX - originRef.current.pageX, y: e.clientY - originRef.current.pageY };
            zoomBy(delta, anchor);
          },
        } as any)
      : {};

  return (
    <XStack flex={1} position="relative" overflow="hidden">
      {sidebarOpen && <CanvasSidebar />}

      <View
        ref={canvasRef}
        onLayout={measureOrigin}
        {...bgPan.panHandlers}
        {...webWheelProps}
        style={{ flex: 1, overflow: 'hidden', backgroundColor: '#00000000' }}
      >
        <YStack position="absolute" inset={0} bg="$backgroundSunken" />
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1,
            height: 1,
            transform: [{ translateX: canvasOffset.x }, { translateY: canvasOffset.y }, { scale: canvasScale }],
          }}
        >
          <ConnectionsOverlay />
          {placed.map((item) => (
            <CanvasCard
              key={item.id}
              item={item}
              onConnectMove={handleConnectMove(item.id)}
              onConnectEnd={handleConnectEnd(item.id)}
            />
          ))}
        </View>

        {placed.length === 0 && (
          <YStack position="absolute" inset={0} ai="center" jc="center" gap="$2" p="$5" pointerEvents="none">
            <Text fontSize={15} fontWeight="700" color="$colorSecondary">Nothing placed yet</Text>
            <Text fontSize={13} color="$colorSecondary" textAlign="center">
              Add an item from the drawer to start planning the order.
            </Text>
          </YStack>
        )}
      </View>

      <YStack position="absolute" left="$4" bottom="$4" bg="$surface" br="$4" p="$1" gap="$1" borderWidth={1} borderColor="$borderColor">
        <ZoomControl label="☰" onPress={toggleSidebar} />
        <ZoomControl label="+" onPress={() => zoomBy(0.2)} />
        <ZoomControl label="–" onPress={() => zoomBy(-0.2)} />
        <ZoomControl label="⤢" onPress={() => fitToScreen(originRef.current.width, originRef.current.height)} />
      </YStack>

      <Button unstyled onPress={openExport} position="absolute" right="$4" top="$4" bg="$pillPrimaryBackground" br="$2" px="$5" py="$3">
        <Text color="$pillPrimaryText" fontWeight="700" fontSize={13}>Export Plan</Text>
      </Button>
    </XStack>
  );
}
