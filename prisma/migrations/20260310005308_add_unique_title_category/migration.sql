/*
  Warnings:

  - A unique constraint covering the columns `[title,category]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `images_title_category_key` ON `images`(`title`, `category`);
