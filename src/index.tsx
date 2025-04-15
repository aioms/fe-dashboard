import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { PostHogProvider } from "posthog-js/react";

import App from "./App";
import rootReducer from "./slices";
import { isDev } from "helpers/utils";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const store = configureStore({
  reducer: rootReducer,
  devTools: isDev,
});

if (isDev) {
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
    </React.StrictMode>,
  );
} else {
  root.render(
    <React.StrictMode>
      <PostHogProvider
        apiKey={process.env.REACT_APP_PUBLIC_POSTHOG_KEY!}
        options={{
          api_host:
            process.env.REACT_APP_POSTHOG_HOST || "https://eu.i.posthog.com",
        }}
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
    </React.StrictMode>,
  );
}
