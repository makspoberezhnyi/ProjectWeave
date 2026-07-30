export type MediaType = 'movie' | 'music' | 'book' | 'video' | 'playlist' | 'steamgame' | 'boardgame';
export type Status = 'want' | 'in_progress' | 'done';

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  subtitle: string;
  status: Status;
  rating: number | null;
  placed: boolean;
  x: number;
  y: number;
  reminderAt: number | null; // epoch ms
  imageUrl?: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  label: string;
}

export const MEDIA_TYPES: MediaType[] = ['movie', 'music', 'book', 'video', 'playlist', 'steamgame', 'boardgame'];

export const TYPE_LABEL: Record<MediaType, string> = {
  movie: 'Movie',
  music: 'Music',
  book: 'Book',
  video: 'Video',
  playlist: 'Playlist',
  steamgame: 'Steam Game',
  boardgame: 'Board Game',
};
