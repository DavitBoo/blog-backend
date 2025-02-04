-- CreateTable
CREATE TABLE "_PostToLabel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PostToLabel_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PostToLabel_B_index" ON "_PostToLabel"("B");

-- AddForeignKey
ALTER TABLE "_PostToLabel" ADD CONSTRAINT "_PostToLabel_A_fkey" FOREIGN KEY ("A") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToLabel" ADD CONSTRAINT "_PostToLabel_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
