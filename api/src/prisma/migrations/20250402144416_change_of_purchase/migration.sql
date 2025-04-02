/*
  Warnings:

  - You are about to drop the column `sellerId` on the `Stock` table. All the data in the column will be lost.
  - Made the column `sellerId` on table `Purchase` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_stockId_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_sellerId_fkey";

-- AlterTable
ALTER TABLE "Purchase" ALTER COLUMN "stockId" DROP NOT NULL,
ALTER COLUMN "sellerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "sellerId";

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
