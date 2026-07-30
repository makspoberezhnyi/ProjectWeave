import { MediaType } from './types';

// Placeholder results until real search (TMDB/Spotify/Open Library/YouTube)
// is wired in — swap RESULT_POOL[type] lookups in useSearchResults for a
// real API call per type without touching the Save screen itself.
export const RESULT_POOL: Record<MediaType, { title: string; subtitle: string }[]> = {
  movie: [
    { title: 'Everything Everywhere All at Once', subtitle: '2022 · Movie' },
    { title: 'Dune: Part Two', subtitle: '2024 · Movie' },
    { title: 'The Grand Budapest Hotel', subtitle: '2014 · Movie' },
    { title: 'Parasite', subtitle: '2019 · Movie' },
    { title: 'Spirited Away', subtitle: '2001 · Movie' },
  ],
  music: [
    { title: 'Discovery', subtitle: 'Daft Punk · Album' },
    { title: 'Blonde', subtitle: 'Frank Ocean · Album' },
    { title: 'In Rainbows', subtitle: 'Radiohead · Album' },
    { title: 'Random Access Memories', subtitle: 'Daft Punk · Album' },
  ],
  book: [
    { title: 'Project Hail Mary', subtitle: 'Andy Weir · Book' },
    { title: 'Klara and the Sun', subtitle: 'Kazuo Ishiguro · Book' },
    { title: 'Piranesi', subtitle: 'Susanna Clarke · Book' },
  ],
  video: [
    { title: 'How To Make Pasta From Scratch', subtitle: 'YouTube · Video' },
    { title: 'A Short History of Almost Everything', subtitle: 'YouTube · Video essay' },
    { title: 'Behind the Scenes: Dune', subtitle: 'YouTube · Video' },
  ],
  playlist: [
    { title: 'Friday Night Chill', subtitle: 'Spotify · Playlist' },
    { title: 'Road Trip Mix', subtitle: 'Spotify · Playlist' },
    { title: 'Focus Flow', subtitle: 'Spotify · Playlist' },
  ],
};
