/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `CompanyProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Curriculum` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `CompanyProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foundation` to the `CompanyProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `CompanyProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Curriculum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `Curriculum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Curriculum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `JobOpportunity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `JobOpportunity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `JobOpportunity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fieldOfWork` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technologies` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `companyprofile` ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `foundation` VARCHAR(191) NOT NULL,
    ADD COLUMN `hiring` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `curriculum` ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `details` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `jobopportunity` ADD COLUMN `companyId` INTEGER NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `details` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `userprofile` ADD COLUMN `age` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `fieldOfWork` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `technologies` JSON NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `CompanyProfile_name_key` ON `CompanyProfile`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Curriculum_userId_key` ON `Curriculum`(`userId`);

-- AddForeignKey
ALTER TABLE `JobOpportunity` ADD CONSTRAINT `JobOpportunity_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `CompanyProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Curriculum` ADD CONSTRAINT `Curriculum_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `UserProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
