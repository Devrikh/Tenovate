/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Project` table. All the data in the column will be lost.
  - Added the required column `orgId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_organizationId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "organizationId",
ADD COLUMN     "orgId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
