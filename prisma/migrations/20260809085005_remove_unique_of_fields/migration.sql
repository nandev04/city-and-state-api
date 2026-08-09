/*
  Warnings:

  - You are about to drop the column `siglaUf` on the `State` table. All the data in the column will be lost.
  - Added the required column `stateCode` to the `State` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "State_name_key";

-- DropIndex
DROP INDEX "State_siglaUf_key";

-- AlterTable
ALTER TABLE "State" DROP COLUMN "siglaUf",
ADD COLUMN     "stateCode" VARCHAR(2) NOT NULL;
