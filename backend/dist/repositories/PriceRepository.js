"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceRepository = void 0;
const prisma_1 = require("../lib/prisma");
class PriceRepository {
    async findAll() {
        return prisma_1.prisma.priceBenchmark.findMany({ orderBy: { item: "asc" } });
    }
}
exports.priceRepository = new PriceRepository();
