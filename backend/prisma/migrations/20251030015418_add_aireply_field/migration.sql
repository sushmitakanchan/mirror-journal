-- AlterTable
ALTER TABLE "public"."Entry" ADD COLUMN     "aiReply" TEXT,
ALTER COLUMN "mood" DROP NOT NULL;
