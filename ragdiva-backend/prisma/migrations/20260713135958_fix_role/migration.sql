/*
  Warnings:

  - Added the required column `level` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `criteria` MODIFY `code` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `name` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `level` ENUM('Admin', 'User', 'Asesor') NOT NULL;
