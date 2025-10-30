-- CreateEnum
CREATE TYPE "PlanAbonnement" AS ENUM ('FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE');

-- CreateTable
CREATE TABLE "Entreprise" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "siret" TEXT,
    "email" TEXT NOT NULL,
    "plan" "PlanAbonnement" NOT NULL DEFAULT 'FREE',
    "abonnementActif" BOOLEAN NOT NULL DEFAULT true,
    "dateAbonnement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateExpiration" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entreprise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entreprise_siret_key" ON "Entreprise"("siret");
CREATE UNIQUE INDEX "Entreprise_email_key" ON "Entreprise"("email");
CREATE INDEX "Entreprise_email_idx" ON "Entreprise"("email");
CREATE INDEX "Entreprise_siret_idx" ON "Entreprise"("siret");
CREATE INDEX "Entreprise_abonnementActif_idx" ON "Entreprise"("abonnementActif");

-- AlterTable User: Add entrepriseId
ALTER TABLE "User" ADD COLUMN "entrepriseId" TEXT;
CREATE INDEX "User_entrepriseId_idx" ON "User"("entrepriseId");

-- AlterTable Client: Add entrepriseId
ALTER TABLE "Client" ADD COLUMN "entrepriseId" TEXT;
CREATE INDEX "Client_entrepriseId_idx" ON "Client"("entrepriseId");

-- AlterTable Categorie: Add entrepriseId
ALTER TABLE "Categorie" ADD COLUMN "entrepriseId" TEXT;
CREATE INDEX "Categorie_entrepriseId_idx" ON "Categorie"("entrepriseId");

-- AlterTable Article: Add entrepriseId and change reference unique constraint
ALTER TABLE "Article" ADD COLUMN "entrepriseId" TEXT;
ALTER TABLE "Article" DROP CONSTRAINT "Article_reference_key";
CREATE INDEX "Article_entrepriseId_idx" ON "Article"("entrepriseId");
CREATE UNIQUE INDEX "Article_entrepriseId_reference_key" ON "Article"("entrepriseId", "reference");

-- AlterTable Document: Add entrepriseId and change numero unique constraint
ALTER TABLE "Document" ADD COLUMN "entrepriseId" TEXT;
ALTER TABLE "Document" DROP CONSTRAINT "Document_numero_key";
CREATE INDEX "Document_entrepriseId_idx" ON "Document"("entrepriseId");
CREATE UNIQUE INDEX "Document_entrepriseId_numero_key" ON "Document"("entrepriseId", "numero");

-- AlterTable MouvementStock: Add entrepriseId
ALTER TABLE "MouvementStock" ADD COLUMN "entrepriseId" TEXT;
CREATE INDEX "MouvementStock_entrepriseId_idx" ON "MouvementStock"("entrepriseId");

-- AlterTable ParametresEntreprise: Add entrepriseId and change primary key
ALTER TABLE "ParametresEntreprise" DROP CONSTRAINT "ParametresEntreprise_pkey";
ALTER TABLE "ParametresEntreprise" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "ParametresEntreprise" ALTER COLUMN "id" TYPE TEXT;
ALTER TABLE "ParametresEntreprise" ADD COLUMN "entrepriseId" TEXT;
ALTER TABLE "ParametresEntreprise" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "ParametresEntreprise" ADD CONSTRAINT "ParametresEntreprise_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX "ParametresEntreprise_entrepriseId_key" ON "ParametresEntreprise"("entrepriseId");
CREATE INDEX "ParametresEntreprise_entrepriseId_idx" ON "ParametresEntreprise"("entrepriseId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categorie" ADD CONSTRAINT "Categorie_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MouvementStock" ADD CONSTRAINT "MouvementStock_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParametresEntreprise" ADD CONSTRAINT "ParametresEntreprise_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
