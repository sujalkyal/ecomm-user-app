/*
  Warnings:

  - The `products` column on the `Orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cart` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "products",
ADD COLUMN     "products" JSONB[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cart",
ADD COLUMN     "cart" JSONB[];
