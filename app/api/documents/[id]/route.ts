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

        return NextResponse.json(document);
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
