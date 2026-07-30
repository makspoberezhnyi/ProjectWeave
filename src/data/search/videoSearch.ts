import { env } from '../../lib/env';
import { SearchOutcome } from './types';

export async function searchVideos(query: string): Promise<SearchOutcome> {
  if (!query.trim()) return { status: 'ok', results: [] };
  if (!env.youtubeApiKey) {
    return {
      status: 'needs_key',
      results: [],
      message: 'Add EXPO_PUBLIC_YOUTUBE_API_KEY to .env to search real videos.',
    };
  }
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(query)}&key=${env.youtubeApiKey}`
    );
    if (!res.ok) throw new Error(`YouTube returned ${res.status}`);
    const data = await res.json();
    const results = (data.items ?? []).map((v: any) => ({
      title: v.snippet.title as string,
      subtitle: 'YouTube · Video',
      imageUrl: v.snippet.thumbnails?.default?.url as string | undefined,
    }));
    return { status: 'ok', results };
  } catch {
    return { status: 'error', results: [], message: 'Could not reach YouTube.' };
  }
}
