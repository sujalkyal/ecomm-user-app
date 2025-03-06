/*
  Warnings:

  - Added the required column `address` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMode` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('COD', 'Razorpay');

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;
