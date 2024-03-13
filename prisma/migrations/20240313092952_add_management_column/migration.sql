/*
  Warnings:

  - You are about to drop the column `zip` on the `Property` table. All the data in the column will be lost.
  - Added the required column `management` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipcode` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "zip",
ADD COLUMN     "management" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "zipcode" INTEGER NOT NULL;
