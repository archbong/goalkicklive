-- CreateTable
CREATE TABLE "public"."Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT,
    "sourceRef" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Match" (
    "id" SERIAL NOT NULL,
    "extId" TEXT,
    "homeTeamId" INTEGER NOT NULL,
    "awayTeamId" INTEGER NOT NULL,
    "competitionId" INTEGER NOT NULL,
    "matchDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "status" TEXT NOT NULL DEFAULT 'FINISHED',

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Video" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "embedHtml" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "provider" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "checksum" BYTEA,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Competition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_slug_key" ON "public"."Team"("slug");

-- CreateIndex
CREATE INDEX "Team_country_idx" ON "public"."Team"("country");

-- CreateIndex
CREATE UNIQUE INDEX "Match_extId_key" ON "public"."Match"("extId");

-- CreateIndex
CREATE INDEX "Match_matchDate_idx" ON "public"."Match"("matchDate");

-- CreateIndex
CREATE INDEX "Match_competitionId_idx" ON "public"."Match"("competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_homeTeamId_awayTeamId_matchDate_key" ON "public"."Match"("homeTeamId", "awayTeamId", "matchDate");

-- CreateIndex
CREATE INDEX "Video_publishedAt_idx" ON "public"."Video"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Competition_slug_key" ON "public"."Competition"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Competition_name_country_key" ON "public"."Competition"("name", "country");

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "public"."Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Video" ADD CONSTRAINT "Video_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "public"."Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
