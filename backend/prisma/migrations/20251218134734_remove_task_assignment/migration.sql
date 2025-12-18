/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `tasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assignedTo_fkey";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "assignedTo";
