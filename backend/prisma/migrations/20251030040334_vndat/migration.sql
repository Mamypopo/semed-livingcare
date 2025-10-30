/*
  Warnings:

  - A unique constraint covering the columns `[branchId,departmentId,queueDate,queueNumber]` on the table `Queue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[branchId,vnDate,vnNumber]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `queueDate` to the `Queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vnDate` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Queue" ADD COLUMN     "queueDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "vnDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Queue_branchId_departmentId_idx" ON "Queue"("branchId", "departmentId");

-- CreateIndex
CREATE INDEX "Queue_queueDate_idx" ON "Queue"("queueDate");

-- CreateIndex
CREATE UNIQUE INDEX "Queue_branchId_departmentId_queueDate_queueNumber_key" ON "Queue"("branchId", "departmentId", "queueDate", "queueNumber");

-- CreateIndex
CREATE INDEX "Registration_branchId_idx" ON "Registration"("branchId");

-- CreateIndex
CREATE INDEX "Registration_vnDate_idx" ON "Registration"("vnDate");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_branchId_vnDate_vnNumber_key" ON "Registration"("branchId", "vnDate", "vnNumber");
