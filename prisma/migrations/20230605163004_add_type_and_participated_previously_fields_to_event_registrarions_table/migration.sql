-- AlterTable
ALTER TABLE "event_registrations" ADD COLUMN     "has_participated_previously" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" TEXT;
