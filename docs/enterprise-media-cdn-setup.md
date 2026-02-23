# Enterprise Media, CDN, and Cache Setup

## Scope
- Local uploads and URL-based assets are supported through `/api/media/admin` and `/api/media/admin/upload`.
- Uploaded files are served from `/uploads/media/*`.
- Admin can set `cdnUrl` and `cacheControl` per asset.

## 1) Environment Variables
Set these in `.env`:

```env
MEDIA_UPLOAD_DIR=uploads
MEDIA_UPLOAD_MAX_BYTES=15728640
MEDIA_PUBLIC_BASE_URL=https://api.example.com
MEDIA_CDN_BASE_URL=https://cdn.example.com
MEDIA_CACHE_CONTROL_PUBLIC=public, max-age=300
MEDIA_CACHE_CONTROL_IMMUTABLE=public, max-age=31536000, immutable
```

## 2) One-Time Media Setup
Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-media-cdn.ps1
```

This creates:
- `uploads/media`
- `deploy/nginx/media-cache.conf` (Nginx snippet)

## 3) Cache Strategy
- Mutable JSON/API responses: `public, max-age=300`.
- Versioned media filenames (upload pipeline): `public, max-age=31536000, immutable`.
- CDN should honor origin `Cache-Control`; avoid manual CDN TTL overrides unless needed.
- On replacement workflows, prefer new filenames instead of overwriting old files.

## 4) CDN Rollout
1. Point CDN origin to app host that serves `/uploads`.
2. Apply Nginx snippet from `deploy/nginx/media-cache.conf`.
3. Set `MEDIA_CDN_BASE_URL` and optional per-asset `cdnUrl`.
4. Validate with response headers:
   - `cache-control`
   - `etag` (if enabled by your proxy/origin)
   - `age` (from CDN)

## 5) Stripe + Razorpay Webhook Notes
- Stripe webhook endpoint: `/api/payments/webhook/stripe`
- Razorpay webhook endpoint: `/api/payments/webhook/razorpay`
- Keep secrets in env (`STRIPE_WEBHOOK_SECRET`, `RAZORPAY_WEBHOOK_SECRET`).
- Reconciliation status is persisted in payment metadata (`metadata.reconciliation`).

## 6) Analytics Notes
- Frontend tracking uses:
  - GA4 (`VITE_GA4_MEASUREMENT_ID`)
  - Internal ingest API (`/api/analytics/events`)
  - Optional heatmap hooks (`VITE_HEATMAP_ENABLED=true` with `window.hj`/`window.clarity` loaded externally)

## 7) Live FX & Referral Rewards
- Live FX endpoint: `GET /api/fx/rates?base=INR` (cached by `FX_CACHE_TTL_MS`).
- Site currency display now uses live rates with fallback.
- Referral rewards:
  - Registration accepts optional `referralCode`.
  - On valid referral, referrer receives one-time reward coupon.
  - Reward ledger is stored and visible in user/account and admin marketing views.
