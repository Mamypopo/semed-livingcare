/*
  Warnings:

  - Changed the type of `treatment_type` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "treatment_type",
ADD COLUMN     "treatment_type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."TreatmentType";
