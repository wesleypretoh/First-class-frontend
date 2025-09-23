-- AlterTable
ALTER TABLE "public"."User"
    ADD COLUMN "languagePreference" TEXT NOT NULL DEFAULT 'en';
