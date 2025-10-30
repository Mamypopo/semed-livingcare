/*
  Warnings:

  - A unique constraint covering the columns `[registrationId,visitSeq]` on the table `Visit` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "visitSeqCurrent" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "visitSeq" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Visit_registrationId_visitSeq_key" ON "Visit"("registrationId", "visitSeq");
