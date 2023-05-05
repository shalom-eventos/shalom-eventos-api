-- CreateTable
CREATE TABLE "_addresses_events" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_addresses_events_AB_unique" ON "_addresses_events"("A", "B");

-- CreateIndex
CREATE INDEX "_addresses_events_B_index" ON "_addresses_events"("B");

-- AddForeignKey
ALTER TABLE "_addresses_events" ADD CONSTRAINT "_addresses_events_A_fkey" FOREIGN KEY ("A") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_addresses_events" ADD CONSTRAINT "_addresses_events_B_fkey" FOREIGN KEY ("B") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
