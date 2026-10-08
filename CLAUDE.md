# Rollbac — Claude Code project guide

Read automatically at the start of every session in this repo.

## What this is
**Rollbac** (www.rollbac.com) — personalised photobooks, journals, planners,
notebooks, calendars, photo frames, prints, mugs and keepsakes, with a
Chennai/Madras cultural theme (designs like Marina Mornings, Malli Poo, Thali &
Thoranam; kolam and filter-kaapi motifs). It is a clean restart of the earlier
"Madarasi Studio" site with the same product, renamed. Tagline: **"Your precious
memories, bound in paper."**

The owner is **not a developer**. Explain in plain language, give complete
commands, and confirm before anything destructive or anything that deploys.

## Hard rules (learned the hard way)
1. **Local only, never iCloud.** The project lives in
   `~/Desktop/Rollbac.com.nosync`. The Desktop is iCloud-synced; the `.nosync`
   suffix is what keeps this folder off iCloud. Never rename it, never move the
   project or `node_modules` elsewhere under Desktop/Documents.
2. **Stay inside free limits — never get the site paused.** The old site was
   paused on Vercel's free plan (18 GB origin transfer vs 10 GB) because shop
   pages were rendered per request and bots crawled endless filter URLs.
   - Public pages are **pre-built at deploy** (static). Filters, sort and paging
     run in the browser (`ProductListing` is a client component).
   - `robots.ts` blocks `/*?`, `/api/`, `/admin`, `/account`, `/auth/`,
     `/cart`, `/checkout`, `/search`. Keep it.
   - Don't add per-request server rendering to public pages.
3. **Minimal deploys.** Cloudflare deploys **only from the `release` branch**.
   Work happens on `main` (pushing `main` deploys nothing). Only move code to
   `release` when the owner explicitly says to release.
4. **GitHub account:** `madarasistudioo-stack` only. Do NOT involve the
   `cxentric-guy` account. This repo's remote embeds the username so the Mac
   keychain keeps its token separate; commits use the account's no-reply email.
5. A green build doesn't prove the change shipped — verify a distinctive
   string is in the file before committing.

## Stack
- Next.js 15.5 (App Router), React 19, TypeScript, Tailwind (theme tokens as
  CSS variables; ivory default + dark theme toggle)
- Hosting: **Cloudflare Workers free plan** via OpenNext
  (`@opennextjs/cloudflare`); `wrangler.jsonc`, `open-next.config.ts`
  (static-assets incremental cache, no ISR). Build: `npm run cf-build`
  (runs `prisma db push` then the OpenNext build). Deploy:
  `npx opennextjs-cloudflare deploy`.
- Free-plan limits: Worker ≤ 3 MB gzipped (~1.9 MB now), ~10 ms CPU/request,
  KV 1 GB and 1,000 writes/day.
- Database: Neon Postgres, Prisma 6 + `@prisma/adapter-neon`, Rust-free client
  (`engineType = "client"`).
- Auth: NextAuth v4 — Google, email magic link (Resend API), phone OTP
  (credentials; needs Twilio/MSG91 — not set up), Apple (not set up).
- Email: Resend HTTP API (`src/lib/mailer.ts`; key in `EMAIL_SERVER_PASSWORD`
  or `RESEND_API_KEY`). Workers can't do SMTP.
- Photos: Cloudflare KV bound as `PHOTOS` (resized to 2400px in the browser),
  served from `/api/photo/...`.
- Payments: UPI direct (QR + UTR, admin marks paid); Razorpay switches on
  if keys are added.
- Admin: `/admin` for `ADMIN_EMAILS` (default madarasistudioo@gmail.com) —
  inventory overrides (go live via **Publish to website** = Cloudflare deploy
  hook in `DEPLOY_HOOK_URL`), orders, customers (360 view, notes, tags,
  block/delete), inbox, leads, segments (CSV), analytics, site status.
- Assistant "Ask Rollbac!" is fully rule-based — no paid AI API calls.

## Key files
`src/lib/products.ts` (categories, designs → products), `src/lib/taxonomy.ts`,
`src/lib/listing.ts`, `src/components/ProductArt.tsx` (illustrated mockups — no
stock photos), `TemplateSpread.tsx`, `BookEditor.tsx` (page-by-page editor with
3D page turn), `ProductGallery.tsx`, `Hero.tsx` + `HeroRing.tsx`,
`Reveal.tsx`/`Tilt.tsx` (3D motion), `src/app/admin/*`, `src/lib/catalog.ts`
(DB overrides), `src/lib/pricing.ts` (server-side price check).

## Open items
- Phone OTP provider (Twilio vs MSG91 + India DLT), Apple sign-in.
- AI design features — must show costs and get approval first.
