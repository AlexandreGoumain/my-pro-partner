import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const { searchParams } = new URL(req.url);
            const type = searchParams.get("type") as "PRODUIT" | "SERVICE" | null;

            if (!type || (type !== "PRODUIT" && type !== "SERVICE")) {
                throw new ValidationError("Type invalide. Utilisez PRODUIT ou SERVICE.");
            }

            // Récupérer les paramètres de l'entreprise
            const parametres = await prisma.parametresEntreprise.findUnique({
                where: { entrepriseId: ctx.entrepriseId },
                select: {
                    prefixe_produit: true,
                    prefixe_service: true,
                    prochain_numero_produit: true,
                    prochain_numero_service: true,
                },
            });

            if (!parametres) {
                throw new NotFoundError("Paramètres introuvables");
            }

            // Générer la référence selon le type
            const prefix = type === "PRODUIT"
                ? parametres.prefixe_produit
                : parametres.prefixe_service;

            const numero = type === "PRODUIT"
                ? parametres.prochain_numero_produit
                : parametres.prochain_numero_service;

            const reference = `${prefix}-${String(numero).padStart(3, "0")}`;

            return NextResponse.json({ reference, type });
        },
        {
            context: { resourceName: "Articles", operation: "nextReference" },
        }
    );
}
