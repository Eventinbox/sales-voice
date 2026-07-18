import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";

export type SaleRecord = {
  id: string;
  vendorId: string | null;
  item: string;
  amount: number;
  buyerName: string | null;
  createdAt: Date;
};

class SaleRepository {
  async create(data: { vendorId: string; item: string; amount: number; buyerName?: string }): Promise<SaleRecord> {
    const id = randomUUID();
    await prisma.$executeRaw`
      INSERT INTO "Sale" (id, vendorId, item, amount, buyerName, createdAt)
      VALUES (${id}, ${data.vendorId}, ${data.item}, ${data.amount}, ${data.buyerName ?? null}, CURRENT_TIMESTAMP)
    `;
    const rows = await prisma.$queryRaw<SaleRecord[]>`
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

  async findSince(vendorId: string, date: Date): Promise<SaleRecord[]> {
    return prisma.$queryRaw<SaleRecord[]>`
      SELECT id, vendorId, item, amount, buyerName, createdAt
      FROM "Sale"
      WHERE vendorId = ${vendorId} AND createdAt >= datetime(${date.toISOString()})
      ORDER BY createdAt ASC
    `;
  }
}

export const saleRepository = new SaleRepository();
