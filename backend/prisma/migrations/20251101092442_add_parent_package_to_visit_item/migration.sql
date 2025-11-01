-- AlterTable
ALTER TABLE "VisitItem" ADD COLUMN     "parentPackageId" TEXT;

-- CreateIndex
CREATE INDEX "VisitItem_parentPackageId_idx" ON "VisitItem"("parentPackageId");

-- AddForeignKey
ALTER TABLE "VisitItem" ADD CONSTRAINT "VisitItem_parentPackageId_fkey" FOREIGN KEY ("parentPackageId") REFERENCES "MedicalItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
