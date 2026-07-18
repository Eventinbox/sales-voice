import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";

export type DebtRecord = {
  id: string;
  vendorId: string | null;
  personName: string;
  item: string;
  amount: number;
  type: string;
  status: string;
  note: string | null;
  createdAt: Date;
};

class DebtRepository {
  async findAll(vendorId: string, type?: string): Promise<DebtRecord[]> {
    if (type) {
      return prisma.$queryRaw<DebtRecord[]>`
        SELECT id, vendorId, personName, item, amount, type, status, note, createdAt
        FROM "DebtEntry"
        WHERE vendorId = ${vendorId} AND type = ${type}
        ORDER BY createdAt DESC
      `;
    }

    return prisma.$queryRaw<DebtRecord[]>`
      SELECT id, vendorId, personName, item, amount, type, status, note, createdAt
      FROM "DebtEntry"
      WHERE vendorId = ${vendorId}
      ORDER BY createdAt DESC
    `;
  }

  async findById(id: string, vendorId: string): Promise<DebtRecord | null> {
    const rows = await prisma.$queryRaw<DebtRecord[]>`
      SELECT id, vendorId, personName, item, amount, type, status, note, createdAt
      FROM "DebtEntry"
      WHERE id = ${id} AND vendorId = ${vendorId}
      LIMIT 1
    `;
    return rows[0] ?? null;
  }

  async create(data: {
    vendorId: string;
    personName: string;
    item: string;
    amount: number;
    type: string;
    note?: string;
  }): Promise<DebtRecord> {
    const id = randomUUID();
    await prisma.$executeRaw`
      INSERT INTO "DebtEntry" (id, vendorId, personName, item, amount, type, status, note, createdAt)
      VALUES (${id}, ${data.vendorId}, ${data.personName}, ${data.item}, ${data.amount}, ${data.type}, 'UNPAID', ${data.note ?? null}, CURRENT_TIMESTAMP)
    `;
    const debt = await this.findById(id, data.vendorId);
    if (!debt) {
      throw new Error("Failed to create debt");
    }
    return debt;
  }

  async updateStatus(id: string, vendorId: string, status: string): Promise<DebtRecord> {
    const debt = await this.findById(id, vendorId);
    if (!debt) {
      throw new Error("Debt not found");
    }

    await prisma.$executeRaw`
      UPDATE "DebtEntry"
      SET status = ${status}
      WHERE id = ${id} AND vendorId = ${vendorId}
    `;
    return { ...debt, status };
  }
}

export const debtRepository = new DebtRepository();
