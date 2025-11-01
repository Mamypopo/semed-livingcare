-- AlterTable
ALTER TABLE "Icd10" ADD COLUMN     "categoryId" INTEGER;

-- CreateIndex
CREATE INDEX "Icd10_categoryId_idx" ON "Icd10"("categoryId");

-- AddForeignKey
ALTER TABLE "Icd10" ADD CONSTRAINT "Icd10_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ItemCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
