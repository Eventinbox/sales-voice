"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorRepository = void 0;
const crypto_1 = require("crypto");
const prisma_1 = require("../lib/prisma");
class VendorRepository {
    async findByPhone(phone) {
        const rows = await prisma_1.prisma.$queryRaw `
      SELECT id, phone, passwordHash, name, shopName, avatar
      FROM "Vendor"
      WHERE phone = ${phone}
      LIMIT 1
    `;
        return rows[0] ?? null;
    }
    async findById(id) {
        const rows = await prisma_1.prisma.$queryRaw `
      SELECT id, phone, passwordHash, name, shopName, avatar
      FROM "Vendor"
      WHERE id = ${id}
      LIMIT 1
    `;
        return rows[0] ?? null;
    }
    async create(data) {
        const id = (0, crypto_1.randomUUID)();
        await prisma_1.prisma.$executeRaw `
      INSERT INTO "Vendor" (id, phone, passwordHash, name, shopName, avatar, createdAt, updatedAt)
      VALUES (${id}, ${data.phone}, ${data.passwordHash}, ${data.name}, ${data.shopName}, ${data.avatar ?? null}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
        const vendor = await this.findById(id);
        if (!vendor) {
            throw new Error("Failed to create vendor");
        }
        return vendor;
    }
    async update(id, data) {
        const existing = await this.findById(id);
        if (!existing) {
            throw new Error("Vendor not found");
        }
        await prisma_1.prisma.$executeRaw `
      UPDATE "Vendor"
      SET
        name = ${data.name ?? existing.name},
        shopName = ${data.shopName ?? existing.shopName},
        avatar = ${data.avatar ?? existing.avatar},
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
        const updated = await this.findById(id);
        if (!updated) {
            throw new Error("Failed to update vendor");
        }
        return updated;
    }
}
exports.vendorRepository = new VendorRepository();
