import { DocumentStatut } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import type { DocumentType } from "@/lib/types/settings";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest } from "@/lib/utils/validation-helper";

const lineItemSchema = z.object({
    ordre: z.number(),
    articleId: z.string().optional().nullable(),
    designation: z.string().min(1),
    description: z.string().optional().nullable(),
    quantite: z.number(),
    prix_unitaire_ht: z.number(),
    tva_taux: z.number(),
    remise_pourcent: z.number().default(0),
    montant_ht: z.number(),
    montant_tva: z.number(),
    montant_ttc: z.number(),
});

const documentSchema = z.object({
    type: z.enum(["DEVIS", "FACTURE", "AVOIR"]),
    clientId: z.string().min(1, "Client requis"),
    dateEmission: z.coerce.date(),
    dateEcheance: z.coerce.date().optional().nullable(),
    statut: z.enum(["BROUILLON", "ENVOYE", "ACCEPTE", "REFUSE", "PAYE", "ANNULE"]).default("BROUILLON"),
    notes: z.string().optional().nullable(),
    conditions_paiement: z.string().optional().nullable(),
    validite_jours: z.number().default(30),
    total_ht: z.number(),
    total_tva: z.number(),
    total_ttc: z.number(),
    acompte_montant: z.number().default(0), // Down payment amount
    lignes: z.array(lineItemSchema).min(1, "Au moins une ligne requise"),
});

// GET: Récupérer tous les documents
export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const { searchParams } = new URL(req.url);
        const typeParam = searchParams.get("type");
        const clientId = searchParams.get("clientId");
        const statutParam = searchParams.get("statut");

        // Type-safe enum validation - DocumentType is a type, not a runtime enum
        const validTypes: DocumentType[] = ["DEVIS", "FACTURE", "AVOIR"];
        const type =
            typeParam && validTypes.includes(typeParam as DocumentType)
                ? (typeParam as DocumentType)
                : undefined;
        const statut =
            statutParam && Object.values(DocumentStatut).includes(statutParam as DocumentStatut)
                ? (statutParam as DocumentStatut)
                : undefined;

        const documents = await prisma.document.findMany({
            where: {
                entrepriseId,
                ...(type && { type }),
                ...(clientId && { clientId }),
                ...(statut && { statut }),
            },
            include: {
                client: true,
                lignes: {
                    include: {
                        article: true,
                    },
                },
                paiements: true,
            },
            orderBy: { dateEmission: "desc" },
        });

        return NextResponse.json({ documents });
    } catch (error) {
        return handleTenantError(error);
    }
}

// POST: Créer un nouveau document
export async function POST(req: NextRequest) {
    try {
        await requireTenantAuth();

        const body = await req.json();
        const result = validateRequest(documentSchema, body);
        if (!result.success) return result.response;

        // Get client to verify existence and get entrepriseId
        const client = await prisma.client.findUnique({
            where: { id: result.data.clientId },
            select: { id: true, entrepriseId: true },
        });

        if (!client) {
            return NextResponse.json(
                { message: "Client non trouvé" },
                { status: 404 }
            );
        }

        // Generate document number using parametres
        let parametres = await prisma.parametresEntreprise.findUnique({
            where: { entrepriseId: client.entrepriseId },
        });

        if (!parametres) {
            parametres = await prisma.parametresEntreprise.create({
                data: {
                    entrepriseId: client.entrepriseId,
                    nom_entreprise: "Mon Entreprise",
                },
            });
        }

        let prefixe: string;
        let prochainNumero: number;
        let numero: string;

        if (result.data.type === "DEVIS") {
            prefixe = parametres.prefixe_devis;
            prochainNumero = parametres.prochain_numero_devis;
            numero = `${prefixe}${prochainNumero.toString().padStart(5, "0")}`;

            await prisma.parametresEntreprise.update({
                where: { entrepriseId: client.entrepriseId },
                data: { prochain_numero_devis: prochainNumero + 1 },
            });
        } else if (result.data.type === "FACTURE") {
            prefixe = parametres.prefixe_facture;
            prochainNumero = parametres.prochain_numero_facture;
            numero = `${prefixe}${prochainNumero.toString().padStart(5, "0")}`;

            await prisma.parametresEntreprise.update({
                where: { entrepriseId: client.entrepriseId },
                data: { prochain_numero_facture: prochainNumero + 1 },
            });
        } else {
            // Avoir: utilise préfixe "AV" par défaut et compteur basé sur factures
            prefixe = "AV";
            // Count existing avoirs to generate next number
            const avoirCount = await prisma.document.count({
                where: {
                    entrepriseId: client.entrepriseId,
                    type: "AVOIR",
                },
            });
            prochainNumero = avoirCount + 1;
            numero = `${prefixe}${prochainNumero.toString().padStart(5, "0")}`;
        }

        // Extract lignes from validation data
        const { lignes, ...documentData } = result.data;

        // Calculate reste_a_payer taking down payment into account
        const acompteMontant = documentData.acompte_montant || 0;
        const resteAPayer = documentData.total_ttc - acompteMontant;

        // Create document with lignes
        const document = await prisma.document.create({
            data: {
                numero,
                type: documentData.type,
                clientId: documentData.clientId,
                dateEmission: documentData.dateEmission,
                dateEcheance: documentData.dateEcheance || null,
                statut: documentData.statut,
                notes: documentData.notes || null,
                conditions_paiement: documentData.conditions_paiement || null,
                validite_jours: documentData.validite_jours,
                total_ht: documentData.total_ht,
                total_tva: documentData.total_tva,
                total_ttc: documentData.total_ttc,
                acompte_montant: acompteMontant,
                reste_a_payer: resteAPayer,
                entrepriseId: client.entrepriseId,
                lignes: {
                    create: lignes,
                },
            },
            include: {
                client: true,
                lignes: true,
            },
        });

        return NextResponse.json({ document }, { status: 201 });
    } catch (error) {
        return handleTenantError(error);
    }
}
