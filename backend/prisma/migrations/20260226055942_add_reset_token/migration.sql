-- AlterTable
ALTER TABLE `users` ADD COLUMN `resetToken` VARCHAR(255) NULL,
    ADD COLUMN `reset_token_expiry` DATETIME(3) NULL;
