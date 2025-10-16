-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "createdBy" INTEGER,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedBy" INTEGER;

-- CreateIndex
CREATE INDEX "Patient_createdBy_idx" ON "Patient"("createdBy");

-- CreateIndex
CREATE INDEX "Patient_updatedBy_idx" ON "Patient"("updatedBy");

-- CreateIndex
CREATE INDEX "Patient_hn_idx" ON "Patient"("hn");

-- CreateIndex
CREATE INDEX "Patient_first_name_last_name_idx" ON "Patient"("first_name", "last_name");

-- CreateIndex
CREATE INDEX "Patient_phone_1_idx" ON "Patient"("phone_1");

-- CreateIndex
CREATE INDEX "Patient_national_id_idx" ON "Patient"("national_id");

-- CreateIndex
CREATE INDEX "Patient_isActive_idx" ON "Patient"("isActive");

-- CreateIndex
CREATE INDEX "Patient_createdAt_idx" ON "Patient"("createdAt");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
