-- Migration Multi-Tenant SAFE (ignore les erreurs si contraintes n'existent pas)

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "PlanAbonnement" AS ENUM ('FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable Entreprise
CREATE TABLE IF NOT EXISTS "Entreprise" (
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
CREATE UNIQUE INDEX IF NOT EXISTS "Entreprise_siret_key" ON "Entreprise"("siret");
CREATE UNIQUE INDEX IF NOT EXISTS "Entreprise_email_key" ON "Entreprise"("email");
CREATE INDEX IF NOT EXISTS "Entreprise_email_idx" ON "Entreprise"("email");
CREATE INDEX IF NOT EXISTS "Entreprise_siret_idx" ON "Entreprise"("siret");
CREATE INDEX IF NOT EXISTS "Entreprise_abonnementActif_idx" ON "Entreprise"("abonnementActif");

-- AlterTable User: Add entrepriseId
DO $$ BEGIN
    ALTER TABLE "User" ADD COLUMN "entrepriseId" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;
CREATE INDEX IF NOT EXISTS "User_entrepriseId_idx" ON "User"("entrepriseId");

-- AlterTable Client: Add entrepriseId
DO $$ BEGIN
    ALTER TABLE "Client" ADD COLUMN "entrepriseId" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;
CREATE INDEX IF NOT EXISTS "Client_entrepriseId_idx" ON "Client"("entrepriseId");

-- AlterTable Categorie: Add entrepriseId
DO $$ BEGIN
    ALTER TABLE "Categorie" ADD COLUMN "entrepriseId" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;
CREATE INDEX IF NOT EXISTS "Categorie_entrepriseId_idx" ON "Categorie"("entrepriseId");

-- AlterTable Article: Add entrepriseId and change reference unique constraint
DO $$ BEGIN
    ALTER TABLE "Article" ADD COLUMN "entrepriseId" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Drop la contrainte unique sur reference si elle existe
DO $$ BEGIN
    ALTER TABLE "Article" DROP CONSTRAINT IF EXISTS "Article_reference_key";
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "Article_entrepriseId_idx" ON "Article"("entrepriseId");
CREATE UNIQUE INDEX IF NOT EXISTS "Article_entrepriseId_reference_key" ON "Article"("entrepriseId", "reference");

-- AlterTable Document: Add entrepriseId and change numero unique constraint
DO $$ BEGIN
    ALTER TABLE "Document" ADD COLUMN "entrepriseId" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Drop la contrainte unique sur numero si elle existe
DO $$ BEGIN
    ALTER TABLE "Document" DROP CONSTRAINT IF EXISTS "Document_numero_key";
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "Document_entrepriseId_idx" ON "Document"("entrepriseId");
CREATE UNIQUE INDEX IF NOT EXISTS "Document_entrepriseId_numero_key" ON "Document"("entrepriseId", "numero");

-- AlterTable MouvementStock: Add entrepriseId
DO $$ BEGIN
    ALTER TABLE "MouvementStock" ADD COLUMN "entrepriseId" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;
CREATE INDEX IF NOT EXISTS "MouvementStock_entrepriseId_idx" ON "MouvementStock"("entrepriseId");

-- AlterTable ParametresEntreprise: Add entrepriseId and change primary key
DO $$ BEGIN
    ALTER TABLE "ParametresEntreprise" DROP CONSTRAINT IF EXISTS "ParametresEntreprise_pkey";
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "ParametresEntreprise" ALTER COLUMN "id" DROP DEFAULT;
EXCEPTION
    WHEN undefined_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "ParametresEntreprise" ALTER COLUMN "id" TYPE TEXT;
EXCEPTION
    WHEN undefined_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "ParametresEntreprise" ADD COLUMN "entrepriseId" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "ParametresEntreprise" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "ParametresEntreprise" ADD CONSTRAINT "ParametresEntreprise_pkey" PRIMARY KEY ("id");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "ParametresEntreprise_entrepriseId_key" ON "ParametresEntreprise"("entrepriseId");
CREATE INDEX IF NOT EXISTS "ParametresEntreprise_entrepriseId_idx" ON "ParametresEntreprise"("entrepriseId");

-- AddForeignKey (DROP si existe déjà puis recréer)
DO $$ BEGIN
    ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_entrepriseId_fkey";
    ALTER TABLE "User" ADD CONSTRAINT "User_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "Client" DROP CONSTRAINT IF EXISTS "Client_entrepriseId_fkey";
    ALTER TABLE "Client" ADD CONSTRAINT "Client_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "Categorie" DROP CONSTRAINT IF EXISTS "Categorie_entrepriseId_fkey";
    ALTER TABLE "Categorie" ADD CONSTRAINT "Categorie_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "Article" DROP CONSTRAINT IF EXISTS "Article_entrepriseId_fkey";
    ALTER TABLE "Article" ADD CONSTRAINT "Article_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "Document" DROP CONSTRAINT IF EXISTS "Document_entrepriseId_fkey";
    ALTER TABLE "Document" ADD CONSTRAINT "Document_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "MouvementStock" DROP CONSTRAINT IF EXISTS "MouvementStock_entrepriseId_fkey";
    ALTER TABLE "MouvementStock" ADD CONSTRAINT "MouvementStock_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "ParametresEntreprise" DROP CONSTRAINT IF EXISTS "ParametresEntreprise_entrepriseId_fkey";
    ALTER TABLE "ParametresEntreprise" ADD CONSTRAINT "ParametresEntreprise_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN others THEN null;
END $$;
