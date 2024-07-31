/*
  Warnings:

  - You are about to drop the column `cpmpanyName` on the `jobopportunity` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `JobOpportunity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `jobopportunity` DROP COLUMN `cpmpanyName`,
    ADD COLUMN `companyName` VARCHAR(191) NOT NULL;
