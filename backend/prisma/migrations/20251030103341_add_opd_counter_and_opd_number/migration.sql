/*
  Warnings:

  - A unique constraint covering the columns `[opdNumber]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[branchId,opdYear,opdSeq]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "opdNumber" TEXT,
ADD COLUMN     "opdSeq" INTEGER,
ADD COLUMN     "opdYear" INTEGER;

-- CreateTable
CREATE TABLE "OpdCounter" (
    "id" SERIAL NOT NULL,
    "branchId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpdCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OpdCounter_branchId_idx" ON "OpdCounter"("branchId");

-- CreateIndex
CREATE INDEX "OpdCounter_year_idx" ON "OpdCounter"("year");

-- CreateIndex
CREATE UNIQUE INDEX "OpdCounter_branchId_year_key" ON "OpdCounter"("branchId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_opdNumber_key" ON "Registration"("opdNumber");

-- CreateIndex
CREATE INDEX "Registration_opdNumber_idx" ON "Registration"("opdNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_branchId_opdYear_opdSeq_key" ON "Registration"("branchId", "opdYear", "opdSeq");

-- AddForeignKey
ALTER TABLE "OpdCounter" ADD CONSTRAINT "OpdCounter_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
