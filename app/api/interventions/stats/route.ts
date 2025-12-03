import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/interventions/stats
 * Get intervention statistics
 */
export async function GET(_request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const entrepriseId = ctx.entrepriseId;

            const [total, enCours, urgentes, enRetard] = await Promise.all([
                // Total interventions
                prisma.intervention.count({
                    where: { entrepriseId },
                }),
                // En cours (multiple statuses)
                prisma.intervention.count({
                    where: {
                        entrepriseId,
                        statut: {
                            in: ["PLANIFIEE", "EN_ROUTE", "SUR_PLACE", "EN_COURS"],
                        },
                    },
                }),
                // Urgentes (URGENTE or CRITIQUE priority)
                prisma.intervention.count({
                    where: {
                        entrepriseId,
                        priorite: {
                            in: ["URGENTE", "CRITIQUE"],
                        },
                        statut: {
                            notIn: ["TERMINEE", "FACTUREE", "ANNULEE"],
                        },
                    },
                }),
                // En retard (past datePrevisionnelle and not completed)
                prisma.intervention.count({
                    where: {
                        entrepriseId,
                        datePrevisionnelle: {
                            lt: new Date(),
                        },
                        statut: {
                            notIn: ["TERMINEE", "FACTUREE", "ANNULEE"],
                        },
                    },
                }),
            ]);

            return NextResponse.json({
                total,
                enCours,
                urgentes,
                enRetard,
            });
        },
        {
            anyCapability: ["domicile", "atelier"],
            context: { resourceName: "Intervention", operation: "stats" },
        }
    );
}
