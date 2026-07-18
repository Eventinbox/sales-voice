"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const parseMessage_1 = require("../lib/parseMessage");
const router = (0, express_1.Router)();
// GET /api/messages — full chat history, oldest first
router.get("/", async (_req, res) => {
    const messages = await prisma_1.prisma.message.findMany({ orderBy: { createdAt: "asc" } });
    res.json(messages);
});
// POST /api/messages — vendor sends a message; we parse it, persist any
// resulting sale/debt, and return both the vendor message and the
// assistant's reply so the frontend can append them in one round trip.
router.post("/", async (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) {
        return res.status(400).json({ error: "text is required" });
    }
    // Pull recent context BEFORE inserting the new message, so it isn't
    // counted twice, then put it back in chronological order (oldest first).
    const recent = await prisma_1.prisma.message.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
    });
    const history = recent
        .slice()
        .reverse()
        .map((m) => ({ sender: m.sender, text: m.text }));
    const vendorMessage = await prisma_1.prisma.message.create({
        data: { sender: "vendor", text: text.trim(), type: "text" },
    });
    const intent = await (0, parseMessage_1.parseMessage)(text, history);
    let assistantText = "Got it! I've noted that down for you.";
    let confirmationAmount;
    if (intent.kind === "sale") {
        await prisma_1.prisma.sale.create({
            data: { item: intent.item, amount: intent.amount, buyerName: intent.buyerName },
        });
        assistantText = `Logged that! ${intent.item} for ₦${intent.amount.toLocaleString()}.`;
        confirmationAmount = intent.amount.toLocaleString();
    }
    else if (intent.kind === "debt") {
        await prisma_1.prisma.debtEntry.create({
            data: {
                personName: intent.personName,
                item: intent.item,
                amount: intent.amount,
                type: intent.type,
                note: intent.note,
            },
        });
        assistantText = `Recorded. ₦${intent.amount.toLocaleString()} added to ${intent.personName}'s debt.`;
        confirmationAmount = intent.amount.toLocaleString();
    }
    const assistantMessage = await prisma_1.prisma.message.create({
        data: {
            sender: "assistant",
            text: assistantText,
            type: confirmationAmount ? "confirmation" : "text",
            confirmationAmount,
        },
    });
    res.status(201).json({ vendorMessage, assistantMessage, intent });
});
exports.default = router;
