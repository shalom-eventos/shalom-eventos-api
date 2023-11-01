-- CreateTable
CREATE TABLE "_addresses_participants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_addresses_participants_AB_unique" ON "_addresses_participants"("A", "B");

-- CreateIndex
CREATE INDEX "_addresses_participants_B_index" ON "_addresses_participants"("B");

-- AddForeignKey
ALTER TABLE "_addresses_participants" ADD CONSTRAINT "_addresses_participants_A_fkey" FOREIGN KEY ("A") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_addresses_participants" ADD CONSTRAINT "_addresses_participants_B_fkey" FOREIGN KEY ("B") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
