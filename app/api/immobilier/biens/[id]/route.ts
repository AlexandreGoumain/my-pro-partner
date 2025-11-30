import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/immobilier/biens/[id] - Get single bien
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

        const capabilityCheck = await requireAnyCapability("biens_immo");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const bien = await prisma.bienImmobilier.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                proprietaire: {
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
                mandats: {
                    orderBy: { createdAt: "desc" },
                    take: 5,
                },
                visites: {
                    orderBy: { dateVisite: "desc" },
                    take: 10,
                    include: {
                        visiteur: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                            },
                        },
                    },
                },
                diffusions: {
                    orderBy: { createdAt: "desc" },
                },
                estimations: {
                    orderBy: { dateEstimation: "desc" },
                    take: 5,
                },
                _count: {
                    select: {
                        visites: true,
                        diffusions: true,
                        mandats: true,
                    },
                },
            },
        });

        if (!bien) {
            return NextResponse.json(
                { error: "Bien non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({ bien });
    } catch (error) {
        console.error("Error fetching bien:", error);
        return NextResponse.json(
            { error: "Failed to fetch bien" },
            { status: 500 }
        );
    }
}

// PATCH /api/immobilier/biens/[id] - Update bien
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

        const capabilityCheck = await requireAnyCapability("biens_immo");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify bien exists and belongs to entreprise
        const existing = await prisma.bienImmobilier.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Bien non trouvé" },
                { status: 404 }
            );
        }

        // Build update data - only include fields that are provided
        const updateData: any = {};

        const fields = [
            "titre", "description", "typeBien", "statut",
            "enVente", "enLocation", "prixVente", "prixLocation", "chargesLoc",
            "adresse", "codePostal", "ville", "pays", "latitude", "longitude",
            "etage", "ascenseur", "surface", "nbPieces", "nbChambres",
            "nbSallesBains", "nbWc", "balcon", "terrasse", "jardin",
            "surfaceJardin", "parking", "garage", "cave", "piscine",
            "anneeConstruction", "etatGeneral", "dpeConsommation", "dpeEmission",
            "enCopropriete", "nbLotsCopro", "chargesCopro", "proprietaireId", "photos"
        ];

        fields.forEach(field => {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        });

        const bien = await prisma.bienImmobilier.update({
            where: { id },
            data: updateData,
            include: {
                proprietaire: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                    },
                },
            },
        });

        return NextResponse.json({ bien });
    } catch (error) {
        console.error("Error updating bien:", error);
        return NextResponse.json(
            { error: "Failed to update bien" },
            { status: 500 }
        );
    }
}

// DELETE /api/immobilier/biens/[id] - Delete bien
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

        const capabilityCheck = await requireAnyCapability("biens_immo");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify bien exists and belongs to entreprise
        const existing = await prisma.bienImmobilier.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                _count: {
                    select: {
                        mandats: true,
                        visites: true,
                        diffusions: true,
                    },
                },
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Bien non trouvé" },
                { status: 404 }
            );
        }

        // Prevent deletion if has active mandats
        const activeMandats = await prisma.mandatImmobilier.count({
            where: {
                bienId: id,
                statut: "EN_COURS",
            },
        });

        if (activeMandats > 0) {
            return NextResponse.json(
                { error: "Impossible de supprimer un bien avec des mandats actifs" },
                { status: 400 }
            );
        }

        await prisma.bienImmobilier.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting bien:", error);
        return NextResponse.json(
            { error: "Failed to delete bien" },
            { status: 500 }
        );
    }
}
