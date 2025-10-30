-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledBy" INTEGER;
