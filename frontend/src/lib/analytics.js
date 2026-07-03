const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;
const SHOULD_TRACK = process.env.NODE_ENV === "production" && typeof GA_MEASUREMENT_ID === "string" && GA_MEASUREMENT_ID.trim().length > 0;

const getMeasurementId = () => {
  if (!SHOULD_TRACK) {
    return null;
  }
  return GA_MEASUREMENT_ID.trim();
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

export const trackPageView = (pagePath, pageTitle = "") => {
  if (typeof window === "undefined") return;
  const measurementId = ensureGaScript();
  if (!measurementId) return;

  window.gtag("config", measurementId, {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

const trackConversionEvent = (eventName, params = {}) => {
  if (typeof window === "undefined") return;
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

