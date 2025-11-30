import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/syndic/conseil-syndical/[id] - Get single membre
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

        const capabilityCheck = await requireAnyCapability("conseil_syndical");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const membre = await prisma.membreConseilSyndical.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                copropriete: {
                    select: {
                        id: true,
                        nom: true,
                        adresse: true,
                    },
                },
                membre: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        email: true,
                    },
                },
            },
        });

        if (!membre) {
            return NextResponse.json(
                { error: "Membre non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({ membre });
    } catch (error) {
        console.error("Error fetching membre conseil:", error);
        return NextResponse.json(
            { error: "Failed to fetch membre" },
            { status: 500 }
        );
    }
}

// PATCH /api/syndic/conseil-syndical/[id] - Update membre
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

        const capabilityCheck = await requireAnyCapability("conseil_syndical");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify membre exists and belongs to entreprise
        const existing = await prisma.membreConseilSyndical.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Membre non trouvé" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: any = {};

        if (body.role !== undefined) {
            updateData.role = body.role;
        }

        if (body.dateDebut !== undefined) {
            updateData.dateDebut = new Date(body.dateDebut);
        }

        if (body.dateFin !== undefined) {
            updateData.dateFin = body.dateFin ? new Date(body.dateFin) : null;
        }

        if (body.actif !== undefined) {
            updateData.actif = body.actif;

            // Auto-set dateFin when deactivating
            if (!body.actif && !existing.dateFin) {
                updateData.dateFin = new Date();
            }
        }

        const membre = await prisma.membreConseilSyndical.update({
            where: { id },
            data: updateData,
            include: {
                copropriete: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
                membre: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json({ membre });
    } catch (error) {
        console.error("Error updating membre conseil:", error);
        return NextResponse.json(
            { error: "Failed to update membre" },
            { status: 500 }
        );
    }
}

// DELETE /api/syndic/conseil-syndical/[id] - Delete membre
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

        const capabilityCheck = await requireAnyCapability("conseil_syndical");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify membre exists and belongs to entreprise
        const existing = await prisma.membreConseilSyndical.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Membre non trouvé" },
                { status: 404 }
            );
        }

        await prisma.membreConseilSyndical.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting membre conseil:", error);
        return NextResponse.json(
            { error: "Failed to delete membre" },
            { status: 500 }
        );
    }
}
