import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeName } from 'tamagui';
import { MediaType } from '../data/types';
import { colorTokens } from '../design-system/tokens/colors';

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function mix(hexA: string, rgbB: [number, number, number], t: number) {
  const a = hexToRgb(hexA);
  const r = Math.round(a[0] + (rgbB[0] - a[0]) * t);
  const g = Math.round(a[1] + (rgbB[1] - a[1]) * t);
  const b = Math.round(a[2] + (rgbB[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

// Poster-style gradient cover, colored per media type — the v2 "colorful
// gradient cover" treatment instead of a flat tint or a real image.
export function MediaThumb({ type, radius = 12 }: { type: MediaType; radius?: number }) {
  const themeName = useThemeName() === 'dark' ? 'dark' : 'light';
  const accent = colorTokens[themeName][type];
  const colors = [mix(accent, [255, 255, 255], 0.45), accent, mix(accent, [0, 0, 0], 0.35)] as const;

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, borderRadius: radius }}
    />
  );
}
