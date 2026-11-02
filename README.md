# SmartCompare

Compare a product's price across **Amazon, Flipkart, Croma, Reliance Digital, Blinkit, Zepto, Swiggy Instamart and BigBasket**, apply the bank offers on **the cards you actually own**, and get a clear **"Best place to buy"** winner, with an AI advisor that explains why.

Inspired by [QuickCompare](https://quickcompare.in/) and [BuyHatke](https://buyhatke.com/).

## Features

- **One search, every store**: phones, electronics and 10-minute grocery apps side by side.
- **My Cards**: add your credit and debit cards (bank, type, network and optional co-branded card such as Amazon Pay ICICI or Flipkart Axis). Only metadata is stored, never card numbers.
- **Effective price engine**: applies instant discounts, cashback, minimum order values and caps per platform, then picks the best card for each store.
- **Best Buy winner**: weighted ranking on final price, delivery speed, store trust and return policy. Groceries weight delivery speed higher.
- **AI advisor**: plain-English recommendation plus follow-up questions through any OpenAI-compatible API, with a rule-based fallback when no key is set.
- **Price history and alerts**: 90-day chart per store, plus price-drop alerts for signed-in users.
- **Accounts**: email/password, with optional Google sign-in (Auth.js).

## Architecture

```
src/lib/platforms/   PlatformAdapter interface, registry, mock adapters, catalog
src/lib/offers/      Bank-offer catalog + effective-price engine
src/lib/ranking/     Best-buy scoring with human-readable reasons
src/lib/ai/          Rule-based + LLM advisor
src/lib/compare.ts   Parallel adapter fan-out with timeouts, snapshots, alert triggers
src/app/api/         compare, advisor, cards, alerts, history, search, register, auth
```

Prices currently come from **deterministic mock adapters**. To go live, implement `PlatformAdapter` for a source (an affiliate API such as Amazon PA-API or Flipkart Affiliate, an Apify actor, or your own scraper) and register it in `src/lib/platforms/registry.ts`. No UI changes are needed.

## Getting started

```bash
nvm use            # Node 22
npm install
cp .env.example .env && npx auth secret   # sets AUTH_SECRET
npm run db:push
npm run dev
```

Open http://localhost:3000.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm test` | Unit tests for offer and ranking engines |
| `npm run lint` | ESLint |
| `npm run build` | Production build |

## Roadmap

- Live adapters (affiliate APIs first), with a Redis cache and background refresh queue
- Email / WhatsApp notifications for triggered price alerts
- Postgres for production (`provider = "postgresql"` in `prisma/schema.prisma`)
- Browser extension that shows the best price on product pages
- Mobile app sharing the same API
