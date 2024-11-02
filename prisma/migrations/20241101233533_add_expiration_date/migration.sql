-- AlterTable
ALTER TABLE `url` ADD COLUMN `expirationDate` DATETIME(3) NULL,
    ADD COLUMN `visitCount` INTEGER NOT NULL DEFAULT 0;
