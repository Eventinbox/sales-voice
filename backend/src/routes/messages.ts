import { Router } from "express";
import { parseMessage } from "../lib/parseMessage";
import { requireAuth, AuthedRequest } from "../middleware/requireAuth";
import { messageRepository } from "../repositories/MessageRepository";
import { saleRepository } from "../repositories/SaleRepository";
import { priceRepository } from "../repositories/PriceRepository";
import { debtRepository } from "../repositories/DebtRepository";

const router = Router();

// GET /api/messages — full chat history, oldest first
router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const messages = await messageRepository.findAll(req.vendorId!);
  res.json(messages);
});

// POST /api/messages — vendor sends a message; we parse it, persist any
// resulting sale/debt, and return both the vendor message and the
// assistant's reply so the frontend can append them in one round trip.
router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const { text } = req.body as { text?: string };

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }

  // Pull recent context BEFORE inserting the new message, so it isn't
  // counted twice, then put it back in chronological order (oldest first).
  const recent = await messageRepository.findAll(req.vendorId!);
  const history = recent
    .slice()
    .reverse()
    .map((m) => ({ sender: m.sender as "assistant" | "vendor", text: m.text }));

  const vendorMessage = await messageRepository.create({
    vendorId: req.vendorId!,
    sender: "vendor",
    text: text.trim(),
    type: "text",
  });

  const intent = await parseMessage(text, history);
  let assistantText = "Got it! I've noted that down for you.";
  let confirmationAmount: string | undefined;

  if (intent.kind === "sale") {
    await saleRepository.create({
      vendorId: req.vendorId!,
      item: intent.item,
      amount: intent.amount,
      buyerName: intent.buyerName,
    });
    const updatedPriceBenchmark = await priceRepository.upsertFromSale({
      item: intent.item,
      amount: intent.amount,
    });
    assistantText = `Logged that! ${intent.item} for ₦${intent.amount.toLocaleString()}.`;
    confirmationAmount = intent.amount.toLocaleString();
    const assistantMessage = await messageRepository.create({
      vendorId: req.vendorId!,
      sender: "assistant",
      text: assistantText,
      type: confirmationAmount ? "confirmation" : "text",
      confirmationAmount,
    });

    return res.status(201).json({ vendorMessage, assistantMessage, intent, updatedPriceBenchmark });
  } else if (intent.kind === "debt") {
    await debtRepository.create({
      vendorId: req.vendorId!,
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
    vendorId: req.vendorId!,
    sender: "assistant",
    text: assistantText,
    type: confirmationAmount ? "confirmation" : "text",
    confirmationAmount,
  });

  res.status(201).json({ vendorMessage, assistantMessage, intent });
});

export default router;
