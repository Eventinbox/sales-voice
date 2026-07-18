"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceRepository = void 0;
const prisma_1 = require("../lib/prisma");
class PriceRepository {
    async findAll() {
        return prisma_1.prisma.priceBenchmark.findMany({ orderBy: { item: "asc" } });
    }
    async upsertFromSale(data) {
        const item = data.item.trim() || "item";
        const existing = await prisma_1.prisma.$queryRaw `
      SELECT id, item, currentPrice, minMarketPrice, maxMarketPrice, trend
      FROM "PriceBenchmark"
      WHERE lower(item) = lower(${item})
      LIMIT 1
    `;
        const currentPrice = data.amount;
        const benchmark = existing[0];
        if (!benchmark) {
            return prisma_1.prisma.priceBenchmark.create({
                data: {
                    item,
                    currentPrice,
                    minMarketPrice: currentPrice,
                    maxMarketPrice: currentPrice,
                    trend: "stable",
                },
            });
        }
        const trend = currentPrice > benchmark.currentPrice
            ? "up"
            : currentPrice < benchmark.currentPrice
                ? "down"
                : "stable";
        return prisma_1.prisma.priceBenchmark.update({
            where: { id: benchmark.id },
            data: {
                item: benchmark.item.trim() || item,
                currentPrice,
                minMarketPrice: Math.min(benchmark.minMarketPrice, currentPrice),
                maxMarketPrice: Math.max(benchmark.maxMarketPrice, currentPrice),
                trend,
            },
        });
    }
}
exports.priceRepository = new PriceRepository();
