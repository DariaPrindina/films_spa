import type { AppStateSnapshot } from "../types";

const STORAGE_KEY = "films-spa-state";

export function loadState(): AppStateSnapshot {
  if (typeof window === "undefined") {
    return { favorites: [], compareQueue: [] };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { favorites: [], compareQueue: [] };
    }

    const parsed = JSON.parse(raw) as Partial<AppStateSnapshot>;
    return {
      favorites: parsed.favorites ?? [],
      compareQueue: parsed.compareQueue ?? []
    };
  } catch {
    return { favorites: [], compareQueue: [] };
  }
}

export function saveState(snapshot: AppStateSnapshot) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}
