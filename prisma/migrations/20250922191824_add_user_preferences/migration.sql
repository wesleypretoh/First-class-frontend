-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "colorThemePreference" TEXT NOT NULL DEFAULT 'neutral',
ADD COLUMN     "themePreference" TEXT NOT NULL DEFAULT 'system';
