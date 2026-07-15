import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.message.createMany({
    data: [
      { sender: "assistant", text: "Good morning Mama Tolu! How can I help you log your sales today?", type: "text" },
      { sender: "vendor", text: "I just sold 2 mudu of garri to Bisi for 4,000 Naira", type: "text" },
      { sender: "assistant", text: "Got it. I've recorded a sale of ₦4,000 for 2 mudu of garri.", type: "confirmation", confirmationAmount: "4,000" },
      { sender: "vendor", text: "Iya Risi took a bag of rice on credit. Total is 45,000 Naira", type: "text" },
      { sender: "assistant", text: "Recorded. ₦45,000 added to Iya Risi's debt account.", type: "confirmation", confirmationAmount: "45,000" },
    ],
  });

  await prisma.sale.createMany({
    data: [
      { item: "Garri (2 mudu)", amount: 4000, buyerName: "Bisi" },
      { item: "Rice (1 bag)", amount: 45000, buyerName: "Iya Risi" },
    ],
  });

  await prisma.debtEntry.createMany({
    data: [
      { personName: "Bisi", item: "Garri (2 mudu)", amount: 2500, type: "customer", status: "UNPAID", note: "Promised to pay on Friday" },
      { personName: "Iya Risi", item: "Rice (1 bag)", amount: 45000, type: "customer", status: "UNPAID" },
      { personName: "Mallam Abu", item: "Bulk Rice Supply", amount: 120000, type: "supplier", status: "UNPAID", note: "Due by end of month" },
    ],
  });

  await prisma.priceBenchmark.createMany({
    data: [
      { item: "White Garri (Mudu)", currentPrice: 2200, minMarketPrice: 2000, maxMarketPrice: 2500, trend: "stable" },
      { item: "Rice (1 bag)", currentPrice: 45000, minMarketPrice: 42000, maxMarketPrice: 48000, trend: "up" },
      { item: "Beans (Paint Bucket)", currentPrice: 3500, minMarketPrice: 3200, maxMarketPrice: 4000, trend: "down" },
      { item: "Groundnut Oil (Bottle)", currentPrice: 1800, minMarketPrice: 1600, maxMarketPrice: 2000, trend: "stable" },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
