-- AlterTable
ALTER TABLE "SystemLog" ADD COLUMN     "hn" TEXT;

-- CreateIndex
CREATE INDEX "SystemLog_hn_idx" ON "SystemLog"("hn");
