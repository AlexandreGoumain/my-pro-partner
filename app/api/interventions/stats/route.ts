import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Allow both domicile (mobile work) and atelier (workshop) businesses
        const capabilityCheck = await requireAnyCapability("domicile", "atelier");
        if (capabilityCheck) return capabilityCheck;

        const entrepriseId = session.user.entrepriseId;

        // Total interventions
        const total = await prisma.intervention.count({
            where: { entrepriseId },
        });

        // En cours (multiple statuses)
        const enCours = await prisma.intervention.count({
            where: {
                entrepriseId,
                statut: {
                    in: ["PLANIFIEE", "EN_ROUTE", "SUR_PLACE", "EN_COURS"],
                },
            },
        });

        // Urgentes (URGENTE or CRITIQUE priority)
        const urgentes = await prisma.intervention.count({
            where: {
                entrepriseId,
                priorite: {
                    in: ["URGENTE", "CRITIQUE"],
                },
                statut: {
                    notIn: ["TERMINEE", "FACTUREE", "ANNULEE"],
                },
            },
        });

        // En retard (past datePrevisionnelle and not completed)
        const now = new Date();
        const enRetard = await prisma.intervention.count({
            where: {
                entrepriseId,
                datePrevisionnelle: {
                    lt: now,
                },
                statut: {
                    notIn: ["TERMINEE", "FACTUREE", "ANNULEE"],
                },
            },
        });

        return NextResponse.json({
            total,
            enCours,
            urgentes,
            enRetard,
        });
    } catch (error) {
        console.error("Error fetching intervention stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
