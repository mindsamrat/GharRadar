This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Live MahaRERA lookup

Any MahaRERA registration number that isn't in the bundled curated set is
resolved **live** from the public MahaRERA registry instead of 404-ing.

- **API:** `GET /api/rera/:rera` → JSON `{ rera, provenance, live?, note, ... }`.
  `provenance` is one of `live` (freshly fetched), `cache`, `seed` (curated
  dataset), or `none` (not found / upstream blocked).
- **UI:** searching a registration number offers a "Look up on MahaRERA" action;
  the project page (`/project/:rera`) shows a live view for unknown numbers.
- **Honesty:** fields the registry doesn't publish are shown as
  "Not disclosed on MahaRERA" — no values are fabricated.

### Making it work in production

The MahaRERA portal blocks datacenter/bot traffic (HTTP 403 + captcha), so a
direct fetch from a serverless host will often be blocked. Route requests
through a scraping proxy by setting `MAHARERA_PROXY_URL` (ScraperAPI /
ScrapingBee / BrightData / Zyte — anything that takes a target URL and returns
the page). See [`.env.example`](./.env.example) for all options.

When the upstream is blocked and no proxy is configured, the lookup degrades
gracefully: the API returns `provenance: "none"` with a note explaining how to
enable the proxy, and the page shows a "couldn't load" state rather than fake
data.

> **Note:** the HTML parser (`src/lib/maharera/parse.ts`) is unit-tested against
> representative markup (`npm run test:parser`) but the exact live field labels
> should be confirmed once against the real portal from an unblocked network /
> proxy, since MahaRERA's markup varies by registration vintage.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
