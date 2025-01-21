/*
  Warnings:

  - A unique constraint covering the columns `[UserId]` on the table `rsvp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "rsvp_UserId_key" ON "rsvp"("UserId");
