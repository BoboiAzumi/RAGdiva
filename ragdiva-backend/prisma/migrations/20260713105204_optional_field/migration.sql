-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_major_id_fkey`;

-- DropIndex
DROP INDEX `users_major_id_fkey` ON `users`;

-- AlterTable
ALTER TABLE `criteria` MODIFY `code` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `name` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `users` MODIFY `major_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_major_id_fkey` FOREIGN KEY (`major_id`) REFERENCES `majors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
