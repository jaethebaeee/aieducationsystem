/*
  Warnings:

  - You are about to alter the column `value` on the `progress_data` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- CreateTable
CREATE TABLE "universities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "ranking" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "university_weather_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "universityId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "score" REAL,
    "trend" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "lastUpdated" DATETIME NOT NULL,
    "validUntil" DATETIME,
    "academicYear" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "university_weather_data_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "university_weather_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "universityId" TEXT NOT NULL,
    "reportDate" DATETIME NOT NULL,
    "academicYear" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "overallScore" REAL NOT NULL,
    "climate" TEXT NOT NULL,
    "admissionsClimate" TEXT NOT NULL,
    "culturalAtmosphere" TEXT NOT NULL,
    "academicEnvironment" TEXT NOT NULL,
    "financialLandscape" TEXT NOT NULL,
    "policyChanges" TEXT NOT NULL,
    "marketConditions" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,
    "riskFactors" TEXT NOT NULL,
    "opportunities" TEXT NOT NULL,
    "koreanStudentContext" TEXT NOT NULL,
    "generatedBy" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "university_weather_reports_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "weather_data_sources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "description" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSync" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "weather_alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "universityId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "affectedGroups" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "resolvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "weather_alerts_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_UniversityToWeatherDataSource" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UniversityToWeatherDataSource_A_fkey" FOREIGN KEY ("A") REFERENCES "universities" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UniversityToWeatherDataSource_B_fkey" FOREIGN KEY ("B") REFERENCES "weather_data_sources" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_essays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "targetSchool" TEXT,
    "universityId" TEXT,
    "prompt" TEXT,
    "wordCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "essays_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "essays_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_essays" ("content", "createdAt", "id", "prompt", "status", "targetSchool", "title", "type", "updatedAt", "userId", "wordCount") SELECT "content", "createdAt", "id", "prompt", "status", "targetSchool", "title", "type", "updatedAt", "userId", "wordCount" FROM "essays";
DROP TABLE "essays";
ALTER TABLE "new_essays" RENAME TO "essays";
CREATE TABLE "new_progress_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goalId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "value" REAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "progress_data_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "analytics_goals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_progress_data" ("createdAt", "date", "goalId", "id", "updatedAt", "value") SELECT "createdAt", "date", "goalId", "id", "updatedAt", "value" FROM "progress_data";
DROP TABLE "progress_data";
ALTER TABLE "new_progress_data" RENAME TO "progress_data";
CREATE TABLE "new_resources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "language" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "rating" REAL NOT NULL DEFAULT 0,
    "universityId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "resources_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_resources" ("category", "createdAt", "description", "downloads", "id", "language", "rating", "tags", "thumbnail", "title", "type", "updatedAt", "url") SELECT "category", "createdAt", "description", "downloads", "id", "language", "rating", "tags", "thumbnail", "title", "type", "updatedAt", "url" FROM "resources";
DROP TABLE "resources";
ALTER TABLE "new_resources" RENAME TO "resources";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "universities_name_key" ON "universities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "universities_shortName_key" ON "universities"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "_UniversityToWeatherDataSource_AB_unique" ON "_UniversityToWeatherDataSource"("A", "B");

-- CreateIndex
CREATE INDEX "_UniversityToWeatherDataSource_B_index" ON "_UniversityToWeatherDataSource"("B");
