"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debtRepository = void 0;
const crypto_1 = require("crypto");
const prisma_1 = require("../lib/prisma");
class DebtRepository {
    async findAll(vendorId, type) {
        if (type) {
            return prisma_1.prisma.$queryRaw `
        SELECT id, vendorId, personName, item, amount, type, status, note, createdAt
        FROM "DebtEntry"
        WHERE vendorId = ${vendorId} AND type = ${type}
        ORDER BY createdAt DESC
      `;
        }
        return prisma_1.prisma.$queryRaw `
      SELECT id, vendorId, personName, item, amount, type, status, note, createdAt
      FROM "DebtEntry"
      WHERE vendorId = ${vendorId}
      ORDER BY createdAt DESC
    `;
    }
    async findById(id, vendorId) {
        const rows = await prisma_1.prisma.$queryRaw `
      SELECT id, vendorId, personName, item, amount, type, status, note, createdAt
      FROM "DebtEntry"
      WHERE id = ${id} AND vendorId = ${vendorId}
      LIMIT 1
    `;
        return rows[0] ?? null;
    }
    async create(data) {
        const id = (0, crypto_1.randomUUID)();
        await prisma_1.prisma.$executeRaw `
      INSERT INTO "DebtEntry" (id, vendorId, personName, item, amount, type, status, note, createdAt)
      VALUES (${id}, ${data.vendorId}, ${data.personName}, ${data.item}, ${data.amount}, ${data.type}, 'UNPAID', ${data.note ?? null}, CURRENT_TIMESTAMP)
    `;
        const debt = await this.findById(id, data.vendorId);
        if (!debt) {
            throw new Error("Failed to create debt");
        }
        return debt;
    }
    async updateStatus(id, vendorId, status) {
        const debt = await this.findById(id, vendorId);
        if (!debt) {
            throw new Error("Debt not found");
        }
        await prisma_1.prisma.$executeRaw `
      UPDATE "DebtEntry"
      SET status = ${status}
      WHERE id = ${id} AND vendorId = ${vendorId}
    `;
        return { ...debt, status };
    }
}
exports.debtRepository = new DebtRepository();
