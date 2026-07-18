"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRepository = void 0;
const prisma_1 = require("../lib/prisma");
class MessageRepository {
    async findAll() {
        return prisma_1.prisma.message.findMany({ orderBy: { createdAt: "asc" } });
    }
    async create(data) {
        return prisma_1.prisma.message.create({ data });
    }
}
exports.messageRepository = new MessageRepository();
