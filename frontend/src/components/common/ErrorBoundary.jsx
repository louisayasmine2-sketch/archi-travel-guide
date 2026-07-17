import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // If it's a ChunkLoadError (lazy loading failed), we can force a reload.
    // This often happens after a new deployment when old chunks are removed,
    // or when BFCache serves a stale index.html.
    if (
      error.name === "ChunkLoadError" ||
      (error.message && error.message.includes("Loading chunk"))
    ) {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      // While it's reloading, or if it's a different error, show a fallback UI instead of a white page.
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] p-6 text-center">
          <div className="max-w-md">
            <h1 className="font-serif text-3xl text-[#2C211B] mb-4">Something went wrong</h1>
            <p className="text-[#8A9A5B] mb-6">
              We encountered an unexpected issue while loading this page. This usually happens when the app has been updated in the background.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#C65A3A] text-white rounded-full font-semibold hover:bg-[#A84A2E] transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
