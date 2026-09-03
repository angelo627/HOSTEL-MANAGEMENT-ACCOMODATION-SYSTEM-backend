/*
  Warnings:

  - Made the column `gender` on table `Hostel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Hostel" ALTER COLUMN "gender" SET NOT NULL;
