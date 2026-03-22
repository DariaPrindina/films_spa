import { Button } from "@vkontakte/vkui";
import { useAppState } from "../../../app/providers/AppStateProvider";
import "./ComparePanel.css";

export function ComparePanel() {
  const { clearCompare, compareQueue } = useAppState();

  if (compareQueue.length === 0) {
    return null;
  }

  return (
    <section className="compare-panel surface-card">
      <div className="compare-panel__header">
        <div>
          <p className="eyebrow">Сравнение</p>
        </div>
        <Button mode="secondary" size="m" onClick={clearCompare}>
          Очистить
        </Button>
      </div>

      <div className="compare-panel__table-wrapper">
        <table className="compare-panel__table">
          <thead>
            <tr>
              <th>Параметр</th>
              {compareQueue.map((movie) => (
                <th key={movie.id}>{movie.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Название</td>
              {compareQueue.map((movie) => (
                <td key={`${movie.id}-title`}>{movie.title}</td>
              ))}
            </tr>
            <tr>
              <td>Год выпуска</td>
              {compareQueue.map((movie) => (
                <td key={`${movie.id}-year`}>{movie.year || "Не указан"}</td>
              ))}
            </tr>
            <tr>
              <td>Рейтинг</td>
              {compareQueue.map((movie) => (
                <td key={`${movie.id}-rating`}>{movie.rating.toFixed(1)}</td>
              ))}
            </tr>
            <tr>
              <td>Жанры</td>
              {compareQueue.map((movie) => (
                <td key={`${movie.id}-genres`}>{movie.genres.join(", ") || "Не указаны"}</td>
              ))}
            </tr>
            <tr>
              <td>Длительность</td>
              {compareQueue.map((movie) => (
                <td key={`${movie.id}-duration`}>
                  {movie.durationMinutes ? `${movie.durationMinutes} мин` : "Нет данных"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
