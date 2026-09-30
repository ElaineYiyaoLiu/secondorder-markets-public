# SecondOrder Markets

Markets, translated. 把行情讲明白。

Live site: https://secondorder-markets-public.vercel.app

The `v0.1` branch is the current private release. The matching `secondorder-markets-public` repository contains only `main`, which is connected to the SecondOrder Vercel team for automatic production deployments.

An independent bilingual market-reading workspace, inspired by the typography, blue/copper palette and numbered panels in ElaineYiyaoLiu/SecondOrder main at 4aae64b263682edfdc0f94b20d6dc71d54143bb6. The original project was read only and was not modified.

## v0.1

- Search by ticker, English company name or Chinese name; 100 US-listed stocks plus SPY and QQQ ETFs.
- TradingView-style three-column workspace: searchable watchlist, primary candlestick chart, persistent plain-language reader. Compact 18–21px headings and no hero section.
- Daily OHLC candles and volume, 1/3/6-month and 1/2-year session windows, zoom controls, historical navigation and reset.
- Hover, tap or arrow keys to explain a candle. Enable range selection and drag, or hold Shift with arrow keys to select a range. Escape clears selection.
- Price, relative volume and preceding 20-session price-range context.
- Compare adjacent five-session windows for closing price, mean volume and mean intraday range.
- Chinese/English controls, interpretation and methodology; local language preference.
- Add/remove watchlist entries, persisted locally in this browser. No registration or login; public site access.
- Optional read-only WebMCP candle explanation tool, feature-detected in compatible browsers.

## Data

Without a key, the application deliberately uses deterministic **synthetic** fixtures ending June 30, 2025 for every symbol, with approximately two years of synthetic completed-session bars. Prices and volumes are invented. The UI uses one compact data status below the chart. 

The production provider is Twelve Data via its documented `/time_series` HTTP API. Set `TWELVE_DATA_API_KEY` as a server environment secret with a plan permitting the intended usage and display. Do not paste it into chat or place it in client code. The adapter is `lib/provider.ts`; `MarketProvider` allows replacement. The API key never reaches the browser. It requests up to 550 daily OHLCV bars, validates price relationships and dates, sorts ascending, and excludes today's New York session so only completed bars are interpreted. In-memory caching lasts 15 minutes per Worker isolate; it is not a durable/global quota manager. Provider errors, insufficient history or missing credentials fall back to explicitly labeled synthetic data. Public no-key endpoints were tested but were rate-limited or browser-challenge gated, so they are not used.

Reference: https://support.twelvedata.com/en/articles/5214728-getting-historical-data

The latest available completed session is shown with its date. No real-time quotes, news attribution, sector causality, targets or buy/sell signals are provided. The translations use explicit deterministic rules, not an LLM. Volume counts shares, not participants. A daily OHLC bar does not reveal the sequence of its high and low.

## Run and deploy

Requires Node 22.13+ and pnpm 11.25.0. This standalone React/Vinext project uses the Next.js App Router structure and Cloudflare Worker output.

```bash
pnpm install
cp .env.example .env
pnpm dev:vercel
```

The Next.js development server defaults to http://localhost:3000.

```bash
pnpm exec tsc --noEmit
node scripts/check-market.mjs
pnpm build:vercel
```

Sites publication builds `dist/server/index.js` with `fetch(request, env, ctx)` and static client assets. `.openai/hosting.json` identifies this independent project. Set the optional market secret in hosted environment settings. The deployed site is public and has no login gate. There is no database or trading functionality. Watchlists are device-local, not shared across browsers.

## Validation boundaries

TypeScript, 102 distinct instrument datasets (100 equities + 2 ETFs), OHLCV invariants, mocked provider success/failure, route responses and the Worker production build are checked. A production Twelve Data account/key was not supplied, so live paid/account-backed data cannot be verified. Browser visual/interaction QA and browser WebMCP execution are unavailable in this environment because the required control-browser skill is not installed; no claim of completed browser QA is made.

## Vercel

`vercel.json` uses the standard Next.js App Router build, alongside the existing Sites build.

```bash
npm run build:vercel
npm run start:vercel
# In the SecondOrder Vercel team, create/link an independent project:
npx vercel@61.1.0 login
npx vercel@61.1.0 link --yes --project secondorder-markets-public --scope second-order4
npx vercel@61.1.0 --prod --scope second-order4
```

The optional `TWELVE_DATA_API_KEY` is a server-side Vercel environment variable. The interface itself requires no account. Deployment to the authenticated user’s Vercel team requires CLI login when the connector’s deploy tool is unavailable.
