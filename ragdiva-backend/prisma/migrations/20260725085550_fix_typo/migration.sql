/*
  Warnings:

  - You are about to drop the column `update_at` on the `files` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `criteria` MODIFY `code` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `name` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `files` DROP COLUMN `update_at`,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
