// Weave color tokens — v2 (Luma-inspired). One value per token per theme.
// Edit these to change the palette anywhere the app is themed from.

export const colorTokens = {
  light: {
    background: '#F5F4F1',
    surface: '#FFFFFF',
    surfaceSunken: '#EFEDE8',
    textPrimary: '#18170F',
    textSecondary: '#8C8880',
    border: '#E7E4DD',
    pillPrimaryBackground: '#18170F',
    pillPrimaryText: '#FFFFFF',
    pillSecondaryBackground: '#EFEDE8',
    pillSecondaryText: '#18170F',
    scrim: 'rgba(20,19,16,0.55)',
    info: '#4A7FD6',
    success: '#4E9E63',
    movie: '#E8604C',
    music: '#8B5FBF',
    book: '#D4A24C',
    video: '#3FA79B',
    playlist: '#B08FD9',
  },
  dark: {
    background: '#141310',
    surface: '#1D1B17',
    surfaceSunken: '#242119',
    textPrimary: '#F5F3EE',
    textSecondary: '#9C978C',
    border: '#332F27',
    pillPrimaryBackground: '#FFFFFF',
    pillPrimaryText: '#141310',
    pillSecondaryBackground: 'rgba(255,255,255,0.10)',
    pillSecondaryText: '#F5F3EE',
    scrim: 'rgba(0,0,0,0.55)',
    info: '#7FA6EE',
    success: '#7FC98D',
    movie: '#F0806C',
    music: '#A47FD1',
    book: '#E3B563',
    video: '#55C2B5',
    playlist: '#C7A9E3',
  },
} as const;

export type ColorTokenKey = keyof typeof colorTokens.light;
