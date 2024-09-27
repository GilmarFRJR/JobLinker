-- DropForeignKey
ALTER TABLE `curriculum` DROP FOREIGN KEY `Curriculum_userId_fkey`;

-- DropForeignKey
ALTER TABLE `jobapplication` DROP FOREIGN KEY `JobApplication_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Curriculum` ADD CONSTRAINT `Curriculum_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `UserProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobApplication` ADD CONSTRAINT `JobApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `UserProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
