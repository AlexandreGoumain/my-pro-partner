import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/syndic/travaux/[id] - Get single travaux
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

        const capabilityCheck = await requireAnyCapability("travaux_copro");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const travaux = await prisma.travauxCopropriete.findFirst({
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
            },
        });

        if (!travaux) {
            return NextResponse.json(
                { error: "Travaux non trouvés" },
                { status: 404 }
            );
        }

        return NextResponse.json({ travaux });
    } catch (error) {
        console.error("Error fetching travaux:", error);
        return NextResponse.json(
            { error: "Failed to fetch travaux" },
            { status: 500 }
        );
    }
}

// PATCH /api/syndic/travaux/[id] - Update travaux
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

        const capabilityCheck = await requireAnyCapability("travaux_copro");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify travaux exists and belongs to entreprise
        const existing = await prisma.travauxCopropriete.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Travaux non trouvés" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: any = {};

        if (body.titre !== undefined) {
            updateData.titre = body.titre;
        }

        if (body.description !== undefined) {
            updateData.description = body.description;
        }

        if (body.categorie !== undefined) {
            updateData.categorie = body.categorie;
        }

        if (body.statut !== undefined) {
            updateData.statut = body.statut;

            // Set dates based on status
            if (body.statut === "EN_COURS" && !existing.dateDebutReelle) {
                updateData.dateDebutReelle = new Date();
            }
            if (body.statut === "TERMINE" && !existing.dateFinReelle) {
                updateData.dateFinReelle = new Date();
            }
        }

        if (body.budgetEstime !== undefined) {
            updateData.budgetEstime = body.budgetEstime;
        }

        if (body.budgetVote !== undefined) {
            updateData.budgetVote = body.budgetVote;
        }

        if (body.coutFinal !== undefined) {
            updateData.coutFinal = body.coutFinal;
        }

        if (body.dateDebutPrevue !== undefined) {
            updateData.dateDebutPrevue = body.dateDebutPrevue ? new Date(body.dateDebutPrevue) : null;
        }

        if (body.dateFinPrevue !== undefined) {
            updateData.dateFinPrevue = body.dateFinPrevue ? new Date(body.dateFinPrevue) : null;
        }

        if (body.dateDebutReelle !== undefined) {
            updateData.dateDebutReelle = body.dateDebutReelle ? new Date(body.dateDebutReelle) : null;
        }

        if (body.dateFinReelle !== undefined) {
            updateData.dateFinReelle = body.dateFinReelle ? new Date(body.dateFinReelle) : null;
        }

        if (body.notes !== undefined) {
            updateData.notes = body.notes;
        }

        const travaux = await prisma.travauxCopropriete.update({
            where: { id },
            data: updateData,
            include: {
                copropriete: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
            },
        });

        return NextResponse.json({ travaux });
    } catch (error) {
        console.error("Error updating travaux:", error);
        return NextResponse.json(
            { error: "Failed to update travaux" },
            { status: 500 }
        );
    }
}

// DELETE /api/syndic/travaux/[id] - Delete travaux
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

        const capabilityCheck = await requireAnyCapability("travaux_copro");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify travaux exists and belongs to entreprise
        const existing = await prisma.travauxCopropriete.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Travaux non trouvés" },
                { status: 404 }
            );
        }

        // Prevent deletion of completed travaux with costs
        if (existing.statut === "TERMINE" && existing.coutFinal) {
            return NextResponse.json(
                { error: "Impossible de supprimer des travaux terminés avec un coût final" },
                { status: 400 }
            );
        }

        await prisma.travauxCopropriete.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting travaux:", error);
        return NextResponse.json(
            { error: "Failed to delete travaux" },
            { status: 500 }
        );
    }
}
