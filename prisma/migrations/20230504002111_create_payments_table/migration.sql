-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "event_registration_id" TEXT NOT NULL,
    "event_ticket_id" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "file" TEXT,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_event_registration_id_fkey" FOREIGN KEY ("event_registration_id") REFERENCES "event_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_event_ticket_id_fkey" FOREIGN KEY ("event_ticket_id") REFERENCES "event_tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
