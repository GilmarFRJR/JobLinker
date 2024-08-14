-- AlterTable
ALTER TABLE `userprofile` ADD COLUMN `password` VARCHAR(191) NOT NULL DEFAULT 'a',
    ADD COLUMN `profilePhotoReference` VARCHAR(191) NULL;
