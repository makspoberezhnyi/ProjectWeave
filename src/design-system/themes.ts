import { colorTokens } from './tokens/colors';

// One theme object per mode. Keys are the semantic names components style
// against (e.g. theme.movie, theme.pillPrimaryBackground) — never a raw hex.
function buildTheme(mode: keyof typeof colorTokens) {
  const c = colorTokens[mode];
  return {
    background: c.background,
    backgroundSunken: c.surfaceSunken,
    surface: c.surface,
    color: c.textPrimary,
    colorSecondary: c.textSecondary,
    borderColor: c.border,
    pillPrimaryBackground: c.pillPrimaryBackground,
    pillPrimaryText: c.pillPrimaryText,
    pillSecondaryBackground: c.pillSecondaryBackground,
    pillSecondaryText: c.pillSecondaryText,
    scrim: c.scrim,
    info: c.info,
    success: c.success,
    movie: c.movie,
    music: c.music,
    book: c.book,
    video: c.video,
    playlist: c.playlist,
    steamgame: c.steamgame,
    boardgame: c.boardgame,
  };
}

export const themes = {
  light: buildTheme('light'),
  dark: buildTheme('dark'),
} as const;
