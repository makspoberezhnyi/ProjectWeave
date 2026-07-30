import { SearchOutcome } from './types';

// Open Library — free, no key, CORS-friendly.
export async function searchBooks(query: string): Promise<SearchOutcome> {
  if (!query.trim()) return { status: 'ok', results: [] };
  try {
    const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8`);
    if (!res.ok) throw new Error(`Open Library returned ${res.status}`);
    const data = await res.json();
    const results = (data.docs ?? []).slice(0, 8).map((d: any) => ({
      title: d.title as string,
      subtitle: [d.author_name?.[0], d.first_publish_year].filter(Boolean).join(' · ') || 'Book',
      imageUrl: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : undefined,
    }));
    return { status: 'ok', results };
  } catch {
    return { status: 'error', results: [], message: 'Could not reach Open Library.' };
  }
}
