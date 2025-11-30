import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/gestion-locative/incidents/[id] - Get single incident
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("travaux_locatifs");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const incident = await prisma.incidentLocatif.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                bail: {
                    select: {
                        id: true,
                        reference: true,
                        bien: {
                            select: {
                                id: true,
                                titre: true,
                                ville: true,
                                adresse: true,
                            },
                        },
                        locatairePrincipal: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                                telephone: true,
                                email: true,
                            },
                        },
                        proprietaire: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                            },
                        },
                    },
                },
            },
        });

        if (!incident) {
            return NextResponse.json(
                { error: "Incident non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({ incident });
    } catch (error) {
        console.error("Error fetching incident:", error);
        return NextResponse.json(
            { error: "Failed to fetch incident" },
            { status: 500 }
        );
    }
}

// PATCH /api/gestion-locative/incidents/[id] - Update incident
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("travaux_locatifs");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify incident exists and belongs to entreprise
        const existing = await prisma.incidentLocatif.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Incident non trouvé" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: any = {};

        if (body.statut) {
            updateData.statut = body.statut;

            // Set dates based on status
            if (body.statut === "TRAVAUX_PLANIFIES" && !existing.dateIntervention) {
                updateData.dateIntervention = new Date();
            }
        }

        if (body.description !== undefined) {
            updateData.description = body.description;
        }

        if (body.categorie !== undefined) {
            updateData.categorie = body.categorie;
        }

        if (body.urgence !== undefined) {
            updateData.urgence = body.urgence;
        }

        if (body.notes !== undefined) {
            updateData.notes = body.notes;
        }

        if (body.photos !== undefined) {
            updateData.photos = body.photos;
        }

        if (body.coutEstime !== undefined) {
            updateData.coutEstime = body.coutEstime;
        }

        if (body.coutReel !== undefined) {
            updateData.coutReel = body.coutReel;
        }

        if (body.prestataire !== undefined) {
            updateData.prestataire = body.prestataire;
        }

        if (body.aChargeDe !== undefined) {
            updateData.aChargeDe = body.aChargeDe;
        }

        if (body.dateIntervention !== undefined) {
            updateData.dateIntervention = body.dateIntervention ? new Date(body.dateIntervention) : null;
        }

        const incident = await prisma.incidentLocatif.update({
            where: { id },
            data: updateData,
            include: {
                bail: {
                    select: {
                        id: true,
                        reference: true,
                        bien: {
                            select: {
                                id: true,
                                titre: true,
                                ville: true,
                            },
                        },
                        locatairePrincipal: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ incident });
    } catch (error) {
        console.error("Error updating incident:", error);
        return NextResponse.json(
            { error: "Failed to update incident" },
            { status: 500 }
        );
    }
}

// DELETE /api/gestion-locative/incidents/[id] - Delete incident
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("travaux_locatifs");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify incident exists and belongs to entreprise
        const existing = await prisma.incidentLocatif.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Incident non trouvé" },
                { status: 404 }
            );
        }

        // Prevent deletion of resolved incidents with costs
        if (existing.statut === "RESOLU" && existing.coutReel) {
            return NextResponse.json(
                { error: "Impossible de supprimer un incident résolu avec des frais" },
                { status: 400 }
            );
        }

        await prisma.incidentLocatif.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting incident:", error);
        return NextResponse.json(
            { error: "Failed to delete incident" },
            { status: 500 }
        );
    }
}
