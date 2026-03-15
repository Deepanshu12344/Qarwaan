import { useEffect } from 'react';

type SeoPayload = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
};

function upsertMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  if (typeof document === 'undefined') return;
  const selector = `meta[${attr}="${name}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', href);
}

function upsertJsonLd(data?: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  const id = 'qarwaan-json-ld';
  const existing = document.getElementById(id);
  if (!data) {
    if (existing) existing.remove();
    return;
  }

  const script = existing || document.createElement('script');
  script.setAttribute('id', id);
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(script);
}

export function useSeo(payload: SeoPayload) {
  useEffect(() => {
    const {
      title,
      description,
      path = '/',
      image = '/carousel1.png',
      type = 'website',
      noindex = false,
      jsonLd,
    } = payload;

    const siteName = 'Qarwaan Travel';
    const absoluteTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    const canonicalPath = path.startsWith('/') ? path : `/${path}`;
    const canonicalUrl = `${origin}${canonicalPath}`;
    const imageUrl = image.startsWith('http') ? image : `${origin}${image}`;

    document.title = absoluteTitle;
    upsertMeta('description', description);
    upsertMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertMeta('og:title', absoluteTitle, 'property');
    upsertMeta('og:description', description, 'property');
    upsertMeta('og:type', type, 'property');
    upsertMeta('og:url', canonicalUrl, 'property');
    upsertMeta('og:image', imageUrl, 'property');
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', absoluteTitle);
    upsertMeta('twitter:description', description);
    upsertMeta('twitter:image', imageUrl);
    upsertCanonical(canonicalUrl);
    upsertJsonLd(jsonLd);
  }, [payload]);
}
