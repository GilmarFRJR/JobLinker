/*
  Warnings:

  - A unique constraint covering the columns `[CNPJ]` on the table `CompanyProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `CNPJ` to the `CompanyProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `companyprofile` ADD COLUMN `CNPJ` INTEGER NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL DEFAULT 'a';

-- CreateIndex
CREATE UNIQUE INDEX `CompanyProfile_CNPJ_key` ON `CompanyProfile`(`CNPJ`);
