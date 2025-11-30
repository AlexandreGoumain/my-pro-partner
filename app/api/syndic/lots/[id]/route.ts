import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/syndic/lots/[id] - Get single lot
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

        const capabilityCheck = await requireAnyCapability("lots_copro");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const lot = await prisma.lotCopropriete.findFirst({
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
                        totalTantiemes: true,
                    },
                },
                coproprietaire: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        email: true,
                        adresse: true,
                        ville: true,
                    },
                },
                locataire: {
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

        if (!lot) {
            return NextResponse.json(
                { error: "Lot non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({ lot });
    } catch (error) {
        console.error("Error fetching lot:", error);
        return NextResponse.json(
            { error: "Failed to fetch lot" },
            { status: 500 }
        );
    }
}

// PATCH /api/syndic/lots/[id] - Update lot
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

        const capabilityCheck = await requireAnyCapability("lots_copro");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify lot exists and belongs to entreprise
        const existing = await prisma.lotCopropriete.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Lot non trouvé" },
                { status: 404 }
            );
        }

        // Check for duplicate numero if changing
        if (body.numero && body.numero !== existing.numero) {
            const duplicate = await prisma.lotCopropriete.findFirst({
                where: {
                    coproprieteId: existing.coproprieteId,
                    numero: body.numero,
                    id: { not: id },
                },
            });

            if (duplicate) {
                return NextResponse.json(
                    { error: "Un lot avec ce numéro existe déjà" },
                    { status: 400 }
                );
            }
        }

        // Build update data
        const updateData: any = {};

        if (body.numero !== undefined) {
            updateData.numero = body.numero;
        }

        if (body.typeLot !== undefined) {
            updateData.typeLot = body.typeLot;
        }

        if (body.etage !== undefined) {
            updateData.etage = body.etage;
        }

        if (body.batiment !== undefined) {
            updateData.batiment = body.batiment;
        }

        if (body.surface !== undefined) {
            updateData.surface = body.surface;
        }

        if (body.tantiemesGeneraux !== undefined) {
            updateData.tantiemesGeneraux = body.tantiemesGeneraux;
        }

        if (body.tantiemesParticuliers !== undefined) {
            updateData.tantiemesParticuliers = body.tantiemesParticuliers;
        }

        if (body.coproprietaireId !== undefined) {
            updateData.coproprietaireId = body.coproprietaireId || null;
        }

        if (body.locataireId !== undefined) {
            updateData.locataireId = body.locataireId || null;
        }

        if (body.estLoue !== undefined) {
            updateData.estLoue = body.estLoue;
        }

        if (body.notes !== undefined) {
            updateData.notes = body.notes;
        }

        const lot = await prisma.lotCopropriete.update({
            where: { id },
            data: updateData,
            include: {
                copropriete: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
                coproprietaire: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
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
        });

        return NextResponse.json({ lot });
    } catch (error) {
        console.error("Error updating lot:", error);
        return NextResponse.json(
            { error: "Failed to update lot" },
            { status: 500 }
        );
    }
}

// DELETE /api/syndic/lots/[id] - Delete lot
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

        const capabilityCheck = await requireAnyCapability("lots_copro");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify lot exists and belongs to entreprise
        const existing = await prisma.lotCopropriete.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Lot non trouvé" },
                { status: 404 }
            );
        }

        // Check if lot has charge lines
        const hasCharges = await prisma.ligneAppelCharges.count({
            where: { lotId: id },
        });

        if (hasCharges > 0) {
            return NextResponse.json(
                { error: "Impossible de supprimer un lot avec des appels de charges" },
                { status: 400 }
            );
        }

        const coproprieteId = existing.coproprieteId;

        await prisma.lotCopropriete.delete({
            where: { id },
        });

        // Update nbLots in copropriete
        await prisma.copropriete.update({
            where: { id: coproprieteId },
            data: {
                nbLots: {
                    decrement: 1,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting lot:", error);
        return NextResponse.json(
            { error: "Failed to delete lot" },
            { status: 500 }
        );
    }
}
