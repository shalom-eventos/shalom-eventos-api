/*
  Warnings:

  - You are about to drop the column `expires_in` on the `event_tickets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event_tickets" RENAME COLUMN "expires_in" TO "expires_at";
