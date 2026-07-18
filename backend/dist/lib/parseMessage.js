"use strict";
/**
 * Turns a raw vendor message like "sold 2 bags of rice for 15k" or
 * "Bisi took 5 mudu of garri on credit" into structured data.
 *
 * Primary path: send `text` to Gemma (via the Gemini API — see src/lib/gemma.ts)
 * and ask it to return structured JSON directly. This handles messy,
 * conversational, and Pidgin-inflected phrasing far better than regex.
 *
 * Fallback path: if GEMMA_API_KEY isn't set, or the Gemma call fails/returns
 * something we can't parse, we fall back to the original regex heuristics so
 * the API keeps working offline / without a key.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMessage = parseMessage;
const gemma_1 = require("./gemma");
const GEMMA_SYSTEM_PROMPT = `You are an assistant that extracts structured sales/debt data from a market vendor's short message (often a transcribed voice note, sometimes in Nigerian Pidgin or mixed English).

You will be given the recent conversation for context, followed by the vendor's newest message. Use the history only to resolve corrections or follow-ups — e.g. if the vendor just said "sold 2 bags of rice for 15k" and now says "actually make that 3 bags", apply the correction using the item/price already established in the history. Do not re-emit an intent for something already logged earlier unless the newest message is clearly changing it.

Respond with ONLY a single JSON object — no markdown, no code fences, no explanation — matching exactly one of these shapes:

1. A completed sale: {"kind":"sale","item":string,"amount":number,"buyerName"?:string}
2. Goods given/received on credit (a debt): {"kind":"debt","personName":string,"item":string,"amount":number,"type":"customer"|"supplier","note"?:string}
3. Anything else / not enough info: {"kind":"unknown"}

Rules:
- "amount" must be a plain number of Naira (convert "15k" to 15000, "₦4,000" to 4000, etc).
- Use "type":"customer" when the vendor sold something on credit and a customer now owes them.
- Use "type":"supplier" when the vendor received goods on credit and now owes a supplier.
- "buyerName"/"personName" should be a proper name if mentioned, otherwise omit the field (for buyerName) or use "Unknown" (for personName, since it's required).
- If there's no clear item and amount — even after checking history — return {"kind":"unknown"}.`;
function extractJsonObject(raw) {
    const trimmed = raw.trim();
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end === -1 || end < start) {
        throw new Error("No JSON object found in Gemma response");
    }
    return JSON.parse(trimmed.slice(start, end + 1));
}
function isValidIntent(value) {
    if (!value || typeof value !== "object")
        return false;
    const v = value;
    if (v.kind === "unknown")
        return true;
    if (v.kind === "sale") {
        return (typeof v.item === "string" &&
            typeof v.amount === "number" &&
            (v.buyerName === undefined || typeof v.buyerName === "string"));
    }
    if (v.kind === "debt") {
        return (typeof v.personName === "string" &&
            typeof v.item === "string" &&
            typeof v.amount === "number" &&
            (v.type === "customer" || v.type === "supplier") &&
            (v.note === undefined || typeof v.note === "string"));
    }
    return false;
}
function formatHistory(history) {
    if (history.length === 0)
        return "(no earlier messages)";
    return history
        .map((m) => `${m.sender === "vendor" ? "Vendor" : "Assistant"}: ${m.text}`)
        .join("\n");
}
async function parseMessageWithGemma(text, history) {
    const prompt = `${GEMMA_SYSTEM_PROMPT}

Recent conversation:
${formatHistory(history)}

Vendor's newest message:
"""${text}"""`;
    const raw = await (0, gemma_1.callGemma)(prompt);
    const parsed = extractJsonObject(raw);
    if (!isValidIntent(parsed)) {
        throw new Error("Gemma returned an unexpected intent shape");
    }
    return parsed;
}
function parseAmountMatch(digits, kSuffix) {
    let value = parseInt(digits.replace(/,/g, ""), 10);
    if (isNaN(value))
        return null;
    if (kSuffix?.toLowerCase() === "k") {
        value *= 1000;
    }
    return value;
}
function extractAmount(text) {
    // A message often has more than one number ("sold 3 bags ... for 12000") —
    // the first number in the sentence is usually a quantity, not the price.
    // So we prefer numbers explicitly tied to the price before falling back
    // to "biggest number wins", since prices are almost always larger than
    // item quantities.
    // 1. Number right after "for" — the most common price phrasing.
    const forMatch = text.match(/for\s+₦?\s?([\d,]+)\s?(k)?/i);
    if (forMatch) {
        const value = parseAmountMatch(forMatch[1], forMatch[2]);
        if (value !== null)
            return value;
    }
    // 2. Number explicitly marked with the Naira symbol.
    const nairaMatch = text.match(/₦\s?([\d,]+)\s?(k)?/i);
    if (nairaMatch) {
        const value = parseAmountMatch(nairaMatch[1], nairaMatch[2]);
        if (value !== null)
            return value;
    }
    // 3. Fallback: the largest number mentioned anywhere in the message.
    const allMatches = [...text.matchAll(/([\d,]+)\s?(k)?\b/gi)];
    let best = null;
    for (const m of allMatches) {
        const value = parseAmountMatch(m[1], m[2]);
        if (value !== null && (best === null || value > best)) {
            best = value;
        }
    }
    return best;
}
function extractItem(text) {
    // Very rough heuristic — grabs whatever's between a quantity word and "for"/"to"/"on credit"
    const match = text.match(/(?:of|sold)\s+([a-zA-Z\s]+?)(?:\s+to|\s+for|\s+on credit|$)/i);
    return match ? match[1].trim() : "item";
}
function extractPersonName(text) {
    const match = text.match(/(?:to|from)\s+([A-Z][a-zA-Z]*(?:\s[A-Z][a-zA-Z]*)?)/);
    return match ? match[1].trim() : null;
}
function parseMessageHeuristic(text) {
    const lower = text.toLowerCase();
    const amount = extractAmount(text);
    const isDebt = /credit|owe|debt/.test(lower);
    const isSale = /sold|sale/.test(lower);
    if (isDebt && amount) {
        const personName = extractPersonName(text) ?? "Unknown";
        return {
            kind: "debt",
            personName,
            item: extractItem(text),
            amount,
            type: "customer", // supplier debts need explicit phrasing ("I owe X")
            note: undefined,
        };
    }
    if (isSale && amount) {
        return {
            kind: "sale",
            item: extractItem(text),
            amount,
            buyerName: extractPersonName(text) ?? undefined,
        };
    }
    return { kind: "unknown" };
}
async function parseMessage(text, history = []) {
    if ((0, gemma_1.isGemmaConfigured)()) {
        try {
            return await parseMessageWithGemma(text, history);
        }
        catch (err) {
            console.error("Gemma parsing failed, falling back to heuristics:", err);
        }
    }
    // The regex fallback stays single-message-only — reliably using
    // conversation context needs actual language understanding, which the
    // heuristic path doesn't have. It's a safety net, not the primary path.
    return parseMessageHeuristic(text);
}
