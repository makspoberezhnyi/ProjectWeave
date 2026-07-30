import { getSpotifyAccessToken, isSpotifyConfigured } from '../../lib/spotifyAuth';
import { SearchOutcome } from './types';

export async function searchSpotify(query: string, kind: 'music' | 'playlist'): Promise<SearchOutcome> {
  if (!query.trim()) return { status: 'ok', results: [] };
  if (!isSpotifyConfigured()) {
    return {
      status: 'needs_key',
      results: [],
      message: 'Add EXPO_PUBLIC_SPOTIFY_CLIENT_ID to .env to enable Spotify search.',
    };
  }
  const token = await getSpotifyAccessToken();
  if (!token) {
    return { status: 'needs_auth', results: [], message: 'Connect Spotify to search real music and playlists.' };
  }
  const type = kind === 'playlist' ? 'playlist' : 'track';
  try {
    const res = await fetch(`https://api.spotify.com/v1/search?type=${type}&limit=8&q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Spotify returned ${res.status}`);
    const data = await res.json();
    if (type === 'track') {
      const results = (data.tracks?.items ?? []).map((t: any) => ({
        title: t.name as string,
        subtitle: `${(t.artists ?? []).map((a: any) => a.name).join(', ')} · Track`,
        imageUrl: t.album?.images?.[2]?.url ?? t.album?.images?.[0]?.url,
      }));
      return { status: 'ok', results };
    }
    const results = (data.playlists?.items ?? []).filter(Boolean).map((p: any) => ({
      title: p.name as string,
      subtitle: `${p.owner?.display_name ?? 'Spotify'} · Playlist`,
      imageUrl: p.images?.[0]?.url,
    }));
    return { status: 'ok', results };
  } catch {
    return { status: 'error', results: [], message: 'Could not reach Spotify.' };
  }
}
