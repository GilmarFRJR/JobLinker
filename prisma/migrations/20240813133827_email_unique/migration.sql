/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `userprofile` ALTER COLUMN `password` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `UserProfile_email_key` ON `UserProfile`(`email`);
