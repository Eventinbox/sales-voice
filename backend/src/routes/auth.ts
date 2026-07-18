import { Router } from "express";
import { vendorRepository } from "../repositories/VendorRepository";
import { hashPassword, comparePassword, signToken } from "../lib/authUtils";
import { requireAuth, AuthedRequest } from "../middleware/requireAuth";

const router = Router();

function sanitizeVendor(vendor: { id: string; phone: string; name: string; shopName: string; avatar: string | null }) {
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
  const { phone, password, name, shopName } = req.body as {
    phone?: string;
    password?: string;
    name?: string;
    shopName?: string;
  };

  if (!phone || phone.trim().length < 7) {
    return res.status(400).json({ error: "A valid phone number is required" });
  }
  if (!password || password.trim().length < 4) {
    return res.status(400).json({ error: "Password must be at least 4 characters" });
  }
  if (!name?.trim() || !shopName?.trim()) {
    return res.status(400).json({ error: "Name and shop name are required" });
  }

  const existing = await vendorRepository.findByPhone(phone.trim());
  if (existing) {
    return res.status(409).json({ error: "An account with this phone number already exists" });
  }

  const passwordHash = await hashPassword(password);
  const vendor = await vendorRepository.create({
    phone: phone.trim(),
    passwordHash,
    name: name.trim(),
    shopName: shopName.trim(),
  });

  const token = signToken({ vendorId: vendor.id });
  res.status(201).json({ token, vendor: sanitizeVendor(vendor) });
});

// POST /api/auth/login — { phone, password }
router.post("/login", async (req, res) => {
  const { phone, password } = req.body as { phone?: string; password?: string };

  if (!phone || !password) {
    return res.status(400).json({ error: "Phone and password are required" });
  }

  const vendor = await vendorRepository.findByPhone(phone.trim());
  if (!vendor) {
    return res.status(401).json({ error: "Invalid phone number or password" });
  }

  const valid = await comparePassword(password, vendor.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid phone number or password" });
  }

  const token = signToken({ vendorId: vendor.id });
  res.json({ token, vendor: sanitizeVendor(vendor) });
});

// GET /api/auth/me — requires Authorization: Bearer <token>
router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const vendor = await vendorRepository.findById(req.vendorId!);
  if (!vendor) {
    return res.status(404).json({ error: "Vendor not found" });
  }
  res.json(sanitizeVendor(vendor));
});

// PATCH /api/auth/me — requires Authorization: Bearer <token>, updates name/shopName/avatar
router.patch("/me", requireAuth, async (req: AuthedRequest, res) => {
  const { name, shopName, avatar } = req.body as {
    name?: string;
    shopName?: string;
    avatar?: string;
  };

  const updated = await vendorRepository.update(req.vendorId!, {
    ...(name?.trim() ? { name: name.trim() } : {}),
    ...(shopName?.trim() ? { shopName: shopName.trim() } : {}),
    ...(avatar ? { avatar } : {}),
  });

  res.json(sanitizeVendor(updated));
});

export default router;
