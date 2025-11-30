import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/syndic/coproprietes/[id] - Get single copropriete
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

        const capabilityCheck = await requireAnyCapability("coproprietes");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const copropriete = await prisma.copropriete.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                lots: {
                    include: {
                        coproprietaire: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                                telephone: true,
                                email: true,
                            },
                        },
                        locataire: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                            },
                        },
                    },
                    orderBy: { numero: "asc" },
                },
                _count: {
                    select: {
                        lots: true,
                        appelsCharges: true,
                        assemblees: true,
                        travauxCopro: true,
                        conseilSyndical: true,
                    },
                },
            },
        });

        if (!copropriete) {
            return NextResponse.json(
                { error: "Copropriété non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json({ copropriete });
    } catch (error) {
        console.error("Error fetching copropriete:", error);
        return NextResponse.json(
            { error: "Failed to fetch copropriete" },
            { status: 500 }
        );
    }
}

// PATCH /api/syndic/coproprietes/[id] - Update copropriete
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

        const capabilityCheck = await requireAnyCapability("coproprietes");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify copropriete exists and belongs to entreprise
        const existing = await prisma.copropriete.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Copropriété non trouvée" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: any = {};

        if (body.nom !== undefined) {
            updateData.nom = body.nom;
        }

        if (body.adresse !== undefined) {
            updateData.adresse = body.adresse;
        }

        if (body.codePostal !== undefined) {
            updateData.codePostal = body.codePostal;
        }

        if (body.ville !== undefined) {
            updateData.ville = body.ville;
        }

        if (body.nbLots !== undefined) {
            updateData.nbLots = body.nbLots;
        }

        if (body.nbBatiments !== undefined) {
            updateData.nbBatiments = body.nbBatiments;
        }

        if (body.totalTantiemes !== undefined) {
            updateData.totalTantiemes = body.totalTantiemes;
        }

        if (body.datePriseSyndic !== undefined) {
            updateData.datePriseSyndic = new Date(body.datePriseSyndic);
        }

        if (body.dateCreation !== undefined) {
            updateData.dateCreation = body.dateCreation ? new Date(body.dateCreation) : null;
        }

        if (body.numeroImmatriculation !== undefined) {
            updateData.numeroImmatriculation = body.numeroImmatriculation;
        }

        if (body.reglementCopro !== undefined) {
            updateData.reglementCopro = body.reglementCopro;
        }

        if (body.notes !== undefined) {
            updateData.notes = body.notes;
        }

        const copropriete = await prisma.copropriete.update({
            where: { id },
            data: updateData,
            include: {
                _count: {
                    select: {
                        lots: true,
                        appelsCharges: true,
                        assemblees: true,
                        travauxCopro: true,
                    },
                },
            },
        });

        return NextResponse.json({ copropriete });
    } catch (error) {
        console.error("Error updating copropriete:", error);
        return NextResponse.json(
            { error: "Failed to update copropriete" },
            { status: 500 }
        );
    }
}

// DELETE /api/syndic/coproprietes/[id] - Delete copropriete
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

        const capabilityCheck = await requireAnyCapability("coproprietes");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify copropriete exists and belongs to entreprise
        const existing = await prisma.copropriete.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                _count: {
                    select: {
                        lots: true,
                        appelsCharges: true,
                        assemblees: true,
                        travauxCopro: true,
                    },
                },
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Copropriété non trouvée" },
                { status: 404 }
            );
        }

        // Prevent deletion if has lots
        if (existing._count.lots > 0) {
            return NextResponse.json(
                { error: "Impossible de supprimer une copropriété avec des lots. Supprimez d'abord les lots." },
                { status: 400 }
            );
        }

        await prisma.copropriete.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting copropriete:", error);
        return NextResponse.json(
            { error: "Failed to delete copropriete" },
            { status: 500 }
        );
    }
}
