-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('AMOUNT', 'PERCENTAGE');

-- AlterTable
ALTER TABLE "VisitItem" ADD COLUMN     "discountType" "DiscountType" NOT NULL DEFAULT 'AMOUNT';
