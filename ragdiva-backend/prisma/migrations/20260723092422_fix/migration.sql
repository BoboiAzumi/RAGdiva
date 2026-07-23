/*
  Warnings:

  - You are about to drop the `filelink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `filelink` DROP FOREIGN KEY `FileLink_criteria_id_fkey`;

-- DropForeignKey
ALTER TABLE `filelink` DROP FOREIGN KEY `FileLink_file_id_fkey`;

-- AlterTable
ALTER TABLE `criteria` MODIFY `code` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `name` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT '';

-- DropTable
DROP TABLE `filelink`;

-- CreateTable
CREATE TABLE `file_links` (
    `id` VARCHAR(191) NOT NULL,
    `criteria_id` VARCHAR(191) NOT NULL,
    `file_id` VARCHAR(191) NOT NULL,
    `criteria_link` VARCHAR(191) NOT NULL,
    `page` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `file_links` ADD CONSTRAINT `file_links_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file_links` ADD CONSTRAINT `file_links_criteria_id_fkey` FOREIGN KEY (`criteria_id`) REFERENCES `criteria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
