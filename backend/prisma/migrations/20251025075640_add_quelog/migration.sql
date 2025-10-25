-- CreateTable
CREATE TABLE "QueueLog" (
    "id" TEXT NOT NULL,
    "queueId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "reason" TEXT,
    "userId" INTEGER,
    "branchId" INTEGER,
    "queueNumber" TEXT,
    "hn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QueueLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QueueLog" ADD CONSTRAINT "QueueLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueLog" ADD CONSTRAINT "QueueLog_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueLog" ADD CONSTRAINT "QueueLog_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
