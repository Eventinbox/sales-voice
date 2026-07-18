# Sales Voice

**Voice-first bookkeeping for Nigeria's market vendors — powered by Gemma 4.**

Sales Voice turns a natural-language message like *"sold 2 bags of rice to Tunde for 15k"* into a structured sales record, a debt entry, or a price update — no forms, no typing through menus, just conversation. Built in a one-day sprint for the **Build with Gemma — GDG LAUTECH** hackathon.

---

## Why

Small market vendors run real businesses entirely from memory and paper. Existing bookkeeping software assumes typing, forms, and screen literacy — friction that doesn't fit a vendor mid-transaction with a customer standing in front of them. Sales Voice makes the interface *conversation itself*.

## What it does

- **Chat** — log sales and debts the way you'd naturally say them
- **Dashboard** — today's total sales, outstanding customer/supplier debts, live price check
- **Prices** — every tracked item's price plotted against the market's low/high range
- **Debt Detail** — per-debt records with status, notes, and payment actions
- **Real multi-vendor accounts** — every sale, debt, and message is scoped to a real, authenticated vendor; verified with live two-account isolation testing

## How Gemma 4 is used

Every vendor message is parsed by Gemma 4 through a dedicated module (`backend/src/lib/parseMessage.ts`):

1. A structured prompt instructs Gemma to return **only** a JSON object matching one of three shapes: a completed sale, a debt (with explicit `customer`/`supplier` direction), or `unknown` if there isn't enough information.
2. The vendor's **last 10 messages** are included as context, so follow-ups and corrections ("actually make that 3 bags") resolve correctly instead of every message being parsed in isolation.
3. If the Gemma call fails — network issue, rate limit, missing key — a **regex-based fallback parser** kicks in instead of the request crashing. The app degrades gracefully rather than hard-failing.

This is prompt engineering against a live API, not RAG and not fine-tuning.

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Node/Express, TypeScript, Prisma ORM, SQLite |
| Auth | JWT + bcrypt, per-vendor data scoping |
| AI | Gemma 4 (API), with a heuristic fallback parser |

## Project structure

```
sales voice/                  ← frontend (this is the repo root)
  app/                         Next.js App Router pages
  components/                  Shared UI components
  lib/                         API client, auth/profile providers, types
  backend/                     ← backend lives here, as a subfolder
    src/
      routes/                  Express route handlers (auth, messages, debts, prices, summary)
      repositories/            Singleton data-access classes — routes never touch Prisma directly
      middleware/               requireAuth — JWT verification
      lib/                      parseMessage (Gemma + fallback), authUtils, prisma client
    prisma/
      schema.prisma             Vendor, Message, Sale, DebtEntry, PriceBenchmark models
```

## Running it locally

You need both the backend and frontend running at the same time, in two separate terminals.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then add your own GEMMA_API_KEY and JWT_SECRET
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Runs on `http://localhost:4000`.

### 2. Frontend

```bash
npm install
# .env.local should contain:
# NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev
```

Runs on `http://localhost:3000`.

### 3. Try it

Visit `http://localhost:3000/login`, create a shop account, and start logging sales in the chat.

## API overview

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create a vendor account |
| POST | `/api/auth/login` | — | Log in, returns a JWT |
| GET / PATCH | `/api/auth/me` | ✅ | Fetch or update the logged-in vendor's profile |
| GET / POST | `/api/messages` | ✅ | Chat history / send a new message (triggers Gemma parsing) |
| GET / PATCH | `/api/debts` `/api/debts/:id` | ✅ | List, view, and update debts (scoped to the vendor) |
| GET | `/api/summary` | ✅ | Today's total sales |
| GET | `/api/prices` | — | Market price benchmarks (shared, not per-vendor) |

All `✅` routes require `Authorization: Bearer <token>`.

## Design system

The UI follows a documented design system ("Market Clerk") — high-contrast, solid shapes, and large touch targets, tuned for bright outdoor market lighting and one-handed phone use. Colors and typography are token-based in `tailwind.config.ts`.

## Team

Built by the Sales Voice team for **Build with Gemma — GDG LAUTECH**.

## License

MIT
