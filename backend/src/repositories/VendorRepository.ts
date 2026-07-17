import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";

type VendorRecord = {
  id: string;
  phone: string;
  passwordHash: string;
  name: string;
  shopName: string;
  avatar: string | null;
};

class VendorRepository {
  async findByPhone(phone: string): Promise<VendorRecord | null> {
    const rows = await prisma.$queryRaw<VendorRecord[]>`
      SELECT id, phone, passwordHash, name, shopName, avatar
      FROM "Vendor"
      WHERE phone = ${phone}
      LIMIT 1
    `;
    return rows[0] ?? null;
  }

  async findById(id: string): Promise<VendorRecord | null> {
    const rows = await prisma.$queryRaw<VendorRecord[]>`
      SELECT id, phone, passwordHash, name, shopName, avatar
      FROM "Vendor"
      WHERE id = ${id}
      LIMIT 1
    `;
    return rows[0] ?? null;
  }

  async create(data: {
    phone: string;
    passwordHash: string;
    name: string;
    shopName: string;
    avatar?: string;
  }): Promise<VendorRecord> {
    const id = randomUUID();
    await prisma.$executeRaw`
      INSERT INTO "Vendor" (id, phone, passwordHash, name, shopName, avatar, createdAt, updatedAt)
      VALUES (${id}, ${data.phone}, ${data.passwordHash}, ${data.name}, ${data.shopName}, ${data.avatar ?? null}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    const vendor = await this.findById(id);
    if (!vendor) {
      throw new Error("Failed to create vendor");
    }
    return vendor;
  }

  async update(id: string, data: Partial<Pick<VendorRecord, "name" | "shopName" | "avatar">>): Promise<VendorRecord> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error("Vendor not found");
    }

    await prisma.$executeRaw`
      UPDATE "Vendor"
      SET
        name = ${data.name ?? existing.name},
        shopName = ${data.shopName ?? existing.shopName},
        avatar = ${data.avatar ?? existing.avatar},
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error("Failed to update vendor");
    }
    return updated;
  }
}

export const vendorRepository = new VendorRepository();
