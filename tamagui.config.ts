import { createTamagui, createTokens } from 'tamagui';
import { space } from './src/design-system/tokens/space';
import { radius } from './src/design-system/tokens/radius';
import { headingFont, bodyFont, fontSizeScale } from './src/design-system/tokens/typography';
import { themes } from './src/design-system/themes';

const tokens = createTokens({
  color: { white: '#FFFFFF', black: '#000000', transparent: 'transparent' },
  space,
  // Tamagui resolves fontSize="$N" against tokens.size, not the active
  // font's own size scale — so this must match fontSizeScale, not `space`.
  size: fontSizeScale,
  radius,
  zIndex: { 0: 0, 1: 100, 2: 200, 3: 300, true: 0 },
});

const config = createTamagui({
  tokens,
  themes,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  defaultFont: 'body',
  shorthands: {
    f: 'flex',
    fd: 'flexDirection',
    ai: 'alignItems',
    jc: 'justifyContent',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    pt: 'paddingTop',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    pr: 'paddingRight',
    p: 'padding',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    mt: 'marginTop',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mr: 'marginRight',
    m: 'margin',
    bg: 'backgroundColor',
    br: 'borderRadius',
    w: 'width',
    h: 'height',
    zi: 'zIndex',
    als: 'alignSelf',
  } as const,
});

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
