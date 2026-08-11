/*
  Warnings:

  - Added the required column `updatedAt` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `State` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "City" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "State" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "City_stateId_name_deletedAt_idx" ON "City"("stateId", "name", "deletedAt");

-- CreateIndex
CREATE INDEX "State_stateCode_deletedAt_idx" ON "State"("stateCode", "deletedAt");

-- CreateIndex
CREATE INDEX "State_name_deletedAt_idx" ON "State"("name", "deletedAt");
