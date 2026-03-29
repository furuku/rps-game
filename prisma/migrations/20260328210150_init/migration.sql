-- CreateTable
CREATE TABLE "HighScore" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "score" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HighScore_pkey" PRIMARY KEY ("id")
);
