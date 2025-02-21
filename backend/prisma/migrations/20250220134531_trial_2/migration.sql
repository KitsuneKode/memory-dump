/*
  Warnings:

  - You are about to drop the column `contentId` on the `Tags` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_contentId_fkey";

-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "contentId";

-- CreateTable
CREATE TABLE "_ContentToTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ContentToLink" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContentToTags_AB_unique" ON "_ContentToTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ContentToTags_B_index" ON "_ContentToTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContentToLink_AB_unique" ON "_ContentToLink"("A", "B");

-- CreateIndex
CREATE INDEX "_ContentToLink_B_index" ON "_ContentToLink"("B");

-- AddForeignKey
ALTER TABLE "_ContentToTags" ADD CONSTRAINT "_ContentToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToTags" ADD CONSTRAINT "_ContentToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToLink" ADD CONSTRAINT "_ContentToLink_A_fkey" FOREIGN KEY ("A") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToLink" ADD CONSTRAINT "_ContentToLink_B_fkey" FOREIGN KEY ("B") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
