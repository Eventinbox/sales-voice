"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parseMessage_1 = require("../lib/parseMessage");
const requireAuth_1 = require("../middleware/requireAuth");
const MessageRepository_1 = require("../repositories/MessageRepository");
const SaleRepository_1 = require("../repositories/SaleRepository");
const DebtRepository_1 = require("../repositories/DebtRepository");
const router = (0, express_1.Router)();
// GET /api/messages — full chat history, oldest first
router.get("/", requireAuth_1.requireAuth, async (req, res) => {
    const messages = await MessageRepository_1.messageRepository.findAll(req.vendorId);
    res.json(messages);
});
// POST /api/messages — vendor sends a message; we parse it, persist any
// resulting sale/debt, and return both the vendor message and the
// assistant's reply so the frontend can append them in one round trip.
router.post("/", requireAuth_1.requireAuth, async (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) {
        return res.status(400).json({ error: "text is required" });
    }
    // Pull recent context BEFORE inserting the new message, so it isn't
    // counted twice, then put it back in chronological order (oldest first).
    const recent = await MessageRepository_1.messageRepository.findAll(req.vendorId);
    const history = recent
        .slice()
        .reverse()
        .map((m) => ({ sender: m.sender, text: m.text }));
    const vendorMessage = await MessageRepository_1.messageRepository.create({
        vendorId: req.vendorId,
        sender: "vendor",
        text: text.trim(),
        type: "text",
    });
    const intent = await (0, parseMessage_1.parseMessage)(text, history);
    let assistantText = "Got it! I've noted that down for you.";
    let confirmationAmount;
    if (intent.kind === "sale") {
        await SaleRepository_1.saleRepository.create({
            vendorId: req.vendorId,
            item: intent.item,
            amount: intent.amount,
            buyerName: intent.buyerName,
        });
        assistantText = `Logged that! ${intent.item} for ₦${intent.amount.toLocaleString()}.`;
        confirmationAmount = intent.amount.toLocaleString();
    }
    else if (intent.kind === "debt") {
        await DebtRepository_1.debtRepository.create({
            vendorId: req.vendorId,
            personName: intent.personName,
            item: intent.item,
            amount: intent.amount,
            type: intent.type,
            note: intent.note,
        });
        assistantText = `Recorded. ₦${intent.amount.toLocaleString()} added to ${intent.personName}'s debt.`;
        confirmationAmount = intent.amount.toLocaleString();
    }
    const assistantMessage = await MessageRepository_1.messageRepository.create({
        vendorId: req.vendorId,
        sender: "assistant",
        text: assistantText,
        type: confirmationAmount ? "confirmation" : "text",
        confirmationAmount,
    });
    res.status(201).json({ vendorMessage, assistantMessage, intent });
});
exports.default = router;
