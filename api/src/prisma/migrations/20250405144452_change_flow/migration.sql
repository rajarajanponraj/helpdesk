/*
  Warnings:

  - The values [damaged,obsolete] on the enum `ServiceReason` will be removed. If these variants are still used in the database, this will fail.
  - The values [fixed,replaced,discarded] on the enum `ServiceStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [new,good,need_repair] on the enum `StockCondition` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `labId` on the `ServiceRegister` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `ServiceRegister` table. All the data in the column will be lost.
  - You are about to drop the column `stockId` on the `ServiceRegister` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Stock` table. All the data in the column will be lost.
  - Made the column `stockId` on table `Purchase` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `labStockId` to the `ServiceRegister` table without a default value. This is not possible if the table is not empty.
  - Made the column `labId` on table `StockScrap` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ServiceReason_new" AS ENUM ('DAMAGED', 'OBSOLETE');
ALTER TABLE "ServiceRecord" ALTER COLUMN "reason" TYPE "ServiceReason_new" USING ("reason"::text::"ServiceReason_new");
ALTER TYPE "ServiceReason" RENAME TO "ServiceReason_old";
ALTER TYPE "ServiceReason_new" RENAME TO "ServiceReason";
DROP TYPE "ServiceReason_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ServiceStatus_new" AS ENUM ('FIXED', 'REPLACED', 'DISCARDED');
ALTER TABLE "ServiceRecord" ALTER COLUMN "status" TYPE "ServiceStatus_new" USING ("status"::text::"ServiceStatus_new");
ALTER TYPE "ServiceStatus" RENAME TO "ServiceStatus_old";
ALTER TYPE "ServiceStatus_new" RENAME TO "ServiceStatus";
DROP TYPE "ServiceStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StockCondition_new" AS ENUM ('NEW', 'GOOD', 'NEEDS_REPAIR');
ALTER TABLE "ServiceRecord" ALTER COLUMN "condition" TYPE "StockCondition_new" USING ("condition"::text::"StockCondition_new");
ALTER TYPE "StockCondition" RENAME TO "StockCondition_old";
ALTER TYPE "StockCondition_new" RENAME TO "StockCondition";
DROP TYPE "StockCondition_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_stockId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRegister" DROP CONSTRAINT "ServiceRegister_labId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRegister" DROP CONSTRAINT "ServiceRegister_stockId_fkey";

-- DropForeignKey
ALTER TABLE "StockScrap" DROP CONSTRAINT "StockScrap_labId_fkey";

-- AlterTable
ALTER TABLE "Purchase" ALTER COLUMN "stockId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ServiceRegister" DROP COLUMN "labId",
DROP COLUMN "quantity",
DROP COLUMN "stockId",
ADD COLUMN     "labStockId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "StockScrap" ALTER COLUMN "labId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockScrap" ADD CONSTRAINT "StockScrap_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRegister" ADD CONSTRAINT "ServiceRegister_labStockId_fkey" FOREIGN KEY ("labStockId") REFERENCES "LabStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
