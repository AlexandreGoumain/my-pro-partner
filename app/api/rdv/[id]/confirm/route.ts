import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
    params: Promise<{ id: string }>;
}

/**
 * POST /api/rdv/[id]/confirm
 * Confirm a rendez-vous
 */
export async function POST(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await context.params;

        // Check rdv exists and belongs to entreprise
        const existing = await prisma.rendezVous.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Rendez-vous non trouvé" },
                { status: 404 }
            );
        }

        // Check current status
        if (existing.statut === "ANNULE") {
            return NextResponse.json(
                { error: "Impossible de confirmer un rendez-vous annulé" },
                { status: 400 }
            );
        }

        if (existing.statut === "TERMINE") {
            return NextResponse.json(
                { error: "Ce rendez-vous est déjà terminé" },
                { status: 400 }
            );
        }

        // Update status
        const item = await prisma.rendezVous.update({
            where: { id },
            data: { statut: "CONFIRME" },
            include: {
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
            },
        });

        return NextResponse.json({
            ...item,
            prestation: item.prestation
                ? {
                      ...item.prestation,
                      prix: Number(item.prestation.prix),
                  }
                : null,
        });
    } catch (error) {
        console.error("Error confirming rendez-vous:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
