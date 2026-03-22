import type { MovieFilters, MovieListResult, MovieSummary } from "../types";

const DEFAULT_REMOTE_API_URL = "https://api.poiskkino.dev/v1.4";
const DEV_PROXY_API_URL = "/api/kinopoisk";
const LEGACY_REMOTE_API_URL = "https://api.kinopoisk.dev/v1.4";

function resolveApiUrl() {
  const configuredApiUrl = import.meta.env.VITE_KINOPOISK_API_URL?.trim();

  if (!configuredApiUrl) {
    return DEV_PROXY_API_URL;
  }

  if (
    import.meta.env.DEV &&
    (configuredApiUrl === DEFAULT_REMOTE_API_URL || configuredApiUrl === LEGACY_REMOTE_API_URL)
  ) {
    return DEV_PROXY_API_URL;
  }

  return configuredApiUrl.replace(/\/$/, "");
}

const API_URL = resolveApiUrl();

interface KinopoiskListResponse {
  docs?: KinopoiskMovie[];
  total?: number;
  pages?: number;
}

interface KinopoiskMovie {
  id?: number;
  name?: string | null;
  alternativeName?: string | null;
  year?: number | null;
  description?: string | null;
  shortDescription?: string | null;
  movieLength?: number | null;
  genres?: Array<{ name?: string | null }>;
  poster?: { url?: string | null; previewUrl?: string | null } | null;
  rating?: { kp?: number | null; imdb?: number | null } | null;
  premiere?: { world?: string | null } | null;
}

function normalizeMovie(movie: KinopoiskMovie): MovieSummary | null {
  if (!movie.id) {
    return null;
  }

  const title = movie.name || movie.alternativeName || `Фильм #${movie.id}`;
  const rating = Number((movie.rating?.kp ?? movie.rating?.imdb ?? 0).toFixed(1));

  return {
    id: movie.id,
    title,
    year: movie.year ?? 0,
    rating,
    posterUrl: movie.poster?.url ?? movie.poster?.previewUrl ?? null,
    genres:
      movie.genres
        ?.map((genre) => genre.name?.trim())
        .filter((genre): genre is string => Boolean(genre)) ?? [],
    releaseDate: movie.premiere?.world ?? null,
    durationMinutes: movie.movieLength ?? null,
    description: movie.description || movie.shortDescription || "Описание отсутствует."
  };
}

function buildListParams(filters: MovieFilters, page: number, limit: number) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  params.set("type", "movie");
  params.set("year", `${filters.yearFrom}-${filters.yearTo}`);
  params.set("rating.kp", `${filters.ratingFrom}-${filters.ratingTo}`);
  params.append("selectFields", "id");
  params.append("selectFields", "name");
  params.append("selectFields", "alternativeName");
  params.append("selectFields", "year");
  params.append("selectFields", "description");
  params.append("selectFields", "shortDescription");
  params.append("selectFields", "movieLength");
  params.append("selectFields", "genres");
  params.append("selectFields", "poster");
  params.append("selectFields", "rating");
  params.append("selectFields", "premiere");

  if (filters.query.trim()) {
    params.set("query", filters.query.trim());
  }

  filters.genres.forEach((genre) => {
    params.append("genres.name", genre);
  });

  return params;
}

async function fetchFromKinopoisk(input: string, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`Kinopoisk API request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getMovies(
  filters: MovieFilters,
  page: number,
  limit: number
): Promise<MovieListResult> {
  const params = buildListParams(filters, page, limit);
  const data = (await fetchFromKinopoisk(
    `${API_URL}/movie?${params.toString()}`
  )) as KinopoiskListResponse;
  const movies =
    data.docs?.map(normalizeMovie).filter((movie): movie is MovieSummary => movie !== null) ?? [];

  return {
    movies,
    total: data.total ?? movies.length,
    pages: data.pages ?? 1
  };
}

export async function getMovieDetails(movieId: number): Promise<MovieSummary | null> {
  const data = (await fetchFromKinopoisk(`${API_URL}/movie/${movieId}`)) as KinopoiskMovie;
  return normalizeMovie(data);
}
