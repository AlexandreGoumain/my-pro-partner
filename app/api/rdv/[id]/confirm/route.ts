import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
    params: Promise<{ id: string }>;
}

// Includes communs pour les rendez-vous
const rdvInclude = {
    client: {
        select: {
            id: true,
            nom: true,
            prenom: true,
            telephone: true,
            email: true,
        },
    },
    prestation: {
        select: {
            id: true,
            nom: true,
            duree: true,
            prix: true,
        },
    },
    employe: {
        select: {
            id: true,
            nom: true,
            prenom: true,
            couleur: true,
        },
    },
} as const;

// Helper pour formater le rendez-vous
function formatRdv(item: Record<string, unknown>) {
    const prestation = item.prestation as Record<string, unknown> | null;
    return {
        ...item,
        prestation: prestation
            ? { ...prestation, prix: Number(prestation.prix) }
            : null,
    };
}

/**
 * POST /api/rdv/[id]/confirm
 * Confirm a rendez-vous
 */
export async function POST(_request: NextRequest, context: RouteContext) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await context.params;

            // Check rdv exists and belongs to entreprise
            const existing = await prisma.rendezVous.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Rendez-vous non trouvé");
            }

            // Check current status
            if (existing.statut === "ANNULE") {
                throw new BusinessError("Impossible de confirmer un rendez-vous annulé");
            }

            if (existing.statut === "TERMINE") {
                throw new BusinessError("Ce rendez-vous est déjà terminé");
            }

            // Update status
            const item = await prisma.rendezVous.update({
                where: { id },
                data: { statut: "CONFIRME" },
                include: rdvInclude,
            });

            return NextResponse.json(formatRdv(item));
        },
        {
            capability: "agenda",
            context: { resourceName: "RendezVous", operation: "confirm" },
        }
    );
}
