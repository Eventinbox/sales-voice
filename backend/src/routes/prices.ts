import { Router } from "express";
import { priceRepository } from "../repositories/PriceRepository";

const router = Router();

// GET /api/prices
router.get("/", async (_req, res) => {
  const prices = await priceRepository.findAll();
  res.json(prices);
});

export default router;