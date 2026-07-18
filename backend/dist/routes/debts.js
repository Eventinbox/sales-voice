"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DebtRepository_1 = require("../repositories/DebtRepository");
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
// GET /api/debts?type=customer|supplier — omit type to get everything
router.get("/", requireAuth_1.requireAuth, async (req, res) => {
    const { type } = req.query;
    const debts = await DebtRepository_1.debtRepository.findAll(req.vendorId, type);
    res.json(debts);
});
// GET /api/debts/:id
router.get("/:id", requireAuth_1.requireAuth, async (req, res) => {
    const debt = await DebtRepository_1.debtRepository.findById(req.params.id, req.vendorId);
    if (!debt)
        return res.status(404).json({ error: "Debt not found" });
    res.json(debt);
});
// PATCH /api/debts/:id — used by "Paid in Full" / "Add Payment" on the debt detail page
router.patch("/:id", requireAuth_1.requireAuth, async (req, res) => {
    const { status } = req.body;
    if (!status || !["PAID", "UNPAID"].includes(status)) {
        return res.status(400).json({ error: "status must be PAID or UNPAID" });
    }
    try {
        const debt = await DebtRepository_1.debtRepository.updateStatus(req.params.id, req.vendorId, status);
        res.json(debt);
    }
    catch {
        res.status(404).json({ error: "Debt not found" });
    }
});
exports.default = router;
