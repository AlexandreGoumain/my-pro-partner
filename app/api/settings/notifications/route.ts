import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET: Récupérer les préférences de notifications
// Note: Pour l'instant, on retourne des valeurs par défaut
// Une future migration ajoutera une table ParametresNotifications
export async function GET(req: NextRequest) {
    try {
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

        // TODO: Récupérer depuis la base de données quand la table sera créée
        // Pour l'instant, retourner des valeurs par défaut
        const notifications = {
            entrepriseId: user.entrepriseId,
            email_nouveau_client: true,
            email_document_cree: false,
            email_document_paye: true,
            email_stock_bas: true,
            email_rapport_hebdomadaire: false,
            webhook_enabled: false,
            webhook_url: null,
            webhook_secret: null,
            webhook_events: [],
        };

        return NextResponse.json({ notifications });
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// PUT: Mettre à jour les préférences de notifications
// Note: Pour l'instant, on simule la sauvegarde
// Une future migration ajoutera une table ParametresNotifications
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const body = await req.json();

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

        // TODO: Sauvegarder dans la base de données quand la table sera créée
        // Pour l'instant, on retourne simplement les données reçues
        console.log("Préférences de notifications (non sauvegardées):", body);

        return NextResponse.json({
            notifications: {
                ...body,
                entrepriseId: user.entrepriseId,
            },
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour des notifications:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
