import { SearchOutcome } from './types';

// BoardGameGeek's XML API — free, no key. No lightweight XML parser
// dependency needed since the response shape is small and predictable; a
// couple of targeted regexes are more honest here than pulling in a whole
// XML library for two fields. Same browser-CORS caveat as Steam.
function decodeXmlEntities(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function parseBggSearchXml(xml: string) {
  const items: { name: string; year?: string }[] = [];
  const itemRegex = /<item\b[^>]*>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(xml))) {
    const body = match[1];
    const nameMatch =
      body.match(/<name[^>]*type="primary"[^>]*value="([^"]*)"/) ?? body.match(/<name[^>]*value="([^"]*)"/);
    const yearMatch = body.match(/<yearpublished[^>]*value="([^"]*)"/);
    if (nameMatch) items.push({ name: decodeXmlEntities(nameMatch[1]), year: yearMatch?.[1] });
  }
  return items;
}

export async function searchBoardGames(query: string): Promise<SearchOutcome> {
  if (!query.trim()) return { status: 'ok', results: [] };
  try {
    const res = await fetch(
      `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`
    );
    if (!res.ok) throw new Error(`BoardGameGeek returned ${res.status}`);
    const xml = await res.text();
    const results = parseBggSearchXml(xml)
      .slice(0, 8)
      .map((it) => ({
        title: it.name,
        subtitle: it.year ? `${it.year} · Board Game` : 'Board Game',
      }));
    return { status: 'ok', results };
  } catch {
    return {
      status: 'error',
      results: [],
      message: 'Could not reach BoardGameGeek — this often fails from a web browser. Try the iOS/Android app.',
    };
  }
}
