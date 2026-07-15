"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MessageRepository_1 = require("../repositories/MessageRepository");
const SaleRepository_1 = require("../repositories/SaleRepository");
const DebtRepository_1 = require("../repositories/DebtRepository");
const parseMessage_1 = require("../lib/parseMessage");
const router = (0, express_1.Router)();
router.get("/", async (_req, res) => {
    const messages = await MessageRepository_1.messageRepository.findAll();
    res.json(messages);
});
router.post("/", async (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) {
        return res.status(400).json({ error: "text is required" });
    }
    const vendorMessage = await MessageRepository_1.messageRepository.create({
        sender: "vendor",
        text: text.trim(),
        type: "text",
    });
    const intent = await (0, parseMessage_1.parseMessage)(text);
    let assistantText = "Got it! I've noted that down for you.";
    let confirmationAmount;
    if (intent.kind === "sale") {
        await SaleRepository_1.saleRepository.create({ item: intent.item, amount: intent.amount, buyerName: intent.buyerName });
        assistantText = `Logged that! ${intent.item} for ₦${intent.amount.toLocaleString()}.`;
        confirmationAmount = intent.amount.toLocaleString();
    }
    else if (intent.kind === "debt") {
        await DebtRepository_1.debtRepository.create({
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
        sender: "assistant",
        text: assistantText,
        type: confirmationAmount ? "confirmation" : "text",
        confirmationAmount,
    });
    res.status(201).json({ vendorMessage, assistantMessage, intent });
});
exports.default = router;
