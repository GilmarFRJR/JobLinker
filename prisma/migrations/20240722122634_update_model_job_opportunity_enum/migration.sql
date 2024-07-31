/*
  Warnings:

  - Added the required column `jobType` to the `JobOpportunity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `jobopportunity` ADD COLUMN `jobType` ENUM('CLT', 'PJ', 'JOVEM_APRENDIZ') NOT NULL;
