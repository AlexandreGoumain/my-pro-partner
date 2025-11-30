import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/syndic/ag/[id] - Get single assemblée générale
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

        const capabilityCheck = await requireAnyCapability("assemblees_generales");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const ag = await prisma.assembleeGenerale.findFirst({
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
                        ville: true,
                    },
                },
                resolutions: {
                    orderBy: { numero: "asc" },
                },
            },
        });

        if (!ag) {
            return NextResponse.json(
                { error: "Assemblée générale non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json({ ag });
    } catch (error) {
        console.error("Error fetching AG:", error);
        return NextResponse.json(
            { error: "Failed to fetch AG" },
            { status: 500 }
        );
    }
}

// PATCH /api/syndic/ag/[id] - Update assemblée générale
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

        const capabilityCheck = await requireAnyCapability("assemblees_generales");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify AG exists and belongs to entreprise
        const existing = await prisma.assembleeGenerale.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Assemblée générale non trouvée" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: any = {};

        if (body.statut !== undefined) {
            updateData.statut = body.statut;
        }

        if (body.typeAG !== undefined) {
            updateData.typeAG = body.typeAG;
        }

        if (body.dateAG !== undefined) {
            updateData.dateAG = new Date(body.dateAG);
        }

        if (body.dateConvocation !== undefined) {
            updateData.dateConvocation = new Date(body.dateConvocation);
        }

        if (body.lieu !== undefined) {
            updateData.lieu = body.lieu;
        }

        if (body.heureDebut !== undefined) {
            updateData.heureDebut = body.heureDebut;
        }

        if (body.ordreJour !== undefined) {
            updateData.ordreJour = body.ordreJour;
        }

        if (body.quorum !== undefined) {
            updateData.quorum = body.quorum;
        }

        if (body.procesVerbalUrl !== undefined) {
            updateData.procesVerbalUrl = body.procesVerbalUrl;
        }

        if (body.notes !== undefined) {
            updateData.notes = body.notes;
        }

        const ag = await prisma.assembleeGenerale.update({
            where: { id },
            data: updateData,
            include: {
                copropriete: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
                resolutions: {
                    orderBy: { numero: "asc" },
                },
            },
        });

        return NextResponse.json({ ag });
    } catch (error) {
        console.error("Error updating AG:", error);
        return NextResponse.json(
            { error: "Failed to update AG" },
            { status: 500 }
        );
    }
}

// DELETE /api/syndic/ag/[id] - Delete assemblée générale
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

        const capabilityCheck = await requireAnyCapability("assemblees_generales");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify AG exists and belongs to entreprise
        const existing = await prisma.assembleeGenerale.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Assemblée générale non trouvée" },
                { status: 404 }
            );
        }

        // Prevent deletion of completed AGs
        if (existing.statut === "TERMINEE") {
            return NextResponse.json(
                { error: "Impossible de supprimer une assemblée générale terminée" },
                { status: 400 }
            );
        }

        // Delete resolutions first
        await prisma.resolutionAG.deleteMany({
            where: { assembleeId: id },
        });

        await prisma.assembleeGenerale.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting AG:", error);
        return NextResponse.json(
            { error: "Failed to delete AG" },
            { status: 500 }
        );
    }
}
