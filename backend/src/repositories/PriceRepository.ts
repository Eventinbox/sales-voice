import { prisma } from "../lib/prisma";

export type PriceBenchmarkRecord = {
  id: string;
  item: string;
  currentPrice: number;
  minMarketPrice: number;
  maxMarketPrice: number;
  trend: string;
};

class PriceRepository {
  async findAll(): Promise<PriceBenchmarkRecord[]> {
    return prisma.priceBenchmark.findMany({ orderBy: { item: "asc" } });
  }

  async upsertFromSale(data: { item: string; amount: number }): Promise<PriceBenchmarkRecord> {
    const item = data.item.trim() || "item";
    const existing = await prisma.$queryRaw<PriceBenchmarkRecord[]>`
      SELECT id, item, currentPrice, minMarketPrice, maxMarketPrice, trend
      FROM "PriceBenchmark"
      WHERE lower(item) = lower(${item})
      LIMIT 1
    `;

    const currentPrice = data.amount;
    const benchmark = existing[0];

    if (!benchmark) {
      return prisma.priceBenchmark.create({
        data: {
          item,
          currentPrice,
          minMarketPrice: currentPrice,
          maxMarketPrice: currentPrice,
          trend: "stable",
        },
      });
    }

    const trend =
      currentPrice > benchmark.currentPrice
        ? "up"
        : currentPrice < benchmark.currentPrice
          ? "down"
          : "stable";

    return prisma.priceBenchmark.update({
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

export const priceRepository = new PriceRepository();
