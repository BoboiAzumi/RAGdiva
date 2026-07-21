/*
  Warnings:

  - Added the required column `accreditation` to the `majors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `criteria` MODIFY `code` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `name` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `majors` ADD COLUMN `accreditation` ENUM('Unggul', 'Baik Sekali', 'Baik', 'Tidak Terakreditasi') NOT NULL;
