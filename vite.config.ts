import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const kinopoiskApiKey =
    env.KINOPOISK_API_KEY?.trim() || env.VITE_KINOPOISK_API_KEY?.trim();

  return {
    plugins: [react()],
    server: {
      port: 5173,
      ...(kinopoiskApiKey
        ? {
            proxy: {
              "/api/kinopoisk": {
                target: "https://api.poiskkino.dev",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/kinopoisk/, "/v1.4"),
                headers: {
                  accept: "application/json",
                  "X-API-KEY": kinopoiskApiKey
                }
              }
            }
          }
        : {})
    }
  };
});
