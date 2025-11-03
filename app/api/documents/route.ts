import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DocumentStatut } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { generateNumeroDocument, type DocumentType } from "@/lib/types/settings";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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
    serieId: z.string().optional().nullable(), // ID de la série de numérotation
    dateEmission: z.string().transform((s) => new Date(s)),
    dateEcheance: z
        .string()
        .transform((s) => new Date(s))
        .optional().nullable(),
    statut: z.enum(["BROUILLON", "ENVOYE", "ACCEPTE", "REFUSE", "PAYE", "ANNULE"]).default("BROUILLON"),
    notes: z.string().optional().nullable(),
    conditions_paiement: z.string().optional().nullable(),
    validite_jours: z.number().default(30),
    total_ht: z.number(),
    total_tva: z.number(),
    total_ttc: z.number(),
    lignes: z.array(lineItemSchema).min(1, "Au moins une ligne requise"),
});

// GET: Récupérer tous les documents
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const typeParam = searchParams.get("type");
        const clientId = searchParams.get("clientId");
        const statutParam = searchParams.get("statut");

        // Type-safe enum validation
        const type =
            typeParam && Object.values(DocumentType).includes(typeParam as DocumentType)
                ? (typeParam as DocumentType)
                : undefined;
        const statut =
            statutParam && Object.values(DocumentStatut).includes(statutParam as DocumentStatut)
                ? (statutParam as DocumentStatut)
                : undefined;

        const documents = await prisma.document.findMany({
            where: {
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
        console.error("Erreur lors de la récupération des documents:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// POST: Créer un nouveau document
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const validation = documentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        // Get client to verify existence and get entrepriseId
        const client = await prisma.client.findUnique({
            where: { id: validation.data.clientId },
            select: { id: true, entrepriseId: true },
        });

        if (!client) {
            return NextResponse.json(
                { message: "Client non trouvé" },
                { status: 404 }
            );
        }

        // Generate document number
        let numero: string;
        let serieId: string | null = validation.data.serieId || null;

        // Try to use a serie if serieId is provided or find default serie
        if (!serieId) {
            // Try to find default serie for this document type
            const typeField =
                validation.data.type === "DEVIS"
                    ? "pour_devis"
                    : validation.data.type === "FACTURE"
                    ? "pour_factures"
                    : "pour_avoirs";

            const defaultField =
                validation.data.type === "DEVIS"
                    ? "est_defaut_devis"
                    : validation.data.type === "FACTURE"
                    ? "est_defaut_factures"
                    : "est_defaut_avoirs";

            const defaultSerie = await prisma.serieDocument.findFirst({
                where: {
                    entrepriseId: client.entrepriseId,
                    active: true,
                    [defaultField]: true,
                    [typeField]: true,
                },
            });

            if (defaultSerie) {
                serieId = defaultSerie.id;
            }
        }

        if (serieId) {
            // Use serie to generate numero
            const serie = await prisma.serieDocument.findUnique({
                where: { id: serieId },
            });

            if (!serie) {
                return NextResponse.json(
                    { message: "Série de documents non trouvée" },
                    { status: 404 }
                );
            }

            // Verify serie is active and supports this document type
            if (!serie.active) {
                return NextResponse.json(
                    { message: "Cette série est désactivée" },
                    { status: 400 }
                );
            }

            const typeField =
                validation.data.type === "DEVIS"
                    ? "pour_devis"
                    : validation.data.type === "FACTURE"
                    ? "pour_factures"
                    : "pour_avoirs";

            if (!serie[typeField]) {
                return NextResponse.json(
                    { message: `Cette série ne supporte pas les ${validation.data.type.toLowerCase()}s` },
                    { status: 400 }
                );
            }

            // Check if counter needs to be reset
            let currentNumero = serie.prochain_numero;
            const now = new Date();
            const shouldReset =
                (serie.reset_compteur === "ANNUEL" &&
                    serie.derniere_reset &&
                    new Date(serie.derniere_reset).getFullYear() !== now.getFullYear()) ||
                (serie.reset_compteur === "MENSUEL" &&
                    serie.derniere_reset &&
                    (new Date(serie.derniere_reset).getFullYear() !== now.getFullYear() ||
                        new Date(serie.derniere_reset).getMonth() !== now.getMonth())) ||
                (serie.reset_compteur !== "AUCUN" && !serie.derniere_reset);

            if (shouldReset) {
                currentNumero = 1;
            }

            // Generate numero using serie format
            numero = generateNumeroDocument(
                serie.format_numero,
                currentNumero,
                serie.code,
                validation.data.type
            );

            // Update serie prochain_numero and derniere_reset if needed
            await prisma.serieDocument.update({
                where: { id: serie.id },
                data: {
                    prochain_numero: currentNumero + 1,
                    ...(shouldReset && { derniere_reset: now }),
                },
            });
        } else {
            // Fallback to old system (using parametres)
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

            if (validation.data.type === "DEVIS") {
                prefixe = parametres.prefixe_devis;
                prochainNumero = parametres.prochain_numero_devis;
                numero = `${prefixe}${prochainNumero.toString().padStart(5, "0")}`;

                await prisma.parametresEntreprise.update({
                    where: { entrepriseId: client.entrepriseId },
                    data: { prochain_numero_devis: prochainNumero + 1 },
                });
            } else if (validation.data.type === "FACTURE") {
                prefixe = parametres.prefixe_facture;
                prochainNumero = parametres.prochain_numero_facture;
                numero = `${prefixe}${prochainNumero.toString().padStart(5, "0")}`;

                await prisma.parametresEntreprise.update({
                    where: { entrepriseId: client.entrepriseId },
                    data: { prochain_numero_facture: prochainNumero + 1 },
                });
            } else {
                prefixe = "AVOIR";
                prochainNumero = 1;
                numero = `${prefixe}${prochainNumero.toString().padStart(5, "0")}`;
            }
        }

        // Extract lignes from validation data
        const { lignes, ...documentData } = validation.data;

        // Create document with lignes
        const document = await prisma.document.create({
            data: {
                numero,
                type: documentData.type,
                clientId: documentData.clientId,
                serieId: serieId,
                dateEmission: documentData.dateEmission,
                dateEcheance: documentData.dateEcheance || null,
                statut: documentData.statut,
                notes: documentData.notes || null,
                conditions_paiement: documentData.conditions_paiement || null,
                validite_jours: documentData.validite_jours,
                total_ht: documentData.total_ht,
                total_tva: documentData.total_tva,
                total_ttc: documentData.total_ttc,
                reste_a_payer: documentData.total_ttc,
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
        console.error("Erreur lors de la création du document:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
