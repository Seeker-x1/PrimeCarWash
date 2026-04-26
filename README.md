# PRIME CAR WASH (Next.js)

Bugatti-inspired premium mobile valeting website with:
- Locale routing (`/ja` and `/en`)
- Mobile-first layout
- Reservation form API (`/api/inquiry`)
- Basic SEO setup (`metadata`, `robots.txt`, `sitemap.xml`, JSON-LD)
- GA4 integration via environment variable

## Project Path

This app is in:
`C:\Users\Takum\.claude\PRIMECARWASH\primecarwash-site`

Note: Next.js requires lowercase package naming, so the app is created in a lowercase subdirectory.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).  
Root `/` redirects to `/ja`.

## Environment Variables

1. Create `.env.local` from `.env.example`
2. Set your GA4 measurement ID:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Vercel Deployment (Beginner Friendly)

1. Create a GitHub repository and push this project.
2. Go to [https://vercel.com](https://vercel.com) and log in with GitHub.
3. Click **Add New... > Project**.
4. Import your GitHub repository.
5. Confirm build settings (Vercel auto-detects Next.js).
6. In **Environment Variables**, add:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` = your GA4 ID
7. Click **Deploy**.
8. After deployment, open the production URL and verify `/ja` and `/en`.

## What to Replace Next

- Replace `lineUrlPlaceholder` in `lib/site-content.ts` with your LINE official account URL.
- Replace hero placeholder background with final image/video assets.
- Add contact details (phone/email/service areas) when finalized.
- Connect reservation API to email or CRM for real operation.
