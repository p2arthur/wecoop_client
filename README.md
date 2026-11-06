# WeCoop

**A wallet-connected social app for the Algorand community.**

WeCoop brings a social feed, wallet profiles, replies, reactions, and community polls into one React application. It combines a conventional API for indexed social data with Algorand transactions and application clients for on-chain interactions.

Arthur Rabelo was the primary builder, with the project later developed alongside collaborators. This repository contains the web client; the [smart contracts](https://github.com/p2arthur/wecoop_smart_contracts) are maintained separately.

## Explore the product

- Browse posts, follow wallet activity, reply, and react in the social feed.
- Connect supported wallets and inspect account-linked profile information.
- Participate in poll and posting flows backed by Algorand applications.
- Work with file-post content and transaction-backed metadata.

The code separates social API queries from wallet transactions. [`src/services/api/`](src/services/api/) handles backend reads, while [`src/services/`](src/services/) and [`src/contracts/`](src/contracts/) contain the social and contract integration logic. TanStack Query manages server-state caching; React context holds application state.

## Run the client

Use **Node.js 18 or later** and npm. The historical dependency versions are recorded in `package-lock.json`.

```sh
git clone https://github.com/p2arthur/wecoop_client.git
cd wecoop_client
npm ci
cp .env.template .env
```

Before starting, edit `.env` for the environment you intend to use. The template contains overlapping network blocks and ends with MainNet values; consolidate it into a single consistent network configuration.

| Setting | Purpose |
| --- | --- |
| `VITE_ALGOD_*` | Algorand node endpoint, token, port, and network |
| `VITE_INDEXER_*` | Indexer endpoint, token, and port |
| `VITE_WECOOP_API` | WeCoop backend base URL, absent from the starter template |
| `VITE_WECOOP_MAIN_ADDRESS` | Application recipient address |
| `VITE_WECOOP_FILEPOST_APP_ID` | File-post application ID |
| `VITE_WECOOP_POLL_APP_ID` | Poll application ID |
| `VITE_WECOOP_BASE_PRICE` | Posting price configuration |

Some flows also use `VITE_COUNTRY_API`. Match contract IDs, assets, node endpoints, and wallet network before submitting transactions. The wallet initialization in [`src/App.tsx`](src/App.tsx) also contains a network setting; changing environment variables alone does not reconcile it.

```sh
npm run dev
```

Open the URL printed by Vite. A configured backend and matching deployed contracts are required for the complete application; this client repository does not start those services. Variables prefixed with `VITE_` are exposed to the browser and must not contain server credentials.

## Code map

| Path | What to look at |
| --- | --- |
| [`src/routes/index.tsx`](src/routes/index.tsx) | Home, feed, profile, posting, and poll routes |
| [`src/pages/`](src/pages/) | Product screens |
| [`src/components/`](src/components/) | Social and wallet interface components |
| [`src/services/api/`](src/services/api/) | Typed backend access and query hooks |
| [`src/contracts/`](src/contracts/) | Generated contract clients and integration notes |
| [`src/context/`](src/context/) | Feed, asset, analytics, and interface state |

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run build` | Type-check and build with Vite |
| `npm run lint` | Check TypeScript and React source |
| `npm test` | Run the configured Jest command with coverage |
| `npm run preview` | Serve a completed build locally |

## Project status

This is the historical WeCoop client, built with React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, and the Algorand SDK. The repository preserves a substantial product implementation; availability of its original hosted API and deployments is not guaranteed. Review the service configuration before connecting a funded wallet.
