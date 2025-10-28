-- AlterTable
ALTER TABLE "Icd10" ADD COLUMN     "groupCode" TEXT,
ADD COLUMN     "groupNameEn" TEXT,
ADD COLUMN     "groupNameTh" TEXT;

-- CreateIndex
CREATE INDEX "Icd10_groupCode_idx" ON "Icd10"("groupCode");
