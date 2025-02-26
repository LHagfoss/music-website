/*
  Warnings:

  - You are about to drop the column `albumCover` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `Song` table. All the data in the column will be lost.
  - Added the required column `audioUrl` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "albumCover",
DROP COLUMN "fileUrl",
ADD COLUMN     "album" TEXT,
ADD COLUMN     "audioUrl" TEXT NOT NULL,
ADD COLUMN     "coverUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "discordRpcRefreshToken" TEXT,
ADD COLUMN     "discordRpcToken" TEXT;
