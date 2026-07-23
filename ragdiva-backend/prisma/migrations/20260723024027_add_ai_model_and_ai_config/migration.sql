/*
  Warnings:

  - You are about to drop the column `modelName` on the `ai_model` table. All the data in the column will be lost.
  - Added the required column `model_name` to the `ai_model` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ai_model` DROP COLUMN `modelName`,
    ADD COLUMN `model_name` VARCHAR(191) NOT NULL,
    MODIFY `provider` ENUM('OpenAI', 'GoogleGenAI', 'OpenRouter', 'Nvidia', 'Ollama', 'ZenOpenCode') NOT NULL;

-- AlterTable
ALTER TABLE `criteria` MODIFY `code` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `name` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT '';
