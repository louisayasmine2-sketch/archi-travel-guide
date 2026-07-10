const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;
const CLARITY_PROJECT_ID = process.env.REACT_APP_CLARITY_PROJECT_ID;
const AMPLITUDE_API_KEY = process.env.REACT_APP_AMPLITUDE_API_KEY;
const AMPLITUDE_SERVER_ZONE = process.env.REACT_APP_AMPLITUDE_SERVER_ZONE;
const COOKIE_CONSENT_KEY = "archi_cookie_consent";
const SHOULD_TRACK = process.env.NODE_ENV === "production" && typeof GA_MEASUREMENT_ID === "string" && GA_MEASUREMENT_ID.trim().length > 0;
const SHOULD_LOAD_CLARITY = process.env.NODE_ENV === "production" && typeof CLARITY_PROJECT_ID === "string" && CLARITY_PROJECT_ID.trim().length > 0;
const SHOULD_LOAD_AMPLITUDE = process.env.NODE_ENV === "production" && typeof AMPLITUDE_API_KEY === "string" && AMPLITUDE_API_KEY.trim().length > 0;

const runWhenIdle = (callback) => {
  if (typeof window === "undefined") return;

  const run = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(callback, { timeout: 5000 });
      return;
    }

    window.setTimeout(callback, 3000);
  };

  if (document.readyState === "complete") {
    run();
    return;
  }

  window.addEventListener("load", run, { once: true });
};

const getMeasurementId = () => {
  if (!SHOULD_TRACK) {
    return null;
  }
  return GA_MEASUREMENT_ID.trim();
};

const getAmplitudeApiKey = () => {
  if (!SHOULD_LOAD_AMPLITUDE) {
    return null;
  }
  return AMPLITUDE_API_KEY.trim();
};

const getAmplitudeServerZone = () => {
  if (typeof AMPLITUDE_SERVER_ZONE !== "string") {
    return "US";
  }

  return AMPLITUDE_SERVER_ZONE.trim().toUpperCase() === "EU" ? "EU" : "US";
};

const ensureGaScript = () => {
  if (typeof window === "undefined") return null;
  if (window.__gaInitialized) {
    return getMeasurementId();
  }

  const measurementId = getMeasurementId();
  if (!measurementId) {
    return null;
  }

  if (typeof window.gtag === "function") {
    window.__gaInitialized = true;
    return measurementId;
  }

  window.__gaInitialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  return measurementId;
};

const hasCookieConsent = () => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
  } catch (_) {
    return false;
  }
};

export const initializeClarity = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  if (!SHOULD_LOAD_CLARITY || !hasCookieConsent()) return false;
  if (window.__clarityInitialized) return true;

  const projectId = CLARITY_PROJECT_ID.trim();
  window.__clarityInitialized = true;

  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () {
      (c[a].q = c[a].q || []).push(arguments);
    };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", projectId);

  return true;
};

const flushAmplitudeQueue = () => {
  if (typeof window === "undefined") return;
  if (!window.__amplitudeInitialized || typeof window.amplitude?.track !== "function") return;

  const queue = Array.isArray(window.__amplitudeEventQueue) ? window.__amplitudeEventQueue : [];
  window.__amplitudeEventQueue = [];

  queue.forEach(({ eventName, params }) => {
    window.amplitude.track(eventName, params);
  });
};

export const initializeAmplitude = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  if (!SHOULD_LOAD_AMPLITUDE || !hasCookieConsent()) return false;
  if (window.__amplitudeInitialized) return true;
  if (window.__amplitudeLoading) return true;

  const apiKey = getAmplitudeApiKey();
  if (!apiKey) return false;

  const serverZone = getAmplitudeServerZone();
  const script = document.createElement("script");
  script.async = true;
  script.src = serverZone === "EU"
    ? `https://cdn.eu.amplitude.com/script/${apiKey}.js`
    : `https://cdn.amplitude.com/script/${apiKey}.js`;

  window.__amplitudeLoading = true;
  script.onload = () => {
    if (typeof window.amplitude?.init !== "function") return;

    const config = {
      fetchRemoteConfig: true,
      autocapture: false,
    };

    if (serverZone === "EU") {
      config.serverZone = "EU";
    }

    window.amplitude.init(apiKey, config);
    window.__amplitudeInitialized = true;
    window.__amplitudeLoading = false;
    flushAmplitudeQueue();
  };

  script.onerror = () => {
    window.__amplitudeLoading = false;
  };

  document.head.appendChild(script);
  return true;
};

const trackClarityEvent = (eventName) => {
  initializeClarity();
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity("event", eventName);
  }
};

const trackAmplitudeEvent = (eventName, params = {}) => {
  if (typeof window === "undefined") return;
  if (!SHOULD_LOAD_AMPLITUDE || !hasCookieConsent()) return;

  initializeAmplitude();

  if (window.__amplitudeInitialized && typeof window.amplitude?.track === "function") {
    window.amplitude.track(eventName, params);
    return;
  }

  window.__amplitudeEventQueue = Array.isArray(window.__amplitudeEventQueue)
    ? window.__amplitudeEventQueue
    : [];
  window.__amplitudeEventQueue.push({ eventName, params });
};

export const trackPageView = (pagePath, pageTitle = "") => {
  if (typeof window === "undefined") return;
  runWhenIdle(() => {
    initializeClarity();
    trackAmplitudeEvent("page_view", {
      page_path: pagePath,
      page_title: pageTitle,
    });

    const measurementId = ensureGaScript();
    if (!measurementId) return;

    window.gtag("config", measurementId, {
      page_path: pagePath,
      page_title: pageTitle,
    });
  });
};

const trackConversionEvent = (eventName, params = {}) => {
  if (typeof window === "undefined") return;
  trackClarityEvent(eventName);
  trackAmplitudeEvent(eventName, params);
  const measurementId = ensureGaScript();
  if (!measurementId) return;

  window.gtag("event", eventName, {
    send_to: measurementId,
    ...params,
  });
};

export const trackContactSubmit = (params = {}) => {
  trackConversionEvent("contact_submit", {
    event_category: "lead",
    ...params,
  });
};

export const trackLeadSubmit = (params = {}) => {
  trackConversionEvent("lead_submit", {
    event_category: "lead",
    ...params,
  });
};

export const isGaTrackingEnabled = SHOULD_TRACK;
export const isClarityTrackingEnabled = SHOULD_LOAD_CLARITY;
export const isAmplitudeTrackingEnabled = SHOULD_LOAD_AMPLITUDE;
