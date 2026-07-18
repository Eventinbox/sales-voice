"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VendorRepository_1 = require("../repositories/VendorRepository");
const authUtils_1 = require("../lib/authUtils");
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
function sanitizeVendor(vendor) {
    return {
        id: vendor.id,
        phone: vendor.phone,
        name: vendor.name,
        shopName: vendor.shopName,
        avatar: vendor.avatar,
    };
}
// POST /api/auth/register — { phone, password, name, shopName }
router.post("/register", async (req, res) => {
    const { phone, password, name, shopName } = req.body;
    if (!phone || phone.trim().length < 7) {
        return res.status(400).json({ error: "A valid phone number is required" });
    }
    if (!password || password.trim().length < 4) {
        return res.status(400).json({ error: "Password must be at least 4 characters" });
    }
    if (!name?.trim() || !shopName?.trim()) {
        return res.status(400).json({ error: "Name and shop name are required" });
    }
    const existing = await VendorRepository_1.vendorRepository.findByPhone(phone.trim());
    if (existing) {
        return res.status(409).json({ error: "An account with this phone number already exists" });
    }
    const passwordHash = await (0, authUtils_1.hashPassword)(password);
    const vendor = await VendorRepository_1.vendorRepository.create({
        phone: phone.trim(),
        passwordHash,
        name: name.trim(),
        shopName: shopName.trim(),
    });
    const token = (0, authUtils_1.signToken)({ vendorId: vendor.id });
    res.status(201).json({ token, vendor: sanitizeVendor(vendor) });
});
// POST /api/auth/login — { phone, password }
router.post("/login", async (req, res) => {
    const { phone, password } = req.body;
    if (!phone || !password) {
        return res.status(400).json({ error: "Phone and password are required" });
    }
    const vendor = await VendorRepository_1.vendorRepository.findByPhone(phone.trim());
    if (!vendor) {
        return res.status(401).json({ error: "Invalid phone number or password" });
    }
    const valid = await (0, authUtils_1.comparePassword)(password, vendor.passwordHash);
    if (!valid) {
        return res.status(401).json({ error: "Invalid phone number or password" });
    }
    const token = (0, authUtils_1.signToken)({ vendorId: vendor.id });
    res.json({ token, vendor: sanitizeVendor(vendor) });
});
// GET /api/auth/me — requires Authorization: Bearer <token>
router.get("/me", requireAuth_1.requireAuth, async (req, res) => {
    const vendor = await VendorRepository_1.vendorRepository.findById(req.vendorId);
    if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
    }
    res.json(sanitizeVendor(vendor));
});
// PATCH /api/auth/me — requires Authorization: Bearer <token>, updates name/shopName/avatar
router.patch("/me", requireAuth_1.requireAuth, async (req, res) => {
    const { name, shopName, avatar } = req.body;
    const updated = await VendorRepository_1.vendorRepository.update(req.vendorId, {
        ...(name?.trim() ? { name: name.trim() } : {}),
        ...(shopName?.trim() ? { shopName: shopName.trim() } : {}),
        ...(avatar ? { avatar } : {}),
    });
    res.json(sanitizeVendor(updated));
});
exports.default = router;
