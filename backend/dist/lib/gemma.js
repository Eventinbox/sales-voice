"use strict";
/**
 * Minimal client for calling Gemma models through the Gemini API
 * (https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api).
 *
 * Uses `fetch` directly (available globally on Node 18+) instead of pulling
 * in an SDK, since all we need is a single generateContent call.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGemmaConfigured = isGemmaConfigured;
exports.callGemma = callGemma;
const GEMMA_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemma-4-26b-a4b-it";
function isGemmaConfigured() {
    return Boolean(process.env.GEMMA_API_KEY);
}
/**
 * Sends a single-turn prompt to Gemma and returns the raw text of the reply.
 * Throws if GEMMA_API_KEY is missing, the request fails, or the response
 * shape is unexpected — callers are expected to catch and fall back.
 */
async function callGemma(prompt) {
    const apiKey = process.env.GEMMA_API_KEY;
    if (!apiKey) {
        throw new Error("GEMMA_API_KEY is not set");
    }
    const model = process.env.GEMMA_MODEL ?? DEFAULT_MODEL;
    const response = await fetch(`${GEMMA_API_BASE}/${model}:generateContent`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0,
            },
        }),
    });
    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(`Gemma API error (${response.status}): ${errorBody}`);
    }
    const data = (await response.json());
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string") {
        throw new Error("Gemma API returned an unexpected response shape");
    }
    return text;
}
