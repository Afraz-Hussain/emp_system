-- AlterTable
ALTER TABLE `departments` ADD COLUMN `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `departmenthead` VARCHAR(255) NULL,
    ADD COLUMN `total_employees` INTEGER NULL,
    ADD COLUMN `updated_at` DATETIME(3) NULL;
