/*
  Warnings:

  - The `details` column on the `QueueLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `details` column on the `RegistrationLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "QueueLog" DROP COLUMN "details",
ADD COLUMN     "details" JSONB;

-- AlterTable
ALTER TABLE "RegistrationLog" DROP COLUMN "details",
ADD COLUMN     "details" JSONB;
