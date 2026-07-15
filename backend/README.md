# Sales Voice — Backend

Node/Express + SQLite (via Prisma). Frontend-facing REST API for the Sales Voice app.

## Setup

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Server runs at `http://localhost:4000`. Frontend (Next.js) is expected on `http://localhost:3000` — CORS is already configured for that origin in `src/index.ts`.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/messages` | Full chat history |
| POST | `/api/messages` | Send a vendor message (body: `{ text }`) — parses it, creates a sale/debt if detected, returns both the vendor + assistant messages |
| GET | `/api/debts?type=customer\|supplier` | List debts, optionally filtered |
| GET | `/api/debts/:id` | Single debt |
| PATCH | `/api/debts/:id` | Update status (body: `{ status: "PAID" \| "UNPAID" }`) |
| GET | `/api/prices` | All tracked price benchmarks |
| GET | `/api/summary` | Today's total sales |

## Where Gemma plugs in

`src/lib/parseMessage.ts` now calls Gemma (via the Gemini API — see `src/lib/gemma.ts`) to turn a vendor's raw text into structured data (`ParsedIntent`). It asks the model to respond with a single JSON object and validates the shape before using it.

If `GEMMA_API_KEY` is unset, or the Gemma call fails/returns something unparseable, `parseMessage` transparently falls back to the original regex heuristics — so the API still works without a key, just less accurately.

Get a key at https://aistudio.google.com/apikey and set `GEMMA_API_KEY` (and optionally `GEMMA_MODEL`, default `gemma-4-26b-a4b-it`) in `.env`.


- `DebtEntry.type` is `"customer" | "supplier"`, matching the frontend's existing field name exactly — this resolves the type/direction naming question from earlier.
- Data is in SQLite (`prisma/dev.db`), not in-memory, so it survives server restarts.
- `parseMessage.ts` calls Gemma first and falls back to its old regex stub on any failure — see `src/lib/gemma.ts` for the API client.
