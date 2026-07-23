/*
  Warnings:

  - You are about to drop the `user_id` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ai_chat_history` DROP FOREIGN KEY `ai_chat_history_session_id_fkey`;

-- DropIndex
DROP INDEX `ai_chat_history_session_id_fkey` ON `ai_chat_history`;

-- AlterTable
ALTER TABLE `criteria` MODIFY `code` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `name` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT '';

-- DropTable
DROP TABLE `user_id`;

-- CreateTable
CREATE TABLE `ai_session` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ai_session` ADD CONSTRAINT `ai_session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_chat_history` ADD CONSTRAINT `ai_chat_history_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `ai_session`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
