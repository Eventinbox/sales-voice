"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleRepository = void 0;
const crypto_1 = require("crypto");
const prisma_1 = require("../lib/prisma");
class SaleRepository {
    async create(data) {
        const id = (0, crypto_1.randomUUID)();
        await prisma_1.prisma.$executeRaw `
      INSERT INTO "Sale" (id, vendorId, item, amount, buyerName, createdAt)
      VALUES (${id}, ${data.vendorId}, ${data.item}, ${data.amount}, ${data.buyerName ?? null}, CURRENT_TIMESTAMP)
    `;
        const rows = await prisma_1.prisma.$queryRaw `
      SELECT id, vendorId, item, amount, buyerName, createdAt
      FROM "Sale"
      WHERE id = ${id}
      LIMIT 1
    `;
        const sale = rows[0];
        if (!sale) {
            throw new Error("Failed to create sale");
        }
        return sale;
    }
    async findSince(vendorId, date) {
        return prisma_1.prisma.$queryRaw `
      SELECT id, vendorId, item, amount, buyerName, createdAt
      FROM "Sale"
      WHERE vendorId = ${vendorId} AND createdAt >= datetime(${date.toISOString()})
      ORDER BY createdAt ASC
    `;
    }
}
exports.saleRepository = new SaleRepository();
