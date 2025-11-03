import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSerieSchema = z.object({
    code: z.string().min(1).max(10).optional(),
    nom: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    couleur: z.string().optional().nullable(),
    pour_devis: z.boolean().optional(),
    pour_factures: z.boolean().optional(),
    pour_avoirs: z.boolean().optional(),
    format_numero: z.string().optional(),
    reset_compteur: z.enum(["AUCUN", "ANNUEL", "MENSUEL"]).optional(),
    est_defaut_devis: z.boolean().optional(),
    est_defaut_factures: z.boolean().optional(),
    est_defaut_avoirs: z.boolean().optional(),
    active: z.boolean().optional(),
});

// GET: Récupérer une série spécifique
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { entrepriseId: true },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Utilisateur non trouvé" },
                { status: 404 }
            );
        }

        const serie = await prisma.serieDocument.findUnique({
            where: {
                id: id,
                entrepriseId: user.entrepriseId,
            },
            include: {
                _count: {
                    select: { documents: true },
                },
            },
        });

        if (!serie) {
            return NextResponse.json(
                { message: "Série non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json({ serie });
    } catch (error) {
        console.error("Erreur lors de la récupération de la série:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// PUT: Mettre à jour une série
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const validation = updateSerieSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { entrepriseId: true },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Utilisateur non trouvé" },
                { status: 404 }
            );
        }

        // Vérifier que la série existe et appartient à l'entreprise
        const existingSerie = await prisma.serieDocument.findUnique({
            where: {
                id: id,
                entrepriseId: user.entrepriseId,
            },
        });

        if (!existingSerie) {
            return NextResponse.json(
                { message: "Série non trouvée" },
                { status: 404 }
            );
        }

        // Si modification du code, vérifier qu'il n'existe pas déjà
        if (validation.data.code && validation.data.code !== existingSerie.code) {
            const codeExists = await prisma.serieDocument.findUnique({
                where: {
                    entrepriseId_code: {
                        entrepriseId: user.entrepriseId,
                        code: validation.data.code.toUpperCase(),
                    },
                },
            });

            if (codeExists) {
                return NextResponse.json(
                    { message: "Une série avec ce code existe déjà" },
                    { status: 400 }
                );
            }
        }

        // Gérer les séries par défaut par type
        if (validation.data.est_defaut_devis && !existingSerie.est_defaut_devis) {
            await prisma.serieDocument.updateMany({
                where: {
                    entrepriseId: user.entrepriseId,
                    est_defaut_devis: true,
                    id: { not: id },
                },
                data: {
                    est_defaut_devis: false,
                },
            });
        }

        if (validation.data.est_defaut_factures && !existingSerie.est_defaut_factures) {
            await prisma.serieDocument.updateMany({
                where: {
                    entrepriseId: user.entrepriseId,
                    est_defaut_factures: true,
                    id: { not: id },
                },
                data: {
                    est_defaut_factures: false,
                },
            });
        }

        if (validation.data.est_defaut_avoirs && !existingSerie.est_defaut_avoirs) {
            await prisma.serieDocument.updateMany({
                where: {
                    entrepriseId: user.entrepriseId,
                    est_defaut_avoirs: true,
                    id: { not: id },
                },
                data: {
                    est_defaut_avoirs: false,
                },
            });
        }

        // Update serie
        const serie = await prisma.serieDocument.update({
            where: { id: id },
            data: {
                ...validation.data,
                ...(validation.data.code && { code: validation.data.code.toUpperCase() }),
            },
            include: {
                _count: {
                    select: { documents: true },
                },
            },
        });

        return NextResponse.json({ serie });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la série:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// DELETE: Supprimer une série
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { entrepriseId: true },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Utilisateur non trouvé" },
                { status: 404 }
            );
        }

        // Vérifier que la série existe et appartient à l'entreprise
        const serie = await prisma.serieDocument.findUnique({
            where: {
                id: id,
                entrepriseId: user.entrepriseId,
            },
            include: {
                _count: {
                    select: { documents: true },
                },
            },
        });

        if (!serie) {
            return NextResponse.json(
                { message: "Série non trouvée" },
                { status: 404 }
            );
        }

        // Vérifier qu'aucun document n'utilise cette série
        if (serie._count.documents > 0) {
            return NextResponse.json(
                {
                    message: `Impossible de supprimer cette série car ${serie._count.documents} document(s) l'utilisent. Désactivez-la plutôt.`,
                },
                { status: 400 }
            );
        }

        // Delete serie
        await prisma.serieDocument.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: "Série supprimée avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de la série:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
