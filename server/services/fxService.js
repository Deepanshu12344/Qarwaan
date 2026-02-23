const DEFAULT_TTL_MS = Number(process.env.FX_CACHE_TTL_MS || 6 * 60 * 60 * 1000);

const cache = new Map();

function normalizeBase(base) {
  return String(base || 'INR').trim().toUpperCase();
}

export async function getFxRates(base = 'INR') {
  const normalizedBase = normalizeBase(base);
  const now = Date.now();
  const existing = cache.get(normalizedBase);
  if (existing && now < existing.expiresAt) {
    return { ...existing.data, source: 'cache' };
  }

  const response = await fetch(`https://open.er-api.com/v6/latest/${normalizedBase}`);
  if (!response.ok) {
    throw new Error(`FX provider returned ${response.status}`);
  }
  const data = await response.json();
  if (!data || data.result !== 'success' || !data.rates) {
    throw new Error('Invalid FX provider payload');
  }

  const payload = {
    base: data.base_code || normalizedBase,
    rates: data.rates,
    fetchedAt: new Date().toISOString(),
  };

  cache.set(normalizedBase, {
    data: payload,
    expiresAt: now + DEFAULT_TTL_MS,
  });

  return { ...payload, source: 'provider' };
}
