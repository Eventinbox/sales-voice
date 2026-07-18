import { Message, DebtEntry, PriceBenchmark } from "./types";
import { formatTime, formatDateTime } from "./utils";
import { getToken } from "./token";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// --- Raw shapes returned by the backend ---

interface ApiMessage {
  id: string;
  sender: "assistant" | "vendor";
  text: string;
  type: "text" | "confirmation";
  confirmationAmount?: string | null;
  createdAt: string;
}

interface ApiDebtEntry {
  id: string;
  personName: string;
  item: string;
  amount: number;
  type: "customer" | "supplier";
  status: "PAID" | "UNPAID";
  note?: string | null;
  createdAt: string;
}

interface ApiPriceBenchmark {
  id: string;
  item: string;
  currentPrice: number;
  minMarketPrice: number;
  maxMarketPrice: number;
  trend: "up" | "down" | "stable";
}

// --- Mappers: raw API JSON -> frontend types ---

function toMessage(raw: ApiMessage): Message {
  return {
    id: raw.id,
    sender: raw.sender,
    text: raw.text,
    type: raw.type,
    confirmationAmount: raw.confirmationAmount ?? undefined,
    timestamp: formatTime(new Date(raw.createdAt)),
  };
}

function toDebtEntry(raw: ApiDebtEntry): DebtEntry {
  return {
    id: raw.id,
    personName: raw.personName,
    item: raw.item,
    amount: raw.amount,
    type: raw.type,
    status: raw.status,
    note: raw.note ?? undefined,
    date: formatDateTime(new Date(raw.createdAt)),
  };
}

function toPriceBenchmark(raw: ApiPriceBenchmark): PriceBenchmark {
  return {
    item: raw.item,
    currentPrice: raw.currentPrice,
    minMarketPrice: raw.minMarketPrice,
    maxMarketPrice: raw.maxMarketPrice,
    trend: raw.trend,
  };
}

// --- Auth-aware fetch wrapper ---

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Not authenticated — please log in again.");
    }
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// --- Public API ---
// Messages, debts, and summary are all per-vendor and require a token.
// Prices are shared market data and stay public.

export async function fetchMessages(): Promise<Message[]> {
  const res = await fetch(`${API_URL}/api/messages`, { headers: authHeaders() });
  const raw = await handle<ApiMessage[]>(res);
  return raw.map(toMessage);
}

export async function sendMessage(
  text: string
): Promise<{ vendorMessage: Message; assistantMessage: Message; updatedPriceBenchmark?: PriceBenchmark }> {
  const res = await fetch(`${API_URL}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ text }),
  });
  const raw = await handle<{
    vendorMessage: ApiMessage;
    assistantMessage: ApiMessage;
    updatedPriceBenchmark?: ApiPriceBenchmark;
  }>(res);
  return {
    vendorMessage: toMessage(raw.vendorMessage),
    assistantMessage: toMessage(raw.assistantMessage),
    updatedPriceBenchmark: raw.updatedPriceBenchmark ? toPriceBenchmark(raw.updatedPriceBenchmark) : undefined,
  };
}

export async function fetchDebts(type?: "customer" | "supplier"): Promise<DebtEntry[]> {
  const url = type ? `${API_URL}/api/debts?type=${type}` : `${API_URL}/api/debts`;
  const res = await fetch(url, { headers: authHeaders() });
  const raw = await handle<ApiDebtEntry[]>(res);
  return raw.map(toDebtEntry);
}

export async function fetchDebt(id: string): Promise<DebtEntry> {
  const res = await fetch(`${API_URL}/api/debts/${id}`, { headers: authHeaders() });
  const raw = await handle<ApiDebtEntry>(res);
  return toDebtEntry(raw);
}

export async function updateDebtStatus(
  id: string,
  status: "PAID" | "UNPAID"
): Promise<DebtEntry> {
  const res = await fetch(`${API_URL}/api/debts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  const raw = await handle<ApiDebtEntry>(res);
  return toDebtEntry(raw);
}

export async function fetchPrices(): Promise<PriceBenchmark[]> {
  // Public — no auth header. Market prices are shared, not per-vendor.
  const res = await fetch(`${API_URL}/api/prices`);
  const raw = await handle<ApiPriceBenchmark[]>(res);
  return raw.map(toPriceBenchmark);
}

export async function fetchSummary(): Promise<{ todaysSales: number }> {
  const res = await fetch(`${API_URL}/api/summary`, { headers: authHeaders() });
  return handle<{ todaysSales: number }>(res);
}
