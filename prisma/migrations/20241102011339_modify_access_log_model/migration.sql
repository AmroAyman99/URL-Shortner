/*
  Warnings:

  - You are about to drop the column `AcceccTime` on the `accesslog` table. All the data in the column will be lost.
  - You are about to drop the column `IPAddress` on the `accesslog` table. All the data in the column will be lost.
  - Added the required column `IPaddress` to the `AccessLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accesslog` DROP COLUMN `AcceccTime`,
    DROP COLUMN `IPAddress`,
    ADD COLUMN `AccessTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `IPaddress` VARCHAR(191) NOT NULL;
