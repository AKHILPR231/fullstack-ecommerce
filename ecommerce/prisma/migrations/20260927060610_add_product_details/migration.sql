-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;
