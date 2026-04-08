-- Recreated migration file to keep local migration history in sync with database history.
-- Original migration was marked as rolled back and removed locally.
-- Keeping this file prevents Prisma from forcing a reset.

ALTER TABLE "Employee" DROP CONSTRAINT IF EXISTS "Employee_bossId_fkey";

ALTER TABLE "Employee"
ADD COLUMN IF NOT EXISTS "isAreaManager" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "managerId" INTEGER,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "Employee"
SET "managerId" = "bossId"
WHERE "bossId" IS NOT NULL
  AND "managerId" IS NULL;

ALTER TABLE "Employee" DROP COLUMN IF EXISTS "bossId";

ALTER TABLE "Employee"
ADD CONSTRAINT "Employee_managerId_fkey"
FOREIGN KEY ("managerId") REFERENCES "Employee"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;