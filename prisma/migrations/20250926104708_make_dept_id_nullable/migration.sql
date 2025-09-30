-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_dept_id_fkey`;

-- DropIndex
DROP INDEX `users_dept_id_fkey` ON `users`;

-- AlterTable
ALTER TABLE `users` MODIFY `dept_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_dept_id_fkey` FOREIGN KEY (`dept_id`) REFERENCES `departments`(`department_id`) ON DELETE SET NULL ON UPDATE CASCADE;
