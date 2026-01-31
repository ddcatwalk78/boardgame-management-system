/*
  Warnings:

  - You are about to drop the column `expired_at` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "expired_at",
ADD COLUMN     "expires_at" INTEGER;
