"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SaleRepository_1 = require("../repositories/SaleRepository");
const router = (0, express_1.Router)();
// GET /api/summary — today's total sales, for the dashboard's Big Number Card
router.get("/", async (_req, res) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const sales = await SaleRepository_1.saleRepository.findSince(startOfToday);
    const todaysSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
    res.json({ todaysSales });
});
exports.default = router;
