/*
  Warnings:

  - You are about to drop the column `major_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_major_id_fkey`;

-- DropIndex
DROP INDEX `users_major_id_fkey` ON `users`;

-- AlterTable
ALTER TABLE `criteria` MODIFY `code` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `name` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `users` DROP COLUMN `major_id`;

-- CreateTable
CREATE TABLE `MajorAccess` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `major_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MajorAccess` ADD CONSTRAINT `MajorAccess_major_id_fkey` FOREIGN KEY (`major_id`) REFERENCES `majors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MajorAccess` ADD CONSTRAINT `MajorAccess_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
