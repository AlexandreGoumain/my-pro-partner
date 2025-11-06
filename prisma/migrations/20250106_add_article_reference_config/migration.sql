-- AlterTable
ALTER TABLE "ParametresEntreprise" ADD COLUMN "prefixe_produit" TEXT NOT NULL DEFAULT 'PRD',
ADD COLUMN "prefixe_service" TEXT NOT NULL DEFAULT 'SRV',
ADD COLUMN "prochain_numero_produit" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "prochain_numero_service" INTEGER NOT NULL DEFAULT 1;
