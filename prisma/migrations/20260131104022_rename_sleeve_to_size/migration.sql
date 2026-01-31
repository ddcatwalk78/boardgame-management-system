/*
  Warnings:

  - You are about to drop the column `height` on the `Sleeve` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Sleeve` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Sleeve` table. All the data in the column will be lost.
  - Added the required column `sizeId` to the `Sleeve` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GameSleeve" DROP CONSTRAINT "GameSleeve_sleeveSizeId_fkey";

-- AlterTable
ALTER TABLE "Sleeve" DROP COLUMN "height",
DROP COLUMN "name",
DROP COLUMN "width",
ADD COLUMN     "sizeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SleeveSize" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SleeveSize_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sleeve" ADD CONSTRAINT "Sleeve_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "SleeveSize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSleeve" ADD CONSTRAINT "GameSleeve_sleeveSizeId_fkey" FOREIGN KEY ("sleeveSizeId") REFERENCES "SleeveSize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
