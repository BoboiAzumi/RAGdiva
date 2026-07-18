/*
  Warnings:

  - Added the required column `status` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `criteria` MODIFY `code` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `name` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `files` ADD COLUMN `status` ENUM('Processing', 'Completed', 'Reprocessing', 'Failed') NOT NULL;
