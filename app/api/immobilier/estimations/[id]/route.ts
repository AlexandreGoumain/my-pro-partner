import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/immobilier/estimations/[id] - Get single estimation
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

        const capabilityCheck = await requireAnyCapability("estimation_immo");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const estimation = await prisma.estimationBien.findFirst({
            where: {
                id,
                bien: {
                    entrepriseId: session.user.entrepriseId,
                },
            },
            include: {
                bien: {
                    select: {
                        id: true,
                        reference: true,
                        titre: true,
                        typeBien: true,
                        ville: true,
                        adresse: true,
                        surface: true,
                        nbPieces: true,
                        photos: true,
                    },
                },
                agent: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                    },
                },
            },
        });

        if (!estimation) {
            return NextResponse.json(
                { error: "Estimation non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json({ estimation });
    } catch (error) {
        console.error("Error fetching estimation:", error);
        return NextResponse.json(
            { error: "Failed to fetch estimation" },
            { status: 500 }
        );
    }
}

// PATCH /api/immobilier/estimations/[id] - Update estimation
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

        const capabilityCheck = await requireAnyCapability("estimation_immo");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify estimation exists and belongs to entreprise
        const existing = await prisma.estimationBien.findFirst({
            where: {
                id,
                bien: {
                    entrepriseId: session.user.entrepriseId,
                },
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Estimation non trouvée" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: any = {};

        if (body.prixEstimeBas !== undefined) {
            updateData.prixEstimeBas = body.prixEstimeBas;
        }

        if (body.prixEstimeHaut !== undefined) {
            updateData.prixEstimeHaut = body.prixEstimeHaut;
        }

        if (body.prixRecommande !== undefined) {
            updateData.prixRecommande = body.prixRecommande;
        }

        if (body.methode !== undefined) {
            updateData.methode = body.methode;
        }

        if (body.comparables !== undefined) {
            updateData.comparables = body.comparables;
        }

        if (body.validiteJours !== undefined) {
            updateData.validiteJours = body.validiteJours;
        }

        if (body.notes !== undefined) {
            updateData.notes = body.notes;
        }

        const estimation = await prisma.estimationBien.update({
            where: { id },
            data: updateData,
            include: {
                bien: {
                    select: {
                        id: true,
                        reference: true,
                        titre: true,
                        typeBien: true,
                        ville: true,
                    },
                },
                agent: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                    },
                },
            },
        });

        return NextResponse.json({ estimation });
    } catch (error) {
        console.error("Error updating estimation:", error);
        return NextResponse.json(
            { error: "Failed to update estimation" },
            { status: 500 }
        );
    }
}

// DELETE /api/immobilier/estimations/[id] - Delete estimation
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

        const capabilityCheck = await requireAnyCapability("estimation_immo");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify estimation exists and belongs to entreprise
        const existing = await prisma.estimationBien.findFirst({
            where: {
                id,
                bien: {
                    entrepriseId: session.user.entrepriseId,
                },
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Estimation non trouvée" },
                { status: 404 }
            );
        }

        await prisma.estimationBien.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting estimation:", error);
        return NextResponse.json(
            { error: "Failed to delete estimation" },
            { status: 500 }
        );
    }
}
