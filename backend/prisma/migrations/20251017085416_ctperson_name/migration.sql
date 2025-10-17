/*
  Warnings:

  - You are about to drop the column `full_name` on the `ContactPerson` table. All the data in the column will be lost.
  - Added the required column `name` to the `ContactPerson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactPerson" DROP COLUMN "full_name",
ADD COLUMN     "name" TEXT NOT NULL;
