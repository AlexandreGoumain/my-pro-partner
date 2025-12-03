import { withApiHandler } from "@/lib/api/api-handler";
import { NextRequest, NextResponse } from "next/server";

// GET: Récupérer les préférences de notifications
// Note: Pour l'instant, on retourne des valeurs par défaut
// Une future migration ajoutera une table ParametresNotifications
export async function GET(_req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            // TODO: Récupérer depuis la base de données quand la table sera créée
            // Pour l'instant, retourner des valeurs par défaut
            const notifications = {
                entrepriseId: ctx.entrepriseId,
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
        },
        {
            context: { resourceName: "Settings", operation: "getNotifications" },
        }
    );
}

// PUT: Mettre à jour les préférences de notifications
// Note: Pour l'instant, on simule la sauvegarde
// Une future migration ajoutera une table ParametresNotifications
export async function PUT(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await req.json();

            // TODO: Sauvegarder dans la base de données quand la table sera créée

            return NextResponse.json({
                notifications: {
                    ...body,
                    entrepriseId: ctx.entrepriseId,
                },
            });
        },
        {
            context: { resourceName: "Settings", operation: "updateNotifications" },
        }
    );
}
