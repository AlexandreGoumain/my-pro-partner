import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/admin/entreprise
 * Get current entreprise information
 */
export async function GET(_req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const entreprise = await prisma.entreprise.findUnique({
                where: {
                    id: ctx.entrepriseId,
                },
                select: {
                    id: true,
                    nom: true,
                    slug: true,
                    siret: true,
                    email: true,
                    plan: true,
                    abonnementActif: true,
                    dateAbonnement: true,
                    dateExpiration: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            if (!entreprise) {
                throw new NotFoundError("Entreprise");
            }

            return NextResponse.json({
                entreprise,
            });
        },
        {
            context: { resourceName: "Entreprise", operation: "get" },
        }
    );
}
