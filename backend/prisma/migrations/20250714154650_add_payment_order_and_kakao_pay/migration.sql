/*
  Warnings:

  - You are about to drop the column `aiModelVersion` on the `essay_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `analysisTime` on the `essay_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `contentScore` on the `essay_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `culturalScore` on the `essay_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `overallScore` on the `essay_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `readabilityScore` on the `essay_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `structureScore` on the `essay_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `styleScore` on the `essay_analytics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN "kakaoPaySubscriptionId" TEXT;

-- CreateTable
CREATE TABLE "payment_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planType" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "metadata" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "payment_orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_essay_analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "essayId" TEXT NOT NULL,
    "readingTime" INTEGER NOT NULL DEFAULT 0,
    "readingLevel" TEXT,
    "complexityScore" REAL,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "sentenceCount" INTEGER NOT NULL DEFAULT 0,
    "paragraphCount" INTEGER NOT NULL DEFAULT 0,
    "grammarScore" REAL,
    "clarityScore" REAL,
    "impactScore" REAL,
    "culturalRelevance" REAL,
    "authenticityScore" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "essay_analytics_essayId_fkey" FOREIGN KEY ("essayId") REFERENCES "essays" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_essay_analytics" ("complexityScore", "createdAt", "essayId", "grammarScore", "id", "readingTime", "updatedAt") SELECT "complexityScore", "createdAt", "essayId", "grammarScore", "id", coalesce("readingTime", 0) AS "readingTime", "updatedAt" FROM "essay_analytics";
DROP TABLE "essay_analytics";
ALTER TABLE "new_essay_analytics" RENAME TO "essay_analytics";
CREATE UNIQUE INDEX "essay_analytics_essayId_key" ON "essay_analytics"("essayId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "payment_orders_orderId_key" ON "payment_orders"("orderId");
