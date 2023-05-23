-- CreateTable
CREATE TABLE "_addresses_users" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_addresses_users_AB_unique" ON "_addresses_users"("A", "B");

-- CreateIndex
CREATE INDEX "_addresses_users_B_index" ON "_addresses_users"("B");

-- AddForeignKey
ALTER TABLE "_addresses_users" ADD CONSTRAINT "_addresses_users_A_fkey" FOREIGN KEY ("A") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_addresses_users" ADD CONSTRAINT "_addresses_users_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
