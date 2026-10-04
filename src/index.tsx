import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import App from "./App";
import { installClientErrorTracking } from "./helpers/api-telemetry";
import rootReducer from "./slices";
import { isDev, getEnvironment } from "helpers/utils";
import { Environment } from "Common/enums/common-enum";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const store = configureStore({
  reducer: rootReducer,
  devTools: isDev,
});

if ([Environment.PRODUCTION, Environment.STAGING].includes(getEnvironment())) {
  posthog.init(process.env.REACT_APP_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.REACT_APP_POSTHOG_HOST || "https://us.i.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: false,
    loaded: (client) => { client.register({ source: "dashboard", release: process.env.REACT_APP_RELEASE || "unknown" }); installClientErrorTracking(); },
  });

  root.render(
    <React.StrictMode>
      <PostHogProvider
        client={posthog}
      >
        <Provider store={store}>
          <BrowserRouter
            basename={process.env.PUBLIC_URL}
            future={{
              v7_relativeSplatPath: true,
            }}
          >
            <App />
          </BrowserRouter>
        </Provider>
      </PostHogProvider>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter
          basename={process.env.PUBLIC_URL}
          future={{
            v7_relativeSplatPath: true,
          }}
        >
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}
