/*
  Warnings:

  - You are about to drop the `_UniversityToWeatherDataSource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `university_weather_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `university_weather_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `weather_alerts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `weather_data_sources` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_UniversityToWeatherDataSource";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "university_weather_data";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "university_weather_reports";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "weather_alerts";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "weather_data_sources";
PRAGMA foreign_keys=on;
