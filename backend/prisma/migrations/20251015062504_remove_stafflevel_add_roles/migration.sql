/*
  Warnings:

  - You are about to drop the column `staffLevelId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `StaffLevel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StaffPermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."StaffPermission" DROP CONSTRAINT "StaffPermission_staffLevelId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_staffLevelId_fkey";

-- DropIndex
DROP INDEX "public"."User_staffLevelId_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "staffLevelId";

-- DropTable
DROP TABLE "public"."StaffLevel";

-- DropTable
DROP TABLE "public"."StaffPermission";
