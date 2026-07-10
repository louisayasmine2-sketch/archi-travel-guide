const runWhenIdle = (callback) => {
  if (typeof window === "undefined") return;

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: 4000 });
    return;
  }

  window.setTimeout(callback, 2500);
};

const deferUntilFirstPaint = () => {
  if (typeof window === "undefined") return;

  runWhenIdle(() => {
    window.dispatchEvent(new Event("archi:idle-ready"));
  });
};

deferUntilFirstPaint();
