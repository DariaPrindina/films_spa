var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(function (_a) {
    var _b, _c;
    var mode = _a.mode;
    var env = loadEnv(mode, ".", "");
    var kinopoiskApiKey = ((_b = env.KINOPOISK_API_KEY) === null || _b === void 0 ? void 0 : _b.trim()) || ((_c = env.VITE_KINOPOISK_API_KEY) === null || _c === void 0 ? void 0 : _c.trim());
    return {
        plugins: [react()],
        server: __assign({ port: 5173 }, (kinopoiskApiKey
            ? {
                proxy: {
                    "/api/kinopoisk": {
                        target: "https://api.poiskkino.dev",
                        changeOrigin: true,
                        rewrite: function (path) { return path.replace(/^\/api\/kinopoisk/, "/v1.4"); },
                        headers: {
                            accept: "application/json",
                            "X-API-KEY": kinopoiskApiKey
                        }
                    }
                }
            }
            : {}))
    };
});
