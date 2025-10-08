-- CreateTable
CREATE TABLE `Otp` (
    `otp_id` INTEGER NOT NULL AUTO_INCREMENT,
    `otp_email` VARCHAR(191) NOT NULL,
    `otp_code` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `is_expired` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`otp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
