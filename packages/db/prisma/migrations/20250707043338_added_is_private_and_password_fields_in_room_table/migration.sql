-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT;
