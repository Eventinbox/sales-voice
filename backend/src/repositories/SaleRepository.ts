import { prisma } from "../lib/prisma";
import { Sale } from "@prisma/client";

class SaleRepository {
  async create(data: { item: string; amount: number; buyerName?: string }): Promise<Sale> {
    return prisma.sale.create({ data });
  }

  async findSince(date: Date): Promise<Sale[]> {
    return prisma.sale.findMany({ where: { createdAt: { gte: date } } });
  }
}

export const saleRepository = new SaleRepository();