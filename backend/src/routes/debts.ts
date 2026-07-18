import { Router } from "express";
import { debtRepository } from "../repositories/DebtRepository";
import { requireAuth, AuthedRequest } from "../middleware/requireAuth";

const router = Router();

// GET /api/debts?type=customer|supplier — omit type to get everything
router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const { type } = req.query as { type?: string };
  const debts = await debtRepository.findAll(req.vendorId!, type);
  res.json(debts);
});

// GET /api/debts/:id
router.get("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const debt = await debtRepository.findById(req.params.id, req.vendorId!);
  if (!debt) return res.status(404).json({ error: "Debt not found" });
  res.json(debt);
});

// PATCH /api/debts/:id — used by "Paid in Full" / "Add Payment" on the debt detail page
router.patch("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const { status } = req.body as { status?: "PAID" | "UNPAID" };
  if (!status || !["PAID", "UNPAID"].includes(status)) {
    return res.status(400).json({ error: "status must be PAID or UNPAID" });
  }

  try {
    const debt = await debtRepository.updateStatus(req.params.id, req.vendorId!, status);
    res.json(debt);
  } catch {
    res.status(404).json({ error: "Debt not found" });
  }
});

export default router;
