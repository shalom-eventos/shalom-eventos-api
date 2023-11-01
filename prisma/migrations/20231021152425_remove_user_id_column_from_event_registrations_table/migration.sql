/*
  Warnings:

  - You are about to drop the column `user_id` on the `event_registrations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "event_registrations" DROP CONSTRAINT "event_registrations_user_id_fkey";

-- AlterTable
ALTER TABLE "event_registrations" DROP COLUMN "user_id";
