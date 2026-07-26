import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';
import { hasMarketingConsent } from '@/utils/cookieConsent';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    ttq?: {
      load: (id: string) => void;
      page: () => void;
      track: (event: string, data?: Record<string, unknown>) => void;
    };
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type PixelConfig = {
  metaPixelId?: string | null;
  tiktokPixelId?: string | null;
  googleAdsId?: string | null;
  googleAnalyticsId?: string | null;
};

const injectedKeys = new Set<string>();

function injectScript(id: string, src: string, inline?: string): void {
  if (injectedKeys.has(id)) return;
  injectedKeys.add(id);
  const el = document.createElement('script');
  el.id = id;
  if (inline) {
    el.text = inline;
  } else {
    el.async = true;
    el.src = src;
  }
  document.head.appendChild(el);
}

function initMeta(pixelId: string) {
  if (window.fbq) {
    window.fbq('init', pixelId);
    return;
  }
  const n = (window.fbq = function (...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (n as any).callMethod ? (n as any).callMethod(...args) : (n as any).queue.push(args);
  }) as typeof window.fbq & { queue: unknown[]; loaded?: boolean; version?: string };
  if (!n.queue) n.queue = [];
  n.loaded = true;
  n.version = '2.0';
  injectScript(
    'troco-meta-pixel',
    'https://connect.facebook.net/en_US/fbevents.js',
  );
  window.fbq?.('init', pixelId);
}

function initTikTok(pixelId: string) {
  if (window.ttq) {
    window.ttq.load(pixelId);
    return;
  }
  const ttq = (window.ttq = {
    load: () => {},
    page: () => {},
    track: () => {},
  }) as NonNullable<Window['ttq']> & { _i?: Record<string, unknown>; _t?: Record<string, number> };
  ttq._i = ttq._i || {};
  ttq._t = ttq._t || {};
  injectScript('troco-tiktok-pixel', 'https://analytics.tiktok.com/i18n/pixel/events.js');
  window.ttq?.load(pixelId);
}

function initGoogle(gaId?: string | null, adsId?: string | null) {
  const primary = gaId?.trim() || adsId?.trim();
  if (!primary) return;
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    injectScript('troco-gtag', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primary)}`);
    window.gtag('js', new Date());
  }
  if (gaId?.trim()) window.gtag?.('config', gaId.trim());
  if (adsId?.trim() && adsId.trim() !== gaId?.trim()) {
    window.gtag?.('config', adsId.trim());
  }
}

function trackPageView(config: PixelConfig) {
  if (config.metaPixelId?.trim()) window.fbq?.('track', 'PageView');
  if (config.tiktokPixelId?.trim()) window.ttq?.page();
  if (config.googleAnalyticsId?.trim() || config.googleAdsId?.trim()) {
    window.gtag?.('event', 'page_view', {
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
    });
  }
}

export type PurchaseTrackPayload = {
  value: number;
  currency?: string;
  transactionId?: string;
};

export function trackPurchase(payload: PurchaseTrackPayload) {
  const { value, currency = 'MAD', transactionId } = payload;
  window.fbq?.('track', 'Purchase', { value, currency });
  window.ttq?.track('CompletePayment', { value, currency });
  window.gtag?.('event', 'purchase', {
    value,
    currency,
    transaction_id: transactionId,
  });
}

const TrackingPixels = () => {
  const { pathname } = useLocation();
  const { store } = useTenant();
  const configRef = useRef<PixelConfig>({});
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/super-admin');
  const [marketingOk, setMarketingOk] = useState(() =>
    hasMarketingConsent(store?.slug, store?.cookieConsentRequired),
  );

  useEffect(() => {
    const sync = () =>
      setMarketingOk(hasMarketingConsent(store?.slug, store?.cookieConsentRequired));
    sync();
    window.addEventListener('matjarona:consent-updated', sync);
    return () => window.removeEventListener('matjarona:consent-updated', sync);
  }, [store?.slug, store?.cookieConsentRequired]);

  const config: PixelConfig = {
    metaPixelId: store?.metaPixelId,
    tiktokPixelId: store?.tiktokPixelId,
    googleAdsId: store?.googleAdsId,
    googleAnalyticsId: store?.googleAnalyticsId,
  };

  const hasAny =
    marketingOk &&
    (!!config.metaPixelId?.trim() ||
      !!config.tiktokPixelId?.trim() ||
      !!config.googleAdsId?.trim() ||
      !!config.googleAnalyticsId?.trim());

  useEffect(() => {
    if (isAdmin || !hasAny) return;
    configRef.current = config;
    if (config.metaPixelId?.trim()) initMeta(config.metaPixelId.trim());
    if (config.tiktokPixelId?.trim()) initTikTok(config.tiktokPixelId.trim());
    initGoogle(config.googleAnalyticsId, config.googleAdsId);
  }, [
    isAdmin,
    hasAny,
    config.metaPixelId,
    config.tiktokPixelId,
    config.googleAdsId,
    config.googleAnalyticsId,
  ]);

  useEffect(() => {
    if (isAdmin || !hasAny) return;
    trackPageView(configRef.current);
  }, [pathname, isAdmin, hasAny]);

  return null;
};

export default TrackingPixels;
