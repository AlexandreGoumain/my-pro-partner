import { withApiHandler } from "@/lib/api/api-handler";
import { BusinessError, NotFoundError, ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const documentUpdateSchema = z.object({
    numero: z.string().min(1).optional(),
    type: z.enum(["DEVIS", "FACTURE", "AVOIR"]).optional(),
    clientId: z.string().optional(),
    dateEmission: z.coerce.date().optional(),
    dateEcheance: z.coerce.date().optional(),
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
    dateEmission: z.string(),
    dateEcheance: z.string(),
    validite_jours: z.number(),
    statut: z.enum([
        "BROUILLON",
        "ENVOYE",
        "ACCEPTE",
        "REFUSE",
        "PAYE",
        "ANNULE",
    ]),
    notes: z.string(),
    conditions_paiement: z.string(),
    total_ht: z.number(),
    total_tva: z.number(),
    total_ttc: z.number(),
    lignes: z.array(ligneSchema),
});

// GET: Récupérer un document par ID
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const document = await prisma.document.findFirst({
                where: { id, entrepriseId: ctx.entrepriseId },
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
                throw new NotFoundError("Document");
            }

            return NextResponse.json({ document });
        },
        {
            context: { resourceName: "Document", operation: "get" },
        }
    );
}

// PUT: Mettre à jour un document
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await req.json();

            const result = documentUpdateSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            // Verify document exists and belongs to entreprise
            const existing = await prisma.document.findFirst({
                where: { id, entrepriseId: ctx.entrepriseId },
            });

            if (!existing) {
                throw new NotFoundError("Document");
            }

            const document = await prisma.document.update({
                where: { id },
                data: result.data,
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
        },
        {
            context: { resourceName: "Document", operation: "update" },
        }
    );
}

// PATCH: Mettre à jour complètement un document avec ses lignes
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await req.json();

            const result = documentCompleteUpdateSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            // Verify document exists and belongs to entreprise
            const existing = await prisma.document.findFirst({
                where: { id, entrepriseId: ctx.entrepriseId },
            });

            if (!existing) {
                throw new NotFoundError("Document");
            }

            const data = result.data;

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
                        dateEmission: new Date(data.dateEmission),
                        dateEcheance: data.dateEcheance
                            ? new Date(data.dateEcheance)
                            : null,
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
        },
        {
            context: { resourceName: "Document", operation: "updateComplete" },
        }
    );
}

// DELETE: Supprimer un document
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            // Verify document exists and belongs to entreprise
            const existing = await prisma.document.findFirst({
                where: { id, entrepriseId: ctx.entrepriseId },
            });

            if (!existing) {
                throw new NotFoundError("Document");
            }

            // Vérifier si le document a des paiements ou factures
            const paiements = await prisma.paiement.count({
                where: { documentId: id },
            });

            const factures = await prisma.document.count({
                where: { devisId: id },
            });

            if (paiements > 0 || factures > 0) {
                throw new BusinessError(
                    "Impossible de supprimer un document avec paiements ou factures associées"
                );
            }

            await prisma.document.delete({
                where: { id },
            });

            return NextResponse.json({ message: "Document supprimé avec succès" });
        },
        {
            context: { resourceName: "Document", operation: "delete" },
        }
    );
}
