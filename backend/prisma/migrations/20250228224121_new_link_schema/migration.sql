/*
  Warnings:

  - You are about to drop the column `contentId` on the `Link` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_contentId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "contentId";

-- CreateIndex
CREATE UNIQUE INDEX "Link_userId_key" ON "Link"("userId");
