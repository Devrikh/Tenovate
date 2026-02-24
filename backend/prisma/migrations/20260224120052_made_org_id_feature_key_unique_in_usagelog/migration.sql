/*
  Warnings:

  - A unique constraint covering the columns `[orgId,featureKey]` on the table `UsageLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UsageLog_orgId_featureKey_key" ON "UsageLog"("orgId", "featureKey");
