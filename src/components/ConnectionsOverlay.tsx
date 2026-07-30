import React from 'react';
import { Button, Input, Text, YStack } from 'tamagui';
import Svg, { Defs, Marker, Path } from 'react-native-svg';
import { CARD_CONNECT_Y, CARD_W } from '../data/canvas';
import { useWeaveStore } from '../state/store';
import { useThemeName } from 'tamagui';
import { colorTokens } from '../design-system/tokens/colors';

function curve(fx: number, fy: number, tx: number, ty: number) {
  const c1x = fx + 80;
  const c2x = tx - 80;
  const d = `M ${fx} ${fy} C ${c1x} ${fy}, ${c2x} ${ty}, ${tx} ${ty}`;
  const midX = (fx + 3 * c1x + 3 * c2x + tx) / 8;
  const midY = (fy + 3 * fy + 3 * ty + ty) / 8;
  return { d, midX, midY };
}

export function ConnectionsOverlay() {
  const items = useWeaveStore((s) => s.items);
  const connections = useWeaveStore((s) => s.connections);
  const tempLine = useWeaveStore((s) => s.tempLine);
  const editingConnectionId = useWeaveStore((s) => s.editingConnectionId);
  const updateConnectionLabel = useWeaveStore((s) => s.updateConnectionLabel);
  const startEditConnection = useWeaveStore((s) => s.startEditConnection);
  const stopEditConnection = useWeaveStore((s) => s.stopEditConnection);
  const removeConnection = useWeaveStore((s) => s.removeConnection);
  const themeName = useThemeName() === 'dark' ? 'dark' : 'light';
  const lineColor = colorTokens[themeName].textPrimary;

  const find = (id: string) => items.find((i) => i.id === id);

  const paths = connections
    .map((c) => {
      const from = find(c.from);
      const to = find(c.to);
      if (!from || !to) return null;
      const { d, midX, midY } = curve(from.x + CARD_W, from.y + CARD_CONNECT_Y, to.x, to.y + CARD_CONNECT_Y);
      return { ...c, d, midX, midY };
    })
    .filter(Boolean) as { id: string; label: string; d: string; midX: number; midY: number }[];

  let tempD: string | null = null;
  if (tempLine) {
    const from = find(tempLine.fromId);
    if (from) {
      tempD = curve(from.x + CARD_W, from.y + CARD_CONNECT_Y, tempLine.x, tempLine.y).d;
    }
  }

  return (
    <>
      <Svg style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }} width={1} height={1}>
        <Defs>
          <Marker id="weave-arrow" markerWidth={8} markerHeight={8} refX={6} refY={3} orient="auto">
            <Path d="M0,0 L6,3 L0,6 Z" fill={lineColor} />
          </Marker>
        </Defs>
        {paths.map((p) => (
          <Path key={p.id} d={p.d} stroke={lineColor} strokeWidth={2} fill="none" markerEnd="url(#weave-arrow)" opacity={0.55} />
        ))}
        {tempD && <Path d={tempD} stroke={lineColor} strokeWidth={2} strokeDasharray="5,5" fill="none" opacity={0.4} />}
      </Svg>

      {paths.map((p) =>
        editingConnectionId === p.id ? (
          <YStack key={p.id} position="absolute" left={p.midX - 70} top={p.midY - 32} width={140} flexDirection="row" gap="$1">
            <Input
              value={p.label}
              onChangeText={(v) => updateConnectionLabel(p.id, v)}
              onBlur={stopEditConnection}
              placeholder="7 PM, after dinner…"
              autoFocus
              flex={1}
              size="$2"
              br="$5"
              bg="$surface"
              borderColor="$movie"
              fontSize={11}
            />
            <Button unstyled onPress={() => removeConnection(p.id)} width={28} height={28} br="$5" bg="$backgroundSunken" ai="center" jc="center">
              <Text fontSize={11} color="$movie">✕</Text>
            </Button>
          </YStack>
        ) : p.label ? (
          <Button key={p.id} unstyled onPress={() => startEditConnection(p.id)} position="absolute" left={p.midX - 50} top={p.midY - 30}>
            <YStack bg="$surface" br="$5" px="$3" py="$2" borderWidth={1} borderColor="$borderColor">
              <Text fontSize={11} fontWeight="600" color="$color">{p.label}</Text>
            </YStack>
          </Button>
        ) : (
          <Button key={p.id} unstyled onPress={() => startEditConnection(p.id)} position="absolute" left={p.midX - 10} top={p.midY - 10} width={20} height={20} />
        )
      )}
    </>
  );
}
