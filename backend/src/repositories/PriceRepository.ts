import { prisma } from "../lib/prisma";
import { PriceBenchmark } from "@prisma/client";

class PriceRepository {
  async findAll(): Promise<PriceBenchmark[]> {
    return prisma.priceBenchmark.findMany({ orderBy: { item: "asc" } });
  }
}

export const priceRepository = new PriceRepository();