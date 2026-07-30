import React, { useRef, useState } from 'react';
import { PanResponder, View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { CARD_CONNECT_Y, CARD_W } from '../data/canvas';
import { MediaItem, TYPE_LABEL } from '../data/types';
import { useWeaveStore } from '../state/store';
import { MediaThumb } from './MediaThumb';

export function CanvasCard({
  item,
  onConnectMove,
  onConnectEnd,
}: {
  item: MediaItem;
  onConnectMove: (pageX: number, pageY: number) => void;
  onConnectEnd: (pageX: number, pageY: number) => void;
}) {
  const scale = useWeaveStore((s) => s.canvasScale);
  const moveItem = useWeaveStore((s) => s.moveItem);
  const openDetail = useWeaveStore((s) => s.openDetail);
  const [dragOffset, setDragOffset] = useState<{ dx: number; dy: number } | null>(null);
  const originRef = useRef({ x: item.x, y: item.y });

  const cardPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        originRef.current = { x: item.x, y: item.y };
        setDragOffset({ dx: 0, dy: 0 });
      },
      onPanResponderMove: (_evt, g) => {
        setDragOffset({ dx: g.dx / scale, dy: g.dy / scale });
      },
      onPanResponderRelease: (_evt, g) => {
        const moved = Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4;
        if (moved) {
          moveItem(item.id, originRef.current.x + g.dx / scale, originRef.current.y + g.dy / scale);
        } else {
          openDetail(item.id);
        }
        setDragOffset(null);
      },
      onPanResponderTerminate: () => setDragOffset(null),
    })
  ).current;

  const connectPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt) => onConnectMove(evt.nativeEvent.pageX, evt.nativeEvent.pageY),
      onPanResponderRelease: (evt) => onConnectEnd(evt.nativeEvent.pageX, evt.nativeEvent.pageY),
      onPanResponderTerminate: (evt) => onConnectEnd(evt.nativeEvent.pageX, evt.nativeEvent.pageY),
    })
  ).current;

  const x = item.x + (dragOffset?.dx ?? 0);
  const y = item.y + (dragOffset?.dy ?? 0);

  return (
    <View
      style={{ position: 'absolute', left: x, top: y, width: CARD_W, userSelect: 'none' } as any}
      {...cardPan.panHandlers}
    >
      <YStack bg="$surface" br="$4" overflow="hidden" shadowColor="#000" shadowOpacity={0.12} shadowRadius={8}>
        <YStack height={96}>
          <MediaThumb type={item.type} radius={0} imageUrl={item.imageUrl} />
        </YStack>
        <YStack p="$3" gap="$2">
          <Text fontSize={15} fontWeight="600" color="$color" numberOfLines={2}>
            {item.title}
          </Text>
          <XStack ai="center" gap="$2" bg="$backgroundSunken" br="$5" px="$2" py="$1" als="flex-start">
            <YStack width={5} height={5} br="$5" bg={(`$${item.type}` as any)} />
            <Text fontSize={11} fontWeight="700" color={(`$${item.type}` as any)}>
              {TYPE_LABEL[item.type]}
            </Text>
          </XStack>
        </YStack>
      </YStack>
      <View
        {...connectPan.panHandlers}
        style={{
          position: 'absolute',
          left: CARD_W - 18,
          top: CARD_CONNECT_Y - 18,
          width: 36,
          height: 36,
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'crosshair',
        } as any}
      >
        <YStack
          width={18}
          height={18}
          br="$5"
          bg={(`$${item.type}` as any)}
          borderWidth={2}
          borderColor="$surface"
          pointerEvents="none"
        />
      </View>
    </View>
  );
}
