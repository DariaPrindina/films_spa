import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AdaptivityProvider, AppRoot, ConfigProvider } from "@vkontakte/vkui";
import App from "./app/App";
import { AppStateProvider } from "./app/providers/AppStateProvider";
import "@vkontakte/vkui/dist/vkui.css";
import "./app/styles/global.css";
import "./shared/ui/surface/surface.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true
      }}
    >
      <ConfigProvider colorScheme="light">
        <AdaptivityProvider>
          <AppRoot>
            <AppStateProvider>
              <App />
            </AppStateProvider>
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
