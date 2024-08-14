/*
  Warnings:

  - Made the column `CNPJ` on table `companyprofile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `companyprofile` MODIFY `CNPJ` VARCHAR(191) NOT NULL;
