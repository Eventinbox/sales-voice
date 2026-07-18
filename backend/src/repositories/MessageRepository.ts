import { prisma } from "../lib/prisma";
import { Message } from "@prisma/client";

class MessageRepository {
  async findAll(): Promise<Message[]> {
    return prisma.message.findMany({ orderBy: { createdAt: "asc" } });
  }

  async create(data: {
    sender: string;
    text: string;
    type?: string;
    confirmationAmount?: string;
  }): Promise<Message> {
    return prisma.message.create({ data });
  }
}


export const messageRepository = new MessageRepository();