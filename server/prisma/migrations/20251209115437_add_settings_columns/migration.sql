-- AlterTable
ALTER TABLE "users" ADD COLUMN     "app_font" TEXT NOT NULL DEFAULT 'sans-serif',
ADD COLUMN     "app_theme" TEXT NOT NULL DEFAULT 'light';
