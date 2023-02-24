-- CreateTable
CREATE TABLE "User" (
    "userID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Options" (
    "optionsID" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Options_pkey" PRIMARY KEY ("optionsID")
);

-- CreateTable
CREATE TABLE "Questions" (
    "questionID" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "rightoption" INTEGER NOT NULL,
    "optionsID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("questionID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Options_description_key" ON "Options"("description");

-- CreateIndex
CREATE UNIQUE INDEX "Questions_question_key" ON "Questions"("question");

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_optionsID_fkey" FOREIGN KEY ("optionsID") REFERENCES "Options"("optionsID") ON DELETE RESTRICT ON UPDATE CASCADE;
