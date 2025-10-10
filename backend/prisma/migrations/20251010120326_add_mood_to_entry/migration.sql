/*
  Warnings:

  - Added the required column `mood` to the `Entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Entry" ADD COLUMN     "mood" TEXT NOT NULL;
