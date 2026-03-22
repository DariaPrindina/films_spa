import { DEFAULT_FILTERS } from "../config/constants";
import type { MovieFilters } from "../types";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function filtersFromSearchParams(searchParams: URLSearchParams): MovieFilters {
  const ratingFrom = clamp(
    Number(searchParams.get("ratingFrom") ?? DEFAULT_FILTERS.ratingFrom),
    0,
    10
  );
  const ratingTo = clamp(
    Number(searchParams.get("ratingTo") ?? DEFAULT_FILTERS.ratingTo),
    0,
    10
  );
  const currentYear = DEFAULT_FILTERS.yearTo;
  const yearFrom = clamp(
    Number(searchParams.get("yearFrom") ?? DEFAULT_FILTERS.yearFrom),
    1990,
    currentYear
  );
  const yearTo = clamp(
    Number(searchParams.get("yearTo") ?? DEFAULT_FILTERS.yearTo),
    1990,
    currentYear
  );

  return {
    query: searchParams.get("query") ?? DEFAULT_FILTERS.query,
    genres: searchParams.getAll("genre"),
    ratingFrom: Math.min(ratingFrom, ratingTo),
    ratingTo: Math.max(ratingFrom, ratingTo),
    yearFrom: Math.min(yearFrom, yearTo),
    yearTo: Math.max(yearFrom, yearTo)
  };
}

export function filtersToSearchParams(filters: MovieFilters) {
  const next = new URLSearchParams();

  if (filters.query.trim()) {
    next.set("query", filters.query.trim());
  }

  filters.genres.forEach((genre) => next.append("genre", genre));

  if (filters.ratingFrom !== DEFAULT_FILTERS.ratingFrom) {
    next.set("ratingFrom", String(filters.ratingFrom));
  }
  if (filters.ratingTo !== DEFAULT_FILTERS.ratingTo) {
    next.set("ratingTo", String(filters.ratingTo));
  }
  if (filters.yearFrom !== DEFAULT_FILTERS.yearFrom) {
    next.set("yearFrom", String(filters.yearFrom));
  }
  if (filters.yearTo !== DEFAULT_FILTERS.yearTo) {
    next.set("yearTo", String(filters.yearTo));
  }

  return next;
}
