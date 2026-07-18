import { Router } from "express";
import { debtRepository } from "../repositories/DebtRepository";

const router = Router();

// GET /api/debts?type=customer|supplier — omit type to get everything
router.get("/", async (req, res) => {
  const { type } = req.query as { type?: string };
  const debts = await debtRepository.findAll(type);
  res.json(debts);
});

// GET /api/debts/:id
router.get("/:id", async (req, res) => {
  const debt = await debtRepository.findById(req.params.id);
  if (!debt) return res.status(404).json({ error: "Debt not found" });
  res.json(debt);
});

// PATCH /api/debts/:id — used by "Paid in Full" / "Add Payment" on the debt detail page
router.patch("/:id", async (req, res) => {
  const { status } = req.body as { status?: "PAID" | "UNPAID" };
  if (!status || !["PAID", "UNPAID"].includes(status)) {
    return res.status(400).json({ error: "status must be PAID or UNPAID" });
  }

  try {
    const debt = await debtRepository.updateStatus(req.params.id, status);
    res.json(debt);
  } catch {
    res.status(404).json({ error: "Debt not found" });
  }
});

export default router;