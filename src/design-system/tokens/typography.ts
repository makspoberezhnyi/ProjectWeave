import { Platform } from 'react-native';
import { createFont } from 'tamagui';

// System sans everywhere — matches the reference direction (bold display,
// quiet body) without shipping a webfont. RN uses the OS default; web gets
// the same stack the prototype used.
const family = Platform.select({
  web: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  default: 'System',
});

// Scale: 1 caption · 2 small · 3 body · 4 card title · 5 section title · 6 display
// Exported as the numbers components pass directly to fontSize — Tamagui's
// bare `fontSize="$N"` shorthand resolves against tokens.space, not this
// scale, so call sites use fontSize={fontSizeScale[N]} instead of "$N".
export const fontSizeScale = { 1: 11, 2: 13, 3: 15, 4: 17, 5: 22, 6: 34, true: 15 } as const;
const size = fontSizeScale;
const lineHeight = { 1: 14, 2: 18, 3: 22, 4: 22, 5: 28, 6: 39, true: 22 } as const;
const letterSpacing = { 1: 0.4, 2: 0, 3: 0, 4: 0, 5: -0.2, 6: -0.6, true: 0 } as const;

export const headingFont = createFont({
  family,
  size,
  lineHeight,
  letterSpacing,
  weight: { 1: '700', 2: '700', 3: '700', 4: '600', 5: '700', 6: '800', true: '700' },
});

export const bodyFont = createFont({
  family,
  size,
  lineHeight,
  letterSpacing,
  weight: { 1: '700', 2: '400', 3: '400', 4: '600', 5: '700', 6: '800', true: '400' },
});
