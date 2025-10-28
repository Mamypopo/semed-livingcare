-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER,
    "operatorId" INTEGER,
    "departmentId" TEXT,
    "branchId" INTEGER NOT NULL,
    "visitAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weightKg" DECIMAL(5,2),
    "heightCm" DECIMAL(5,2),
    "bmi" DECIMAL(5,2),
    "bsa" DECIMAL(5,2),
    "temperatureC" DECIMAL(4,1),
    "bpSys" INTEGER,
    "bpDia" INTEGER,
    "pulseRate" INTEGER,
    "respiratoryRate" INTEGER,
    "vas" DECIMAL(3,1),
    "o2Sat" DECIMAL(4,1),
    "crt" TEXT,
    "headCircumferenceCm" DECIMAL(5,2),
    "chestCircumferenceCm" DECIMAL(5,2),
    "waistCircumferenceCm" DECIMAL(5,2),
    "alcohol" TEXT,
    "smoking" TEXT,
    "customFields" JSONB,
    "measuredAt" TIMESTAMP(3),
    "cc" TEXT,
    "hpi" TEXT,
    "pmh" TEXT,
    "dxText" TEXT,
    "ga" TEXT,
    "pe" TEXT,
    "doctorAdvice" TEXT,
    "doctorNote" TEXT,
    "painVas" DECIMAL(3,1),
    "painType" TEXT,
    "painLocation" TEXT,
    "swellingLevel" TEXT,
    "swellingLevelText" TEXT,
    "swellingType" TEXT,
    "swellingLocation" TEXT,
    "mcNotRest" BOOLEAN,
    "mcRestFrom" TIMESTAMP(3),
    "mcRestTo" TIMESTAMP(3),
    "mcCanFly" BOOLEAN,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Icd10" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "nameTh" TEXT NOT NULL,
    "nameEn" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Icd10_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitDiagnosis" (
    "id" SERIAL NOT NULL,
    "visitId" TEXT NOT NULL,
    "icd10Id" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitDiagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visit_patientId_visitAt_idx" ON "Visit"("patientId", "visitAt");

-- CreateIndex
CREATE INDEX "Visit_registrationId_idx" ON "Visit"("registrationId");

-- CreateIndex
CREATE INDEX "Visit_doctorId_visitAt_idx" ON "Visit"("doctorId", "visitAt");

-- CreateIndex
CREATE INDEX "Visit_branchId_visitAt_idx" ON "Visit"("branchId", "visitAt");

-- CreateIndex
CREATE UNIQUE INDEX "Icd10_code_key" ON "Icd10"("code");

-- CreateIndex
CREATE INDEX "Icd10_code_idx" ON "Icd10"("code");

-- CreateIndex
CREATE INDEX "Icd10_isActive_idx" ON "Icd10"("isActive");

-- CreateIndex
CREATE INDEX "VisitDiagnosis_visitId_idx" ON "VisitDiagnosis"("visitId");

-- CreateIndex
CREATE INDEX "VisitDiagnosis_icd10Id_idx" ON "VisitDiagnosis"("icd10Id");

-- CreateIndex
CREATE UNIQUE INDEX "VisitDiagnosis_visitId_icd10Id_key" ON "VisitDiagnosis"("visitId", "icd10Id");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitDiagnosis" ADD CONSTRAINT "VisitDiagnosis_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitDiagnosis" ADD CONSTRAINT "VisitDiagnosis_icd10Id_fkey" FOREIGN KEY ("icd10Id") REFERENCES "Icd10"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
