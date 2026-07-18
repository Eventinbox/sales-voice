"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PriceRepository_1 = require("../repositories/PriceRepository");
const router = (0, express_1.Router)();
// GET /api/prices
router.get("/", async (_req, res) => {
    const prices = await PriceRepository_1.priceRepository.findAll();
    res.json(prices);
});
exports.default = router;
