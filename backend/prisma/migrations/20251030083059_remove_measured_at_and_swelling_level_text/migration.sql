/*
  Warnings:

  - You are about to drop the column `queueDate` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `vnDate` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `measuredAt` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `swellingLevelText` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `VisitDiagnosis` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Queue_branchId_departmentId_idx";

-- DropIndex
DROP INDEX "public"."Queue_branchId_departmentId_queueDate_queueNumber_key";

-- DropIndex
DROP INDEX "public"."Queue_queueDate_idx";

-- DropIndex
DROP INDEX "public"."Registration_branchId_idx";

-- DropIndex
DROP INDEX "public"."Registration_branchId_vnDate_vnNumber_key";

-- DropIndex
DROP INDEX "public"."Registration_vnDate_idx";

-- AlterTable
ALTER TABLE "Queue" DROP COLUMN "queueDate";

-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "vnDate";

-- AlterTable
ALTER TABLE "Visit" DROP COLUMN "measuredAt",
DROP COLUMN "swellingLevelText";

-- AlterTable
ALTER TABLE "VisitDiagnosis" DROP COLUMN "note";
