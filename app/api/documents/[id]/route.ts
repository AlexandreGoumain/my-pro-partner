import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { handlePrismaError } from "@/lib/errors/prisma";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const documentUpdateSchema = z.object({
    numero: z.string().min(1).optional(),
    type: z.enum(["DEVIS", "FACTURE", "AVOIR"]).optional(),
    clientId: z.string().optional(),
    dateEmission: z
        .string()
        .transform((s) => new Date(s))
        .optional(),
    dateEcheance: z
        .string()
        .transform((s) => new Date(s))
        .optional(),
    statut: z
        .enum(["BROUILLON", "ENVOYE", "ACCEPTE", "REFUSE", "PAYE", "ANNULE"])
        .optional(),
    notes: z.string().optional(),
    conditions_paiement: z.string().optional(),
    validite_jours: z.number().optional(),
});

const ligneSchema = z.object({
    ordre: z.number(),
    articleId: z.string().nullable().optional(),
    designation: z.string().min(1),
    description: z.string().nullable().optional(),
    quantite: z.number().positive(),
    prix_unitaire_ht: z.number(),
    tva_taux: z.number(),
    remise_pourcent: z.number().min(0).max(100),
    montant_ht: z.number(),
    montant_tva: z.number(),
    montant_ttc: z.number(),
});

const documentCompleteUpdateSchema = z.object({
    type: z.enum(["DEVIS", "FACTURE", "AVOIR"]),
    clientId: z.string(),
    serieId: z.string().optional().nullable(),
    dateEmission: z.string(),
    dateEcheance: z.string(),
    validite_jours: z.number(),
    statut: z.enum(["BROUILLON", "ENVOYE", "ACCEPTE", "REFUSE", "PAYE", "ANNULE"]),
    notes: z.string(),
    conditions_paiement: z.string(),
    total_ht: z.number(),
    total_tva: z.number(),
    total_ttc: z.number(),
    lignes: z.array(ligneSchema),
});

// GET: Récupérer un document par ID
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const document = await prisma.document.findUnique({
            where: { id },
            include: {
                client: true,
                entreprise: true,
                lignes: {
                    include: {
                        article: true,
                    },
                    orderBy: { ordre: "asc" },
                },
                paiements: {
                    orderBy: { date_paiement: "desc" },
                },
                devis: true,
                factures: true,
            },
        });

        if (!document) {
            return NextResponse.json(
                { message: "Document non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({ document });
    } catch (error) {
        console.error("Erreur lors de la récupération du document:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// PUT: Mettre à jour un document
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await req.json();

        const validation = documentUpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const document = await prisma.document.update({
            where: { id },
            data: validation.data,
            include: {
                client: true,
                lignes: {
                    include: {
                        article: true,
                    },
                },
                paiements: true,
            },
        });

        return NextResponse.json(document);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du document:", error);
        const { message, status } = handlePrismaError(error);
        return NextResponse.json({ message }, { status });
    }
}

// PATCH: Mettre à jour complètement un document avec ses lignes
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await req.json();

        const validation = documentCompleteUpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const data = validation.data;

        // Utiliser une transaction pour mettre à jour le document et ses lignes
        const document = await prisma.$transaction(async (tx) => {
            // Supprimer toutes les lignes existantes
            await tx.ligneDocument.deleteMany({
                where: { documentId: id },
            });

            // Mettre à jour le document
            const updatedDoc = await tx.document.update({
                where: { id },
                data: {
                    type: data.type,
                    clientId: data.clientId,
                    serieId: data.serieId || null,
                    dateEmission: new Date(data.dateEmission),
                    dateEcheance: data.dateEcheance ? new Date(data.dateEcheance) : null,
                    validite_jours: data.validite_jours,
                    statut: data.statut,
                    notes: data.notes || null,
                    conditions_paiement: data.conditions_paiement || null,
                    total_ht: data.total_ht,
                    total_tva: data.total_tva,
                    total_ttc: data.total_ttc,
                    lignes: {
                        create: data.lignes.map((ligne) => ({
                            ordre: ligne.ordre,
                            articleId: ligne.articleId || null,
                            designation: ligne.designation,
                            description: ligne.description || null,
                            quantite: ligne.quantite,
                            prix_unitaire_ht: ligne.prix_unitaire_ht,
                            tva_taux: ligne.tva_taux,
                            remise_pourcent: ligne.remise_pourcent,
                            montant_ht: ligne.montant_ht,
                            montant_tva: ligne.montant_tva,
                            montant_ttc: ligne.montant_ttc,
                        })),
                    },
                },
                include: {
                    client: true,
                    lignes: {
                        include: {
                            article: true,
                        },
                        orderBy: { ordre: "asc" },
                    },
                },
            });

            return updatedDoc;
        });

        return NextResponse.json({ document });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du document:", error);
        const { message, status } = handlePrismaError(error);
        return NextResponse.json({ message }, { status });
    }
}

// DELETE: Supprimer un document
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Vérifier si le document a des paiements ou factures
        const paiements = await prisma.paiement.count({
            where: { documentId: id },
        });

        const factures = await prisma.document.count({
            where: { devisId: id },
        });

        if (paiements > 0 || factures > 0) {
            return NextResponse.json(
                {
                    message:
                        "Impossible de supprimer un document avec paiements ou factures associées",
                },
                { status: 400 }
            );
        }

        await prisma.document.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Document supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression du document:", error);
        const { message, status } = handlePrismaError(error);
        return NextResponse.json({ message }, { status });
    }
}
