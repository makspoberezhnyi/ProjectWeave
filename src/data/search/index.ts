import { MediaType } from '../types';
import { searchBoardGames } from './boardGameSearch';
import { searchBooks } from './bookSearch';
import { searchMovies } from './movieSearch';
import { searchSpotify } from './musicSearch';
import { searchSteamGames } from './steamSearch';
import { SearchOutcome } from './types';
import { searchVideos } from './videoSearch';

export type { SearchOutcome, SearchResultItem, SearchStatus } from './types';

export function searchByType(type: MediaType, query: string): Promise<SearchOutcome> {
  switch (type) {
    case 'book':
      return searchBooks(query);
    case 'steamgame':
      return searchSteamGames(query);
    case 'boardgame':
      return searchBoardGames(query);
    case 'movie':
      return searchMovies(query);
    case 'video':
      return searchVideos(query);
    case 'music':
      return searchSpotify(query, 'music');
    case 'playlist':
      return searchSpotify(query, 'playlist');
  }
}
