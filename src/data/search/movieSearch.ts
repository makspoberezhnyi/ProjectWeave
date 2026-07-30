import { env } from '../../lib/env';
import { SearchOutcome } from './types';

export async function searchMovies(query: string): Promise<SearchOutcome> {
  if (!query.trim()) return { status: 'ok', results: [] };
  if (!env.tmdbApiKey) {
    return { status: 'needs_key', results: [], message: 'Add EXPO_PUBLIC_TMDB_API_KEY to .env to search real movies.' };
  }
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${env.tmdbApiKey}`
    );
    if (!res.ok) throw new Error(`TMDB returned ${res.status}`);
    const data = await res.json();
    const results = (data.results ?? []).slice(0, 8).map((m: any) => ({
      title: m.title as string,
      subtitle: [m.release_date?.slice(0, 4), 'Movie'].filter(Boolean).join(' · '),
      imageUrl: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : undefined,
    }));
    return { status: 'ok', results };
  } catch {
    return { status: 'error', results: [], message: 'Could not reach TMDB.' };
  }
}
