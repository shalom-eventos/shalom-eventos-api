-- CreateTable
CREATE TABLE "addresses_events" (
    "event_id" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,

    CONSTRAINT "addresses_events_pkey" PRIMARY KEY ("event_id","address_id")
);

-- AddForeignKey
ALTER TABLE "addresses_events" ADD CONSTRAINT "addresses_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses_events" ADD CONSTRAINT "addresses_events_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
