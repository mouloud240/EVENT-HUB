-- DropIndex
DROP INDEX "event_name_UserId_idx";

-- DropIndex
DROP INDEX "user_email_idx";

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "coverPic" TEXT,
ADD COLUMN     "detailedPics" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "profilePicUrl" TEXT;

-- CreateIndex
CREATE INDEX "event_name_UserId_date_idx" ON "event"("name", "UserId", "date");

-- CreateIndex
CREATE INDEX "user_email_name_idx" ON "user"("email", "name");
