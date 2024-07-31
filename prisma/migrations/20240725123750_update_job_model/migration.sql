/*
  Warnings:

  - Added the required column `cpmpanyName` to the `JobOpportunity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `jobopportunity` ADD COLUMN `cpmpanyName` VARCHAR(191) NOT NULL;
