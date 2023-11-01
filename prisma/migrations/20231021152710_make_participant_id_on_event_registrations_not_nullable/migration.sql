/*
  Warnings:

  - Made the column `participant_id` on table `event_registrations` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "event_registrations" DROP CONSTRAINT "event_registrations_participant_id_fkey";

-- AlterTable
ALTER TABLE "event_registrations" ALTER COLUMN "participant_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
