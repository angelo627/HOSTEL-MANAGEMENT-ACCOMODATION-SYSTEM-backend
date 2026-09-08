-- AlterEnum
ALTER TYPE "AllocationStatus" ADD VALUE 'RESERVED';

-- AlterTable
ALTER TABLE "Allocation" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "reservedAt" TIMESTAMP(3);
