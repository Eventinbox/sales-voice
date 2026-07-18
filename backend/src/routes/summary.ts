import { Router } from "express";
import { saleRepository } from "../repositories/SaleRepository";

const router = Router();

// GET /api/summary — today's total sales, for the dashboard's Big Number Card
router.get("/", async (_req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const sales = await saleRepository.findSince(startOfToday);
  const todaysSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  res.json({ todaysSales });
});

export default router;