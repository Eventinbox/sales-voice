"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debtRepository = void 0;
const prisma_1 = require("../lib/prisma");
class DebtRepository {
    async findAll(type) {
        return prisma_1.prisma.debtEntry.findMany({
            where: type ? { type } : undefined,
            orderBy: { createdAt: "desc" },
        });
    }
    async findById(id) {
        return prisma_1.prisma.debtEntry.findUnique({ where: { id } });
    }
    async create(data) {
        return prisma_1.prisma.debtEntry.create({ data });
    }
    async updateStatus(id, status) {
        return prisma_1.prisma.debtEntry.update({ where: { id }, data: { status } });
    }
}
exports.debtRepository = new DebtRepository();
