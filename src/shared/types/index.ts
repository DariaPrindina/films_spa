export interface MovieSummary {
  id: number;
  title: string;
  year: number;
  rating: number;
  posterUrl: string | null;
  genres: string[];
  releaseDate: string | null;
  durationMinutes: number | null;
  description: string;
}

export interface MovieListResult {
  movies: MovieSummary[];
  total: number;
  pages: number;
}

export interface MovieFilters {
  query: string;
  genres: string[];
  ratingFrom: number;
  ratingTo: number;
  yearFrom: number;
  yearTo: number;
}

export interface AppStateSnapshot {
  favorites: MovieSummary[];
  compareQueue: MovieSummary[];
}
