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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RemoveStaticFallback />
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
