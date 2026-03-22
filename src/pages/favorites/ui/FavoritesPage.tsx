import { MovieCard } from "../../../entities/movie/ui/MovieCard";
import { useAppState } from "../../../app/providers/AppStateProvider";
import "./FavoritesPage.css";

export function FavoritesPage() {
  const { favorites } = useAppState();

  return (
    <section className="favorites-page">
      <section className="favorites-page__hero surface-card">
        <div>
          <p className="eyebrow">Избранное</p>
          <h2>Сохраненные фильмы</h2>
        </div>
        <span className="favorites-page__count">{favorites.length} в списке</span>
      </section>

      {favorites.length === 0 ? (
        <div className="status-card">
          Здесь пока пусто. Добавьте фильмы из каталога после подтверждения в модальном окне.
        </div>
      ) : (
        <div className="favorites-page__grid">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}
