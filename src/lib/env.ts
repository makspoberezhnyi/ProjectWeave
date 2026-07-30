// EXPO_PUBLIC_* vars are inlined at build time from .env — see .env.example.
export const env = {
  tmdbApiKey: process.env.EXPO_PUBLIC_TMDB_API_KEY ?? '',
  youtubeApiKey: process.env.EXPO_PUBLIC_YOUTUBE_API_KEY ?? '',
  spotifyClientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID ?? '',
};
