/*
  Warnings:

  - You are about to drop the column `address` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `roles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `profiles` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `gender` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `roles` DROP COLUMN `address`,
    DROP COLUMN `city`,
    DROP COLUMN `gender`;
