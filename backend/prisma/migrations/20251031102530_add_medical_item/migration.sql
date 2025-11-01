-- CreateEnum
CREATE TYPE "ItemCategoryType" AS ENUM ('DRUG_SUPPLY', 'COURSE', 'LAB_XRAY', 'DIAGNOSIS', 'ADVICE_REFERENCE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "MedicalExamType" AS ENUM ('GENERAL', 'LAB', 'XRAY', 'PACKAGE');

-- CreateTable
CREATE TABLE "ItemCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryType" "ItemCategoryType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalItem" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "examType" "MedicalExamType" NOT NULL,
    "categoryId" INTEGER,
    "nhsoCode" TEXT,
    "genericName" TEXT,
    "unit" TEXT,
    "priceOpd" DECIMAL(10,2),
    "priceIpd" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalItemComponent" (
    "id" SERIAL NOT NULL,
    "parentItemId" TEXT NOT NULL,
    "childItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalItemComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemCodeCounter" (
    "id" SERIAL NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemCodeCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ItemCategory_categoryType_idx" ON "ItemCategory"("categoryType");

-- CreateIndex
CREATE INDEX "ItemCategory_isActive_idx" ON "ItemCategory"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalItem_code_key" ON "MedicalItem"("code");

-- CreateIndex
CREATE INDEX "MedicalItem_examType_idx" ON "MedicalItem"("examType");

-- CreateIndex
CREATE INDEX "MedicalItem_categoryId_idx" ON "MedicalItem"("categoryId");

-- CreateIndex
CREATE INDEX "MedicalItem_isActive_idx" ON "MedicalItem"("isActive");

-- CreateIndex
CREATE INDEX "MedicalItemComponent_parentItemId_idx" ON "MedicalItemComponent"("parentItemId");

-- CreateIndex
CREATE INDEX "MedicalItemComponent_childItemId_idx" ON "MedicalItemComponent"("childItemId");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalItemComponent_parentItemId_childItemId_key" ON "MedicalItemComponent"("parentItemId", "childItemId");

-- AddForeignKey
ALTER TABLE "MedicalItem" ADD CONSTRAINT "MedicalItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ItemCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalItemComponent" ADD CONSTRAINT "MedicalItemComponent_parentItemId_fkey" FOREIGN KEY ("parentItemId") REFERENCES "MedicalItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalItemComponent" ADD CONSTRAINT "MedicalItemComponent_childItemId_fkey" FOREIGN KEY ("childItemId") REFERENCES "MedicalItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
