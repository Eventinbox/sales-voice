"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleRepository = void 0;
const prisma_1 = require("../lib/prisma");
class SaleRepository {
    async create(data) {
        return prisma_1.prisma.sale.create({ data });
    }
    async findSince(date) {
        return prisma_1.prisma.sale.findMany({ where: { createdAt: { gte: date } } });
    }
}
exports.saleRepository = new SaleRepository();
