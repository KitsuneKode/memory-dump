/*
  Warnings:

  - You are about to drop the column `share` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the `_ContentToLink` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contentId` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ContentToLink" DROP CONSTRAINT "_ContentToLink_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContentToLink" DROP CONSTRAINT "_ContentToLink_B_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "share",
ADD COLUMN     "contentId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ContentToLink";

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
