-- CreateTable
CREATE TABLE "VisitItem" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "medicalItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2),
    "discount" DECIMAL(10,2) DEFAULT 0,
    "orderedBy" INTEGER,
    "orderedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "branchId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VisitItem_visitId_idx" ON "VisitItem"("visitId");

-- CreateIndex
CREATE INDEX "VisitItem_medicalItemId_idx" ON "VisitItem"("medicalItemId");

-- CreateIndex
CREATE INDEX "VisitItem_orderedAt_idx" ON "VisitItem"("orderedAt");

-- CreateIndex
CREATE UNIQUE INDEX "VisitItem_visitId_medicalItemId_key" ON "VisitItem"("visitId", "medicalItemId");

-- AddForeignKey
ALTER TABLE "VisitItem" ADD CONSTRAINT "VisitItem_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitItem" ADD CONSTRAINT "VisitItem_medicalItemId_fkey" FOREIGN KEY ("medicalItemId") REFERENCES "MedicalItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitItem" ADD CONSTRAINT "VisitItem_orderedBy_fkey" FOREIGN KEY ("orderedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitItem" ADD CONSTRAINT "VisitItem_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
