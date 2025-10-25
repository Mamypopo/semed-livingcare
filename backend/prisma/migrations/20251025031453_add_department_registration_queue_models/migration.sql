/*
  Warnings:

  - You are about to drop the column `status` on the `Registration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Queue" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledBy" INTEGER,
ADD COLUMN     "reason" TEXT,
ALTER COLUMN "queueNumber" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "status",
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledBy" INTEGER,
ADD COLUMN     "reason" TEXT;

-- AlterTable
ALTER TABLE "RegistrationLog" ADD COLUMN     "reason" TEXT,
ALTER COLUMN "details" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_cancelledBy_fkey" FOREIGN KEY ("cancelledBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_cancelledBy_fkey" FOREIGN KEY ("cancelledBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
