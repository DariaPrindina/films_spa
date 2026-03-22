import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../../shared/config/constants";
import { MovieCard } from "../../../entities/movie/ui/MovieCard";
import { getMovies } from "../../../shared/api/movieSource";
import { filtersFromSearchParams, filtersToSearchParams } from "../../../shared/lib/urlFilters";
import type { MovieSummary } from "../../../shared/types";
import { ComparePanel } from "../../../widgets/compare-panel/ui/ComparePanel";
import { FiltersPanel } from "../../../widgets/filters-panel/ui/FiltersPanel";
import "./CatalogPage.css";

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => filtersFromSearchParams(searchParams), [searchParams]);
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getMovies(filters, page, PAGE_SIZE)
      .then((result) => {
        if (cancelled) {
          return;
        }

        setPages(result.pages);
        setTotal(result.total);
        setMovies((current) => (page === 1 ? result.movies : [...current, ...result.movies]));
      })
      .catch(() => {
        if (!cancelled) {
          setError("Не удалось загрузить фильмы.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && !isLoading && page < pages) {
          setPage((current) => current + 1);
        }
      },
      {
        rootMargin: "200px"
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isLoading, page, pages]);

  return (
    <div className="catalog-page">
      <FiltersPanel
        filters={filters}
        onChange={(nextFilters) => {
          setSearchParams(filtersToSearchParams(nextFilters), { replace: true });
        }}
      />

      <section className="catalog-page__content">
        <section className="catalog-page__hero surface-card">
          <div>
            <p className="eyebrow">Каталог</p>
          </div>
          <div className="catalog-page__metrics">
            <span>{total} фильмов найдено</span>
          </div>
        </section>

        <ComparePanel />

        {error ? <div className="status-card">{error}</div> : null}

        <div className="catalog-page__grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {!isLoading && movies.length === 0 ? (
          <div className="status-card">По выбранным фильтрам фильмы не найдены.</div>
        ) : null}

        {isLoading ? <div className="status-card">Загрузка фильмов...</div> : null}
        <div ref={sentinelRef} className="catalog-page__sentinel" />
      </section>
    </div>
  );
}
