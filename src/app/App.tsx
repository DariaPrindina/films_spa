import { NavLink, Route, Routes } from "react-router-dom";
import { CatalogPage } from "../pages/catalog/ui/CatalogPage";
import { FavoritesPage } from "../pages/favorites/ui/FavoritesPage";
import { MovieDetailsPage } from "../pages/movie-details/ui/MovieDetailsPage";
import "./App.css";

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-shell__topbar">
        <div>
          <p className="eyebrow">Films SPA</p>
          <h1>Навигатор по фильмам</h1>
        </div>
        <nav className="app-shell__nav">
          <NavLink to="/" end>
            Каталог
          </NavLink>
          <NavLink to="/favorites">Избранное</NavLink>
        </nav>
      </header>

      <main className="app-shell__page">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
        </Routes>
      </main>
    </div>
  );
}
