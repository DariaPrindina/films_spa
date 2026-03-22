import { useEffect, useState } from "react";
import { FormItem, Input } from "@vkontakte/vkui";
import { GENRE_OPTIONS } from "../../../shared/config/constants";
import type { MovieFilters } from "../../../shared/types";
import "./FiltersPanel.css";

interface FiltersPanelProps {
  filters: MovieFilters;
  onChange: (filters: MovieFilters) => void;
}

const RANGE_FILTER_DEBOUNCE_MS = 450;

interface DualRangeProps {
  min: number;
  max: number;
  step: number;
  from: number;
  to: number;
  onFromChange: (value: number) => void;
  onToChange: (value: number) => void;
}

function DualRange(props: DualRangeProps) {
  const { min, max, step, from, to, onFromChange, onToChange } = props;
  const start = ((from - min) / (max - min)) * 100;
  const end = ((to - min) / (max - min)) * 100;

  return (
    <div className="filters-panel__dual-range">
      <div className="filters-panel__dual-range-track" />
      <div
        className="filters-panel__dual-range-selection"
        style={{ left: `${start}%`, width: `${Math.max(end - start, 0)}%` }}
      />
      <input
        className="filters-panel__dual-range-input"
        type="range"
        min={String(min)}
        max={String(max)}
        step={String(step)}
        value={from}
        onChange={(event) => onFromChange(Number(event.target.value))}
      />
      <input
        className="filters-panel__dual-range-input"
        type="range"
        min={String(min)}
        max={String(max)}
        step={String(step)}
        value={to}
        onChange={(event) => onToChange(Number(event.target.value))}
      />
    </div>
  );
}

export function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
  const [ratingDraft, setRatingDraft] = useState({
    from: filters.ratingFrom,
    to: filters.ratingTo
  });
  const [yearDraft, setYearDraft] = useState({
    from: filters.yearFrom,
    to: filters.yearTo
  });

  useEffect(() => {
    setRatingDraft({ from: filters.ratingFrom, to: filters.ratingTo });
  }, [filters.ratingFrom, filters.ratingTo]);

  useEffect(() => {
    setYearDraft({ from: filters.yearFrom, to: filters.yearTo });
  }, [filters.yearFrom, filters.yearTo]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (ratingDraft.from === filters.ratingFrom && ratingDraft.to === filters.ratingTo) {
        return;
      }

      onChange({
        ...filters,
        ratingFrom: ratingDraft.from,
        ratingTo: ratingDraft.to
      });
    }, RANGE_FILTER_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [filters, onChange, ratingDraft]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (yearDraft.from === filters.yearFrom && yearDraft.to === filters.yearTo) {
        return;
      }

      onChange({
        ...filters,
        yearFrom: yearDraft.from,
        yearTo: yearDraft.to
      });
    }, RANGE_FILTER_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [filters, onChange, yearDraft]);

  return (
    <aside className="filters-panel">
      <section className="filters-panel__card surface-card">
        <FormItem top="Поиск" className="filters-panel__form-item">
          <Input
            id="movie-search"
            value={filters.query}
            onChange={(event) =>
              onChange({
                ...filters,
                query: event.target.value
              })
            }
            placeholder="Название или описание"
          />
        </FormItem>
      </section>

      <section className="filters-panel__card surface-card">
        <p className="filters-panel__title">Жанры</p>
        <div className="filters-panel__genre-grid">
          {GENRE_OPTIONS.map((genre) => {
            const checked = filters.genres.includes(genre);
            return (
              <label key={genre} className="filters-panel__chip">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onChange({
                      ...filters,
                      genres: checked
                        ? filters.genres.filter((item) => item !== genre)
                        : [...filters.genres, genre]
                    })
                  }
                />
                <span>{genre}</span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="filters-panel__card surface-card">
        <div className="filters-panel__range-header">
          <p className="filters-panel__title">Рейтинг</p>
          <span>
            {ratingDraft.from.toFixed(1)} - {ratingDraft.to.toFixed(1)}
          </span>
        </div>
        <DualRange
          min={0}
          max={10}
          step={0.1}
          from={ratingDraft.from}
          to={ratingDraft.to}
          onFromChange={(value) =>
            setRatingDraft((current) => ({ from: Math.min(value, current.to), to: current.to }))
          }
          onToChange={(value) =>
            setRatingDraft((current) => ({ from: current.from, to: Math.max(value, current.from) }))
          }
        />
      </section>

      <section className="filters-panel__card surface-card">
        <div className="filters-panel__range-header">
          <p className="filters-panel__title">Год выпуска</p>
          <span>
            {yearDraft.from} - {yearDraft.to}
          </span>
        </div>
        <DualRange
          min={1990}
          max={new Date().getFullYear()}
          step={1}
          from={yearDraft.from}
          to={yearDraft.to}
          onFromChange={(value) =>
            setYearDraft((current) => ({ from: Math.min(value, current.to), to: current.to }))
          }
          onToChange={(value) =>
            setYearDraft((current) => ({ from: current.from, to: Math.max(value, current.from) }))
          }
        />
      </section>
    </aside>
  );
}
