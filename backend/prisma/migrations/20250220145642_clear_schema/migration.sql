/*
  Warnings:

  - You are about to drop the column `userId` on the `Tags` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_userId_fkey";

-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_TagsToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TagsToUser_AB_unique" ON "_TagsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TagsToUser_B_index" ON "_TagsToUser"("B");

-- AddForeignKey
ALTER TABLE "_TagsToUser" ADD CONSTRAINT "_TagsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagsToUser" ADD CONSTRAINT "_TagsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
