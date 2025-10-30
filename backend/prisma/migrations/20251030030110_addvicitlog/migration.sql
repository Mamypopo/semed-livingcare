-- CreateTable
CREATE TABLE "VisitLog" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "userId" INTEGER,
    "branchId" INTEGER,
    "hn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VisitLog_visitId_idx" ON "VisitLog"("visitId");

-- CreateIndex
CREATE INDEX "VisitLog_userId_idx" ON "VisitLog"("userId");

-- CreateIndex
CREATE INDEX "VisitLog_branchId_idx" ON "VisitLog"("branchId");

-- CreateIndex
CREATE INDEX "VisitLog_action_idx" ON "VisitLog"("action");

-- CreateIndex
CREATE INDEX "VisitLog_createdAt_idx" ON "VisitLog"("createdAt");

-- CreateIndex
CREATE INDEX "VisitLog_hn_idx" ON "VisitLog"("hn");

-- AddForeignKey
ALTER TABLE "VisitLog" ADD CONSTRAINT "VisitLog_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitLog" ADD CONSTRAINT "VisitLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitLog" ADD CONSTRAINT "VisitLog_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
