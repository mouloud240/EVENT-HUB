/*
  Warnings:

  - You are about to drop the column `location` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "location",
ADD COLUMN     "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "long" DOUBLE PRECISION NOT NULL DEFAULT 0;
