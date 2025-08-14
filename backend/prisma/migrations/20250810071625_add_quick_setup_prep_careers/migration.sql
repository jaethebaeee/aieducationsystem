-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN "alertsDeadlines" BOOLEAN DEFAULT true;
ALTER TABLE "user_profiles" ADD COLUMN "applicationPlatforms" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN "awards" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN "campusSetting" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN "campusSize" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN "citizenship" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN "classRankPercentile" INTEGER;
ALTER TABLE "user_profiles" ADD COLUMN "climatePreference" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN "consentDataUse" BOOLEAN DEFAULT false;
ALTER TABLE "user_profiles" ADD COLUMN "curriculum" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN "edRiskTolerance" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN "gpaType" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN "identityThemes" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN "languagePreference" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN "parentUpdates" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN "visaStatus" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN "weeklyEssayHours" INTEGER;

-- CreateTable
CREATE TABLE "prep_item_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "itemKey" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "prep_item_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "careers_applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "roleSlug" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "resumeText" TEXT,
    "linkedin" TEXT,
    "portfolio" TEXT,
    "qMotivation" TEXT,
    "qImpact" TEXT,
    "qTimeline" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "careers_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "prep_item_progress_userId_collegeId_itemKey_key" ON "prep_item_progress"("userId", "collegeId", "itemKey");
