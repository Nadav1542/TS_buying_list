-- CreateTable
CREATE TABLE `List` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT 'My List',
    `token` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `List_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `listId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `bought` BOOLEAN NOT NULL DEFAULT false,
    `priority` ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
