import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@vkontakte/vkui";
import { useAppState } from "../../../app/providers/AppStateProvider";
import { getMovieDetails } from "../../../shared/api/movieSource";
import type { MovieSummary } from "../../../shared/types";
import { Modal } from "../../../shared/ui/modal/Modal";
import "./MovieDetailsPage.css";

function formatDate(date: string | null) {
  if (!date) {
    return "Не указана";
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "long" }).format(parsed);
}

export function MovieDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const movieId = Number(params.movieId);
  const { addFavorite, compareQueue, isCompared, isFavorite, removeFavorite, toggleCompare } =
    useAppState();
  const [movie, setMovie] = useState<MovieSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    getMovieDetails(movieId)
      .then((result) => {
        if (!cancelled) {
          setMovie(result);
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
  }, [movieId]);

  if (isLoading) {
    return <div className="status-card">Загрузка информации о фильме...</div>;
  }

  if (!movie) {
    return (
      <div className="movie-details-page movie-details-page--stack">
        <div className="status-card">Фильм не найден.</div>
        <Button mode="secondary" size="m" onClick={() => navigate("/")}>
          Вернуться в каталог
        </Button>
      </div>
    );
  }

  const favorite = isFavorite(movie.id);
  const compared = isCompared(movie.id);

  return (
    <>
      <section className="movie-details-page">
        <div className="movie-details-page__poster-card surface-card">
          {movie.posterUrl ? (
            <img
              className="movie-details-page__poster"
              src={movie.posterUrl}
              alt={`Постер ${movie.title}`}
            />
          ) : (
            <div className="movie-details-page__poster movie-details-page__poster--fallback">
              Постер недоступен
            </div>
          )}
        </div>

        <div className="movie-details-page__content surface-card">
          <p className="eyebrow">Карточка фильма</p>
          <h2>{movie.title}</h2>
          <p className="movie-details-page__description">{movie.description}</p>

          <div className="movie-details-page__grid">
            <div className="movie-details-page__cell">
              <span>Рейтинг</span>
              <strong>{movie.rating.toFixed(1)}</strong>
            </div>
            <div className="movie-details-page__cell">
              <span>Год выпуска</span>
              <strong>{movie.year || "Не указан"}</strong>
            </div>
            <div className="movie-details-page__cell">
              <span>Дата выхода</span>
              <strong>{formatDate(movie.releaseDate)}</strong>
            </div>
            <div className="movie-details-page__cell">
              <span>Жанры</span>
              <strong>{movie.genres.join(", ") || "Не указаны"}</strong>
            </div>
            <div className="movie-details-page__cell">
              <span>Длительность</span>
              <strong>
                {movie.durationMinutes ? `${movie.durationMinutes} мин` : "Нет данных"}
              </strong>
            </div>
            <div className="movie-details-page__cell">
              <span>Сравнение</span>
              <strong>{compareQueue.length}/2 выбрано</strong>
            </div>
          </div>

          <div className="movie-details-page__actions">
            <Button mode="secondary" size="m" onClick={() => navigate("/")}>
              Назад к каталогу
            </Button>

            {favorite ? (
              <Button mode="secondary" size="m" onClick={() => removeFavorite(movie.id)}>
                Убрать из избранного
              </Button>
            ) : (
              <Button mode="primary" size="m" onClick={() => setIsModalOpen(true)}>
                Добавить в избранное
              </Button>
            )}

            <Button
              mode={compared ? "primary" : "secondary"}
              appearance={compared ? "accent" : "neutral"}
              size="m"
              onClick={() => toggleCompare(movie)}
            >
              {compared ? "Убрать из сравнения" : "Добавить в сравнение"}
            </Button>
          </div>
        </div>
      </section>

      {isModalOpen ? (
        <Modal
          title="Подтвердите добавление"
          description={`Добавить "${movie.title}" в избранное? При отмене фильм не будет сохранен.`}
          confirmLabel="Подтвердить"
          cancelLabel="Отмена"
          onCancel={() => setIsModalOpen(false)}
          onConfirm={() => {
            addFavorite(movie);
            setIsModalOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
