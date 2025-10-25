/*
  Warnings:

  - You are about to drop the column `departmentId` on the `RegistrationLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."RegistrationLog" DROP CONSTRAINT "RegistrationLog_departmentId_fkey";

-- AlterTable
ALTER TABLE "RegistrationLog" DROP COLUMN "departmentId";
