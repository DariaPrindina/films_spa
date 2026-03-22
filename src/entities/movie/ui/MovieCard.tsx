import { useState } from "react";
import { Icon24Favorite, Icon24FavoriteOutline, Icon28PictureCircleFill, Icon28StarsCircleFillViolet } from "@vkontakte/icons";
import { Button, IconButton } from "@vkontakte/vkui";
import { Link } from "react-router-dom";
import { useAppState } from "../../../app/providers/AppStateProvider";
import type { MovieSummary } from "../../../shared/types";
import { Modal } from "../../../shared/ui/modal/Modal";
import "./MovieCard.css";

interface MovieCardProps {
  movie: MovieSummary;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { addFavorite, isFavorite, isCompared, removeFavorite, toggleCompare } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const favorite = isFavorite(movie.id);
  const compared = isCompared(movie.id);
  const handleFavoriteClick = () => {
    if (favorite) {
      removeFavorite(movie.id);
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <>
      <article className="movie-card surface-card">
        <Link to={`/movies/${movie.id}`} className="movie-card__poster-link">
          {movie.posterUrl ? (
            <img
              className="movie-card__poster"
              src={movie.posterUrl}
              alt={`Постер: ${movie.title}`}
              loading="lazy"
            />
          ) : (
            <div className="movie-card__poster movie-card__poster--fallback" aria-label="Постер недоступен">
              <div className="movie-card__poster-placeholder">
                <Icon28PictureCircleFill />
                <span>{movie.title}</span>
              </div>
            </div>
          )}
        </Link>

        <div className="movie-card__content">
          <div className="movie-card__meta">
            <span>{movie.year || "Год неизвестен"}</span>
            <span className="movie-card__rating">
              <Icon28StarsCircleFillViolet className="movie-card__meta-icon" />
              {movie.rating.toFixed(1)}
            </span>
          </div>

          <Link to={`/movies/${movie.id}`} className="movie-card__title">
            {movie.title}
          </Link>

          <p className="movie-card__genres">{movie.genres.join(" • ") || "Жанры не указаны"}</p>

          <div className="movie-card__actions">
            <IconButton
              className={`movie-card__icon-button${favorite ? " movie-card__icon-button--active" : ""}`}
              onClick={handleFavoriteClick}
              aria-label={favorite ? "Убрать из избранного" : "Добавить в избранное"}
              title={favorite ? "Убрать из избранного" : "Добавить в избранное"}
              hasHover={false}
              hasActive={false}
            >
              {favorite ? <Icon24Favorite /> : <Icon24FavoriteOutline />}
            </IconButton>

            <Button
              className="movie-card__compare-button"
              mode={compared ? "primary" : "secondary"}
              appearance={compared ? "accent" : "neutral"}
              size="m"
              onClick={() => toggleCompare(movie)}
            >
              {compared ? "Убрать из сравнения" : "Сравнить"}
            </Button>
          </div>
        </div>
      </article>

      {isModalOpen ? (
        <Modal
          title="Добавить в избранное?"
          description={`Фильм "${movie.title}" будет сохранен на отдельной странице и останется после перезагрузки.`}
          confirmLabel="Добавить"
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
