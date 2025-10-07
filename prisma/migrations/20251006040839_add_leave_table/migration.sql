/*
  Warnings:

  - You are about to alter the column `status` on the `leaves` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `leaves` ADD COLUMN `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `end_date` DATETIME(3) NULL,
    ADD COLUMN `reason` VARCHAR(191) NULL,
    ADD COLUMN `start_date` DATETIME(3) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NULL,
    MODIFY `status` VARCHAR(191) NULL DEFAULT 'Pending';
