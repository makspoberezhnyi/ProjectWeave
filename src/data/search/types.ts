export interface SearchResultItem {
  title: string;
  subtitle: string;
  imageUrl?: string;
}

export type SearchStatus = 'ok' | 'needs_key' | 'needs_auth' | 'error';

export interface SearchOutcome {
  status: SearchStatus;
  results: SearchResultItem[];
  message?: string;
}
