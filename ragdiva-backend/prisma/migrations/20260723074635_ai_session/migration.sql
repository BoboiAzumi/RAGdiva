-- AlterTable
ALTER TABLE `criteria` MODIFY `code` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `name` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE `ai_chat_history` ADD CONSTRAINT `ai_chat_history_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `user_id`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
