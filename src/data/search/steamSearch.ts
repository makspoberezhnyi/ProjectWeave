import { SearchOutcome } from './types';

// Steam's store search endpoint — unofficial but stable, no key needed.
// Browsers often can't reach it directly (no CORS headers); native has no
// such restriction. The error message below reflects that.
export async function searchSteamGames(query: string): Promise<SearchOutcome> {
  if (!query.trim()) return { status: 'ok', results: [] };
  try {
    const res = await fetch(
      `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=US`
    );
    if (!res.ok) throw new Error(`Steam returned ${res.status}`);
    const data = await res.json();
    const results = (data.items ?? []).slice(0, 8).map((it: any) => ({
      title: it.name as string,
      subtitle: 'Steam · Game',
      imageUrl: it.tiny_image as string | undefined,
    }));
    return { status: 'ok', results };
  } catch {
    return {
      status: 'error',
      results: [],
      message: 'Could not reach Steam — this often fails from a web browser. Try the iOS/Android app.',
    };
  }
}
