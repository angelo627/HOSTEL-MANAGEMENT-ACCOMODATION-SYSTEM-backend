/*
  Warnings:

  - Made the column `accommodationFee` on table `Hostel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Hostel" ALTER COLUMN "accommodationFee" SET NOT NULL;
