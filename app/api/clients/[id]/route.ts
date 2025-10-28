import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const clientUpdateSchema = z.object({
    nom: z.string().min(1).optional(),
    prenom: z.string().optional(),
    email: z.string().email().optional(),
    telephone: z.string().optional(),
    adresse: z.string().optional(),
    codePostal: z.string().optional(),
    ville: z.string().optional(),
    pays: z.string().optional(),
    notes: z.string().optional(),
});

// GET: Récupérer un client par ID
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

        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                documents: {
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
            },
        });

        if (!client) {
            return NextResponse.json(
                { message: "Client non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json(client);
    } catch (error) {
        console.error("Erreur lors de la récupération du client:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// PUT: Mettre à jour un client
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

        const validation = clientUpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const client = await prisma.client.update({
            where: { id },
            data: validation.data,
        });

        return NextResponse.json(client);
    } catch (error) {
        if ((error as any).code === "P2025") {
            return NextResponse.json(
                { message: "Client non trouvé" },
                { status: 404 }
            );
        }

        console.error("Erreur lors de la mise à jour du client:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// DELETE: Supprimer un client
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

        // Vérifier si le client a des documents
        const hasDocuments = await prisma.document.count({
            where: { clientId: id },
        });

        if (hasDocuments > 0) {
            return NextResponse.json(
                {
                    message:
                        "Impossible de supprimer un client avec des documents",
                },
                { status: 400 }
            );
        }

        await prisma.client.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Client supprimé avec succès" });
    } catch (error) {
        if ((error as any).code === "P2025") {
            return NextResponse.json(
                { message: "Client non trouvé" },
                { status: 404 }
            );
        }

        console.error("Erreur lors de la suppression du client:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
