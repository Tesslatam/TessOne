/*
  Warnings:

  - You are about to drop the column `address` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Client` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identification` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personTypeId` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "address",
DROP COLUMN "phone",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "identification" TEXT NOT NULL,
ADD COLUMN     "passport" TEXT,
ADD COLUMN     "personTypeId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "PersonType" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PersonType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_code_key" ON "Client"("code");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_personTypeId_fkey" FOREIGN KEY ("personTypeId") REFERENCES "PersonType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
