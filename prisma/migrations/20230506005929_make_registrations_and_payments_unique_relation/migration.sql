/*
  Warnings:

  - A unique constraint covering the columns `[event_registration_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payments_event_registration_id_key" ON "payments"("event_registration_id");
