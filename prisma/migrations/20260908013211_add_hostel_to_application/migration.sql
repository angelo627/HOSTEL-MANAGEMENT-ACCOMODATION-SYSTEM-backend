/*
  Warnings:

  - Added the required column `hostelId` to the `HostelApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HostelApplication" ADD COLUMN     "hostelId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "HostelApplication" ADD CONSTRAINT "HostelApplication_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
