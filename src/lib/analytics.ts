const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

function getStored(key: string, fallbackPrefix: string) {
  if (typeof window === 'undefined') return '';
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const next = `${fallbackPrefix}_${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(key, next);
  return next;
}

export function getSessionId() {
  return getStored('qarwaan_session_id', 'sess');
}

export function getAnonymousId() {
  return getStored('qarwaan_anonymous_id', 'anon');
}

export function initAnalytics() {
  if (typeof window === 'undefined') return;

  const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  if (measurementId && !window.gtag) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: false });
  }
}

export function initHeatmapHooks() {
  if (typeof window === 'undefined') return;
  const heatmapEnabled = import.meta.env.VITE_HEATMAP_ENABLED === 'true';
  if (!heatmapEnabled) return;

  if (window.hj) {
    window.hj('event', 'heatmap_bootstrap');
  }

  if (window.clarity) {
    window.clarity('set', 'app', 'qarwaan');
  }
}

export async function trackEvent(eventName: string, properties: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;

  const payload = {
    eventName,
    sessionId: getSessionId(),
    anonymousId: getAnonymousId(),
    pagePath: window.location.pathname,
    source: 'web',
    properties,
    occurredAt: new Date().toISOString(),
  };

  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }

  if (window.hj) {
    window.hj('event', eventName);
  }

  fetch(`${API_BASE_URL}/analytics/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // best effort; analytics must not break UX
  });
}

export function trackPageView(path: string) {
  const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  if (window.gtag && measurementId) {
    window.gtag('config', measurementId, {
      page_path: path,
    });
  }
  void trackEvent('page_view', { path });
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    hj?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}
