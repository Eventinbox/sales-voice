import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";

export type MessageRecord = {
  id: string;
  vendorId: string | null;
  sender: string;
  text: string;
  type: string;
  confirmationAmount: string | null;
  createdAt: Date;
};

class MessageRepository {
  async findAll(vendorId: string): Promise<MessageRecord[]> {
    return prisma.$queryRaw<MessageRecord[]>`
      SELECT id, vendorId, sender, text, type, confirmationAmount, createdAt
      FROM "Message"
      WHERE vendorId = ${vendorId}
      ORDER BY createdAt ASC
    `;
  }

  async create(data: {
    vendorId: string;
    sender: string;
    text: string;
    type?: string;
    confirmationAmount?: string;
  }): Promise<MessageRecord> {
    const id = randomUUID();
    await prisma.$executeRaw`
      INSERT INTO "Message" (id, vendorId, sender, text, type, confirmationAmount, createdAt)
      VALUES (${id}, ${data.vendorId}, ${data.sender}, ${data.text}, ${data.type ?? "text"}, ${data.confirmationAmount ?? null}, CURRENT_TIMESTAMP)
    `;
    const rows = await prisma.$queryRaw<MessageRecord[]>`
      SELECT id, vendorId, sender, text, type, confirmationAmount, createdAt
      FROM "Message"
      WHERE id = ${id}
      LIMIT 1
    `;
    const message = rows[0];
    if (!message) {
      throw new Error("Failed to create message");
    }
    return message;
  }
}


export const messageRepository = new MessageRepository();
