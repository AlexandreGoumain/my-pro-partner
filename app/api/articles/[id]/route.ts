import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const articleUpdateSchema = z.object({
    reference: z.string().min(1).optional(),
    nom: z.string().min(1).optional(),
    description: z.string().optional(),
    prix_ht: z.number().positive().optional(),
    tva_taux: z.number().optional(),
    unite: z.string().optional(),
    categorieId: z.string().optional(),
    stock_actuel: z.number().int().optional(),
    stock_min: z.number().int().optional(),
    gestion_stock: z.boolean().optional(),
    actif: z.boolean().optional(),
});

// GET: Récupérer un article par ID
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

        const article = await prisma.article.findUnique({
            where: { id },
            include: {
                categorie: true,
            },
        });

        if (!article) {
            return NextResponse.json(
                { message: "Article non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json(article);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'article:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// PUT: Mettre à jour un article
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

        const validation = articleUpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const article = await prisma.article.update({
            where: { id },
            data: validation.data,
            include: {
                categorie: true,
            },
        });

        return NextResponse.json(article);
    } catch (error) {
        if ((error as any).code === "P2025") {
            return NextResponse.json(
                { message: "Article non trouvé" },
                { status: 404 }
            );
        }

        console.error("Erreur lors de la mise à jour de l'article:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// DELETE: Supprimer un article
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

        await prisma.article.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Article supprimé avec succès" });
    } catch (error) {
        if ((error as any).code === "P2025") {
            return NextResponse.json(
                { message: "Article non trouvé" },
                { status: 404 }
            );
        }

        console.error("Erreur lors de la suppression de l'article:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
