import React, { useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { Button, Text, XStack, YStack, useThemeName } from 'tamagui';
import Svg, { Defs, Marker, Path } from 'react-native-svg';
import { CARD_CONNECT_Y, CARD_H, CARD_W } from '../data/canvas';
import { colorTokens } from '../design-system/tokens/colors';
import { useWeaveStore } from '../state/store';
import { MediaThumb } from '../components/MediaThumb';

const BOX_W = 720;
const BOX_H = 420;
const PAD = 30;

function computeFit(placed: { x: number; y: number }[]) {
  if (!placed.length) return { scale: 1, offset: { x: PAD, y: PAD } };
  const minX = Math.min(...placed.map((i) => i.x));
  const minY = Math.min(...placed.map((i) => i.y));
  const maxX = Math.max(...placed.map((i) => i.x + CARD_W));
  const maxY = Math.max(...placed.map((i) => i.y + CARD_H));
  const cw = maxX - minX;
  const ch = maxY - minY;
  const scale = Math.min(1.2, Math.max(0.3, Math.min((BOX_W - 2 * PAD) / cw, (BOX_H - 2 * PAD) / ch)));
  return {
    scale,
    offset: {
      x: PAD - minX * scale + Math.max(0, (BOX_W - 2 * PAD - cw * scale) / 2),
      y: PAD - minY * scale + Math.max(0, (BOX_H - 2 * PAD - ch * scale) / 2),
    },
  };
}

export function ExportOverlay() {
  const items = useWeaveStore((s) => s.items);
  const connections = useWeaveStore((s) => s.connections);
  const closeOverlay = useWeaveStore((s) => s.closeOverlay);
  const themeName = useThemeName() === 'dark' ? 'dark' : 'light';
  const tokens = colorTokens[themeName];
  const [downloading, setDownloading] = useState(false);

  const placed = items.filter((i) => i.placed);
  const { scale, offset } = computeFit(placed);
  const previewRef = useRef<View>(null);

  const find = (id: string) => items.find((i) => i.id === id);
  const paths = connections
    .map((c) => {
      const from = find(c.from);
      const to = find(c.to);
      if (!from || !to || !from.placed || !to.placed) return null;
      const fx = from.x + CARD_W;
      const fy = from.y + CARD_CONNECT_Y;
      const tx = to.x;
      const ty = to.y + CARD_CONNECT_Y;
      const c1x = fx + 80;
      const c2x = tx - 80;
      const d = `M ${fx} ${fy} C ${c1x} ${fy}, ${c2x} ${ty}, ${tx} ${ty}`;
      const midX = (fx + 3 * c1x + 3 * c2x + tx) / 8;
      const midY = (fy + 3 * fy + 3 * ty + ty) / 8;
      return { id: c.id, d, midX, midY, label: c.label };
    })
    .filter(Boolean) as { id: string; d: string; midX: number; midY: number; label: string }[];

  const handleDownload = async () => {
    if (Platform.OS !== 'web' || !previewRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(previewRef.current as unknown as HTMLElement, {
        backgroundColor: tokens.background,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = 'weave-plan.png';
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <YStack position="absolute" inset={0} bg="$scrim" zi={30} ai="center" jc="center" p="$5">
      <YStack bg="$background" br="$4" overflow="hidden" maxWidth={900} width="100%" borderWidth={1} borderColor="$borderColor">
        <XStack ai="center" jc="space-between" p="$4" borderBottomWidth={1} borderColor="$borderColor">
          <Text fontSize={17} fontWeight="700" color="$color">Export Plan</Text>
          <Button unstyled onPress={closeOverlay} width={32} height={32} br="$5" borderWidth={1} borderColor="$borderColor" ai="center" jc="center">
            <Text color="$color">✕</Text>
          </Button>
        </XStack>

        <YStack p="$5" ai="center" gap="$5">
          <View
            ref={previewRef}
            style={{
              width: BOX_W,
              maxWidth: '100%',
              height: BOX_H,
              backgroundColor: tokens.background,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: tokens.border,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {placed.length === 0 ? (
              <YStack position="absolute" inset={0} ai="center" jc="center">
                <Text fontSize={13} color="$colorSecondary">Nothing placed on the canvas yet.</Text>
              </YStack>
            ) : (
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 1,
                  height: 1,
                  transform: [{ translateX: offset.x }, { translateY: offset.y }, { scale }],
                }}
              >
                <Svg style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }} width={1} height={1}>
                  <Defs>
                    <Marker id="weave-arrow-export" markerWidth={8} markerHeight={8} refX={6} refY={3} orient="auto">
                      <Path d="M0,0 L6,3 L0,6 Z" fill={tokens.textPrimary} />
                    </Marker>
                  </Defs>
                  {paths.map((p) => (
                    <Path key={p.id} d={p.d} stroke={tokens.textPrimary} strokeWidth={2} fill="none" markerEnd="url(#weave-arrow-export)" opacity={0.55} />
                  ))}
                </Svg>
                {paths.map(
                  (p) =>
                    p.label && (
                      <YStack
                        key={p.id}
                        position="absolute"
                        left={p.midX - 50}
                        top={p.midY - 30}
                        bg="$surface"
                        br="$5"
                        px="$3"
                        py="$2"
                        borderWidth={1}
                        borderColor="$borderColor"
                      >
                        <Text fontSize={11} fontWeight="600" color="$color">{p.label}</Text>
                      </YStack>
                    )
                )}
                {placed.map((item) => (
                  <YStack key={item.id} position="absolute" left={item.x} top={item.y} width={CARD_W} bg="$surface" br="$4" overflow="hidden" borderWidth={1} borderColor="$borderColor">
                    <YStack height={90}>
                      <MediaThumb type={item.type} radius={0} />
                    </YStack>
                    <YStack p="$3">
                      <Text fontSize={13} fontWeight="600" color="$color" numberOfLines={1}>{item.title}</Text>
                    </YStack>
                  </YStack>
                ))}
              </View>
            )}
          </View>

          <XStack gap="$3" flexWrap="wrap" jc="center">
            <Button unstyled onPress={handleDownload} disabled={downloading || Platform.OS !== 'web'} bg="$pillPrimaryBackground" br="$2" px="$5" py="$3" opacity={Platform.OS !== 'web' ? 0.5 : 1}>
              <Text color="$pillPrimaryText" fontWeight="700" fontSize={13}>
                {downloading ? 'Preparing…' : Platform.OS === 'web' ? 'Download PNG' : 'PNG export (web only for now)'}
              </Text>
            </Button>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
