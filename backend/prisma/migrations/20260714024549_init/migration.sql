-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sender" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "confirmationAmount" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "item" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "buyerName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DebtEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personName" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PriceBenchmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "item" TEXT NOT NULL,
    "currentPrice" INTEGER NOT NULL,
    "minMarketPrice" INTEGER NOT NULL,
    "maxMarketPrice" INTEGER NOT NULL,
    "trend" TEXT NOT NULL DEFAULT 'stable'
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceBenchmark_item_key" ON "PriceBenchmark"("item");
