import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/syndic/comptabilite/[id] - Get single écriture
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

        const capabilityCheck = await requireAnyCapability("comptabilite_copro");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const ecriture = await prisma.ecritureComptableCopro.findFirst({
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
                lot: {
                    select: {
                        id: true,
                        numero: true,
                        coproprietaire: {
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

        if (!ecriture) {
            return NextResponse.json(
                { error: "Écriture non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json({ ecriture });
    } catch (error) {
        console.error("Error fetching ecriture:", error);
        return NextResponse.json(
            { error: "Failed to fetch ecriture" },
            { status: 500 }
        );
    }
}

// PATCH /api/syndic/comptabilite/[id] - Update écriture
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

        const capabilityCheck = await requireAnyCapability("comptabilite_copro");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify ecriture exists and belongs to entreprise
        const existing = await prisma.ecritureComptableCopro.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Écriture non trouvée" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: any = {};

        if (body.dateEcriture !== undefined) {
            updateData.dateEcriture = new Date(body.dateEcriture);
        }

        if (body.libelle !== undefined) {
            updateData.libelle = body.libelle;
        }

        if (body.montant !== undefined) {
            updateData.montant = body.montant;
        }

        if (body.typeEcriture !== undefined) {
            updateData.typeEcriture = body.typeEcriture;
        }

        if (body.compte !== undefined) {
            updateData.compte = body.compte;
        }

        if (body.categorieCharge !== undefined) {
            updateData.categorieCharge = body.categorieCharge;
        }

        if (body.lotId !== undefined) {
            updateData.lotId = body.lotId || null;
        }

        if (body.pieceJustificative !== undefined) {
            updateData.pieceJustificative = body.pieceJustificative;
        }

        if (body.notes !== undefined) {
            updateData.notes = body.notes;
        }

        const ecriture = await prisma.ecritureComptableCopro.update({
            where: { id },
            data: updateData,
            include: {
                copropriete: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
                lot: {
                    select: {
                        id: true,
                        numero: true,
                    },
                },
            },
        });

        return NextResponse.json({ ecriture });
    } catch (error) {
        console.error("Error updating ecriture:", error);
        return NextResponse.json(
            { error: "Failed to update ecriture" },
            { status: 500 }
        );
    }
}

// DELETE /api/syndic/comptabilite/[id] - Delete écriture
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

        const capabilityCheck = await requireAnyCapability("comptabilite_copro");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify ecriture exists and belongs to entreprise
        const existing = await prisma.ecritureComptableCopro.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Écriture non trouvée" },
                { status: 404 }
            );
        }

        await prisma.ecritureComptableCopro.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting ecriture:", error);
        return NextResponse.json(
            { error: "Failed to delete ecriture" },
            { status: 500 }
        );
    }
}
