-- CreateEnum
CREATE TYPE "rsvpStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "user" (
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "UserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvp" (
    "id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "EventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "rsvpStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "rsvp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "event_name_UserId_idx" ON "event"("name", "UserId");

-- CreateIndex
CREATE INDEX "rsvp_UserId_EventId_idx" ON "rsvp"("UserId", "EventId");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvp" ADD CONSTRAINT "rsvp_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvp" ADD CONSTRAINT "rsvp_EventId_fkey" FOREIGN KEY ("EventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
