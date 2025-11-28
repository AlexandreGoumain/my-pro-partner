import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import type { EntreeTempsUpdateInput } from "@/lib/types/mission";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/temps/[id] - Get time entry details
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("temps_passe");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const entree = await prisma.entreeTemps.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                mission: {
                    select: {
                        id: true,
                        numero: true,
                        nom: true,
                        client: {
                            select: {
                                id: true,
                                nom: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!entree) {
            return NextResponse.json(
                { error: "Entrée de temps introuvable" },
                { status: 404 }
            );
        }

        // Convert Decimal fields
        const formattedEntree = {
            ...entree,
            tauxHoraire: Number(entree.tauxHoraire),
            montant: Number(entree.montant),
        };

        return NextResponse.json({ entree: formattedEntree });
    } catch (error) {
        console.error("Error fetching time entry:", error);
        return NextResponse.json(
            { error: "Failed to fetch time entry" },
            { status: 500 }
        );
    }
}

// PUT /api/temps/[id] - Update time entry
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("temps_passe");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body: EntreeTempsUpdateInput = await request.json();

        // Check entry exists and belongs to enterprise
        const existing = await prisma.entreeTemps.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Entrée de temps introuvable" },
                { status: 404 }
            );
        }

        // Cannot modify if already invoiced
        if (existing.facturee) {
            return NextResponse.json(
                { error: "Impossible de modifier une entrée déjà facturée" },
                { status: 400 }
            );
        }

        // Calculate new montant if duree or tauxHoraire changed
        const duree = body.duree ?? existing.duree;
        const tauxHoraire = body.tauxHoraire ?? Number(existing.tauxHoraire);
        const montant = (duree / 60) * tauxHoraire;

        const entree = await prisma.entreeTemps.update({
            where: { id },
            data: {
                ...(body.date && { date: new Date(body.date) }),
                ...(body.duree !== undefined && { duree: body.duree }),
                ...(body.description !== undefined && {
                    description: body.description.trim(),
                }),
                ...(body.facturable !== undefined && {
                    facturable: body.facturable,
                }),
                ...(body.tauxHoraire !== undefined && {
                    tauxHoraire: body.tauxHoraire,
                }),
                montant,
            },
            include: {
                mission: {
                    select: {
                        id: true,
                        numero: true,
                        nom: true,
                        client: {
                            select: {
                                id: true,
                                nom: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Update mission totals
        await updateMissionTotals(entree.missionId);

        // Convert Decimal fields
        const formattedEntree = {
            ...entree,
            tauxHoraire: Number(entree.tauxHoraire),
            montant: Number(entree.montant),
        };

        return NextResponse.json({ entree: formattedEntree });
    } catch (error) {
        console.error("Error updating time entry:", error);
        return NextResponse.json(
            { error: "Failed to update time entry" },
            { status: 500 }
        );
    }
}

// DELETE /api/temps/[id] - Delete time entry
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("temps_passe");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Check entry exists and belongs to enterprise
        const existing = await prisma.entreeTemps.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Entrée de temps introuvable" },
                { status: 404 }
            );
        }

        // Cannot delete if already invoiced
        if (existing.facturee) {
            return NextResponse.json(
                { error: "Impossible de supprimer une entrée déjà facturée" },
                { status: 400 }
            );
        }

        const missionId = existing.missionId;

        await prisma.entreeTemps.delete({
            where: { id },
        });

        // Update mission totals
        await updateMissionTotals(missionId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting time entry:", error);
        return NextResponse.json(
            { error: "Failed to delete time entry" },
            { status: 500 }
        );
    }
}

// Helper to update mission totals after time entry changes
async function updateMissionTotals(missionId: string) {
    const result = await prisma.entreeTemps.aggregate({
        where: { missionId },
        _sum: {
            duree: true,
            montant: true,
        },
    });

    const facturableResult = await prisma.entreeTemps.aggregate({
        where: { missionId, facturable: true },
        _sum: {
            duree: true,
        },
    });

    await prisma.mission.update({
        where: { id: missionId },
        data: {
            totalHeures: result._sum.duree || 0,
            totalFacturable: facturableResult._sum.duree || 0,
            totalMontant: result._sum.montant || 0,
        },
    });
}
