"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRepository = void 0;
const crypto_1 = require("crypto");
const prisma_1 = require("../lib/prisma");
class MessageRepository {
    async findAll(vendorId) {
        return prisma_1.prisma.$queryRaw `
      SELECT id, vendorId, sender, text, type, confirmationAmount, createdAt
      FROM "Message"
      WHERE vendorId = ${vendorId}
      ORDER BY createdAt ASC
    `;
    }
    async create(data) {
        const id = (0, crypto_1.randomUUID)();
        await prisma_1.prisma.$executeRaw `
      INSERT INTO "Message" (id, vendorId, sender, text, type, confirmationAmount, createdAt)
      VALUES (${id}, ${data.vendorId}, ${data.sender}, ${data.text}, ${data.type ?? "text"}, ${data.confirmationAmount ?? null}, CURRENT_TIMESTAMP)
    `;
        const rows = await prisma_1.prisma.$queryRaw `
      SELECT id, vendorId, sender, text, type, confirmationAmount, createdAt
      FROM "Message"
      WHERE id = ${id}
      LIMIT 1
    `;
        const message = rows[0];
        if (!message) {
            throw new Error("Failed to create message");
        }
        return message;
    }
}
exports.messageRepository = new MessageRepository();
