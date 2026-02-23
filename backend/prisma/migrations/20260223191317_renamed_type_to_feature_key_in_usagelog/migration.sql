/*
  Warnings:

  - You are about to drop the column `type` on the `UsageLog` table. All the data in the column will be lost.
  - Added the required column `featureKey` to the `UsageLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsageLog" DROP COLUMN "type",
ADD COLUMN     "featureKey" TEXT NOT NULL;
