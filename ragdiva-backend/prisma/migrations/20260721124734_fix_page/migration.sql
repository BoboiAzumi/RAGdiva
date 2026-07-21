/*
  Warnings:

  - You are about to drop the column `page` on the `files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `criteria` MODIFY `code` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `name` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `filelink` ADD COLUMN `page` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `files` DROP COLUMN `page`;
