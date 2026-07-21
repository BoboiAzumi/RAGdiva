/*
  Warnings:

  - You are about to drop the column `criteria_id` on the `files` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `files` DROP FOREIGN KEY `files_criteria_id_fkey`;

-- DropIndex
DROP INDEX `files_criteria_id_fkey` ON `files`;

-- AlterTable
ALTER TABLE `criteria` MODIFY `code` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `name` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `files` DROP COLUMN `criteria_id`;

-- CreateTable
CREATE TABLE `FileLink` (
    `id` VARCHAR(191) NOT NULL,
    `criteria_id` VARCHAR(191) NOT NULL,
    `file_id` VARCHAR(191) NOT NULL,
    `criteria_link` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FileLink` ADD CONSTRAINT `FileLink_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FileLink` ADD CONSTRAINT `FileLink_criteria_id_fkey` FOREIGN KEY (`criteria_id`) REFERENCES `criteria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
