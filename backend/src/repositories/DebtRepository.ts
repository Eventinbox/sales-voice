import { prisma } from "../lib/prisma";
import { DebtEntry } from "@prisma/client";

class DebtRepository {
  async findAll(type?: string): Promise<DebtEntry[]> {
    return prisma.debtEntry.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<DebtEntry | null> {
    return prisma.debtEntry.findUnique({ where: { id } });
  }

  async create(data: {
    personName: string;
    item: string;
    amount: number;
    type: string;
    note?: string;
  }): Promise<DebtEntry> {
    return prisma.debtEntry.create({ data });
  }

  async updateStatus(id: string, status: string): Promise<DebtEntry> {
    return prisma.debtEntry.update({ where: { id }, data: { status } });
  }
}

export const debtRepository = new DebtRepository();