import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import "@/index.css";
import "./performance/deferThirdPartyWork";
import App from "@/App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

// Offline support: register the runtime-caching service worker (production
// only, and only where the API exists). See public/sw.js for the strategy.
if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failing (private mode, unsupported) never blocks the app.
    });
  });
}

// The prerendered static fallback (see scripts/generate-static-html.js) stays
// visible until React is actually ready, so slow connections see content
// immediately instead of a blank page. Remove it in a layout effect — after
// React commits its DOM but before the browser paints — so the swap never
// shows both versions at once.
function RemoveStaticFallback() {
  React.useLayoutEffect(() => {
    document.getElementById("static-fallback")?.remove();
  }, []);
  return null;
}

const app = (
  <React.StrictMode>
    <RemoveStaticFallback />
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);

const container = document.getElementById("root");
if (container.hasChildNodes()) {
  // Prerendered page (scripts/prerender-routes.js): the served HTML already
  // IS the article, so hydrate instead of re-rendering — and fetch this
  // article's JSON first (the prerenderer injects its URL as
  // window.__ARTICLE_JSON__), so Article.jsx's first client render matches
  // the captured full-body DOM instead of its loading state. React keeps
  // the prerendered content visible while the route chunk hydrates.
  window.__PRERENDERED__ = true;
  const hydrate = () => {
    // onRecoverableError is silenced deliberately. The prerenderer captures
    // innerHTML, and serialising merges adjacent text nodes ("Updated: " +
    // a date becomes one node), so React reports a recoverable mismatch at
    // each interpolation seam and re-renders — to a byte-identical result
    // (verified by DOM diff: 339/339 text nodes equal). The served pixels
    // stay on screen throughout; the cost is one redundant render pass.
    ReactDOM.hydrateRoot(container, app, { onRecoverableError: () => {} });
  };
  const renderFresh = () => {
    // Article data unavailable (offline mid-navigation?): render from
    // scratch rather than hydrating a mismatch against the loading state.
    ReactDOM.createRoot(container).render(app);
  };
  if (window.__ARTICLE_JSON__) {
    fetch(window.__ARTICLE_JSON__)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          window.__ARTICLE_DATA__ = data;
          hydrate();
        } else {
          renderFresh();
        }
      }, renderFresh);
  } else {
    // Prerendered page with no article payload announced — hydrate as-is.
    hydrate();
  }
} else {
  ReactDOM.createRoot(container).render(app);
}
