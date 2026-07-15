import { Router } from "express";
import { messageRepository } from "../repositories/MessageRepository";
import { saleRepository } from "../repositories/SaleRepository";
import { debtRepository } from "../repositories/DebtRepository";
import { parseMessage } from "../lib/parseMessage";

const router = Router();


router.get("/", async (_req, res) => {
  const messages = await messageRepository.findAll();
  res.json(messages);
});


router.post("/", async (req, res) => {
  const { text } = req.body as { text?: string };

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }

  const vendorMessage = await messageRepository.create({
    sender: "vendor",
    text: text.trim(),
    type: "text",
  });

  const intent = await parseMessage(text);
  let assistantText = "Got it! I've noted that down for you.";
  let confirmationAmount: string | undefined;

  if (intent.kind === "sale") {
    await saleRepository.create({ item: intent.item, amount: intent.amount, buyerName: intent.buyerName });
    assistantText = `Logged that! ${intent.item} for ₦${intent.amount.toLocaleString()}.`;
    confirmationAmount = intent.amount.toLocaleString();
  } else if (intent.kind === "debt") {
    await debtRepository.create({
      personName: intent.personName,
      item: intent.item,
      amount: intent.amount,
      type: intent.type,
      note: intent.note,
    });
    assistantText = `Recorded. ₦${intent.amount.toLocaleString()} added to ${intent.personName}'s debt.`;
    confirmationAmount = intent.amount.toLocaleString();
  }

  const assistantMessage = await messageRepository.create({
    sender: "assistant",
    text: assistantText,
    type: confirmationAmount ? "confirmation" : "text",
    confirmationAmount,
  });

  res.status(201).json({ vendorMessage, assistantMessage, intent });
});

export default router;