import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import type { MissionUpdateInput } from "@/lib/types/mission";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/missions/[id] - Get mission details
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const mission = await prisma.mission.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        telephone: true,
                        adresse: true,
                        ville: true,
                        codePostal: true,
                    },
                },
                entreesTemps: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: { date: "desc" },
                },
                devis: {
                    select: {
                        id: true,
                        numero: true,
                        total_ttc: true,
                        statut: true,
                    },
                },
                factures: {
                    select: {
                        id: true,
                        numero: true,
                        total_ttc: true,
                        statut: true,
                        dateEmission: true,
                    },
                },
                _count: {
                    select: {
                        entreesTemps: true,
                    },
                },
            },
        });

        if (!mission) {
            return NextResponse.json(
                { error: "Mission introuvable" },
                { status: 404 }
            );
        }

        // Convert Decimal fields
        const formattedMission = {
            ...mission,
            montantForfait: mission.montantForfait
                ? Number(mission.montantForfait)
                : null,
            tauxHoraire: mission.tauxHoraire
                ? Number(mission.tauxHoraire)
                : null,
            totalMontant: Number(mission.totalMontant),
            entreesTemps: mission.entreesTemps.map((e) => ({
                ...e,
                tauxHoraire: Number(e.tauxHoraire),
                montant: Number(e.montant),
            })),
            devis: mission.devis
                ? {
                      ...mission.devis,
                      total_ttc: Number(mission.devis.total_ttc),
                  }
                : null,
            factures: mission.factures.map((f) => ({
                ...f,
                total_ttc: Number(f.total_ttc),
            })),
        };

        return NextResponse.json({ mission: formattedMission });
    } catch (error) {
        console.error("Error fetching mission:", error);
        return NextResponse.json(
            { error: "Failed to fetch mission" },
            { status: 500 }
        );
    }
}

// PUT /api/missions/[id] - Update mission
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body: MissionUpdateInput = await request.json();

        // Check mission exists and belongs to enterprise
        const existing = await prisma.mission.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Mission introuvable" },
                { status: 404 }
            );
        }

        // If changing client, verify new client belongs to enterprise
        if (body.clientId && body.clientId !== existing.clientId) {
            const client = await prisma.client.findFirst({
                where: {
                    id: body.clientId,
                    entrepriseId: session.user.entrepriseId,
                },
            });

            if (!client) {
                return NextResponse.json(
                    { error: "Client introuvable" },
                    { status: 404 }
                );
            }
        }

        const mission = await prisma.mission.update({
            where: { id },
            data: {
                ...(body.nom && { nom: body.nom.trim() }),
                ...(body.description !== undefined && {
                    description: body.description?.trim() || null,
                }),
                ...(body.clientId && { clientId: body.clientId }),
                ...(body.typeFact && { typeFact: body.typeFact }),
                ...(body.montantForfait !== undefined && {
                    montantForfait: body.montantForfait,
                }),
                ...(body.tauxHoraire !== undefined && {
                    tauxHoraire: body.tauxHoraire,
                }),
                ...(body.budgetHeures !== undefined && {
                    budgetHeures: body.budgetHeures,
                }),
                ...(body.dateDebut !== undefined && {
                    dateDebut: body.dateDebut ? new Date(body.dateDebut) : null,
                }),
                ...(body.dateFin !== undefined && {
                    dateFin: body.dateFin ? new Date(body.dateFin) : null,
                }),
                ...(body.dateEcheance !== undefined && {
                    dateEcheance: body.dateEcheance
                        ? new Date(body.dateEcheance)
                        : null,
                }),
                ...(body.statut && { statut: body.statut }),
            },
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        telephone: true,
                    },
                },
            },
        });

        // Convert Decimal fields
        const formattedMission = {
            ...mission,
            montantForfait: mission.montantForfait
                ? Number(mission.montantForfait)
                : null,
            tauxHoraire: mission.tauxHoraire
                ? Number(mission.tauxHoraire)
                : null,
            totalMontant: Number(mission.totalMontant),
        };

        return NextResponse.json({ mission: formattedMission });
    } catch (error) {
        console.error("Error updating mission:", error);
        return NextResponse.json(
            { error: "Failed to update mission" },
            { status: 500 }
        );
    }
}

// DELETE /api/missions/[id] - Delete mission
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Check mission exists and belongs to enterprise
        const existing = await prisma.mission.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                _count: {
                    select: {
                        entreesTemps: true,
                        factures: true,
                    },
                },
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Mission introuvable" },
                { status: 404 }
            );
        }

        // Prevent deletion if mission has invoices
        if (existing._count.factures > 0) {
            return NextResponse.json(
                {
                    error: "Impossible de supprimer une mission avec des factures",
                },
                { status: 400 }
            );
        }

        // Delete mission (time entries will be cascade deleted due to onDelete: Cascade)
        await prisma.mission.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting mission:", error);
        return NextResponse.json(
            { error: "Failed to delete mission" },
            { status: 500 }
        );
    }
}
