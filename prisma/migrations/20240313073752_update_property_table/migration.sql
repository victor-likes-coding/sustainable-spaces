/*
  Warnings:

  - You are about to drop the column `address` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `baths` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `beds` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `insurance` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `livingAreaUnit` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `lotSizeUnit` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `payment` on the `Property` table. All the data in the column will be lost.
  - Added the required column `annualHomeownersInsurance` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bathrooms` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedrooms` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `livingAreaUnits` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lotAreaUnits` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetAddress` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "address",
DROP COLUMN "baths",
DROP COLUMN "beds",
DROP COLUMN "insurance",
DROP COLUMN "livingAreaUnit",
DROP COLUMN "lotSizeUnit",
DROP COLUMN "payment",
ADD COLUMN     "annualHomeownersInsurance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bathrooms" INTEGER NOT NULL,
ADD COLUMN     "bedrooms" INTEGER NOT NULL,
ADD COLUMN     "livingAreaUnits" TEXT NOT NULL,
ADD COLUMN     "lotAreaUnits" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "streetAddress" TEXT NOT NULL,
ALTER COLUMN "likesCount" SET DEFAULT 0;
