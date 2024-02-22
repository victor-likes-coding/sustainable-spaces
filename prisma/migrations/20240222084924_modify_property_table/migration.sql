/*
  Warnings:

  - You are about to drop the column `allowRentOption` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `rent` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `sqft` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Property` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[zpid]` on the table `Property` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `capex` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homeType` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `livingArea` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `livingAreaUnit` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lotSize` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lotSizeUnit` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parcelId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentType` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vacancy` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearBuilt` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zpid` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "allowRentOption",
DROP COLUMN "price",
DROP COLUMN "rent",
DROP COLUMN "sqft",
DROP COLUMN "year",
ADD COLUMN     "capex" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "homeType" TEXT NOT NULL,
ADD COLUMN     "livingArea" INTEGER NOT NULL,
ADD COLUMN     "livingAreaUnit" TEXT NOT NULL,
ADD COLUMN     "lotSize" INTEGER NOT NULL,
ADD COLUMN     "lotSizeUnit" TEXT NOT NULL,
ADD COLUMN     "parcelId" TEXT NOT NULL,
ADD COLUMN     "paymentType" TEXT NOT NULL,
ADD COLUMN     "vacancy" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "yearBuilt" INTEGER NOT NULL,
ADD COLUMN     "zpid" INTEGER NOT NULL,
ALTER COLUMN "payment" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "hoa" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "token" TEXT;

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Property_zpid_key" ON "Property"("zpid");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
