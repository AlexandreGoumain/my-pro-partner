import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/immobilier/mandats/[id] - Get single mandat
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

        const capabilityCheck = await requireAnyCapability("mandats_immo");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const mandat = await prisma.mandatImmobilier.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
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
                        prixVente: true,
                        photos: true,
                        surface: true,
                        nbPieces: true,
                    },
                },
                mandant: {
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
                agent: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                    },
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
            },
        });

        if (!mandat) {
            return NextResponse.json(
                { error: "Mandat non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({ mandat });
    } catch (error) {
        console.error("Error fetching mandat:", error);
        return NextResponse.json(
            { error: "Failed to fetch mandat" },
            { status: 500 }
        );
    }
}

// PATCH /api/immobilier/mandats/[id] - Update mandat
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

        const capabilityCheck = await requireAnyCapability("mandats_immo");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify mandat exists and belongs to entreprise
        const existing = await prisma.mandatImmobilier.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Mandat non trouvé" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: any = {};

        if (body.statut !== undefined) {
            updateData.statut = body.statut;
        }

        if (body.typeMandat !== undefined) {
            updateData.typeMandat = body.typeMandat;
        }

        if (body.dateFin !== undefined) {
            updateData.dateFin = body.dateFin ? new Date(body.dateFin) : null;
        }

        if (body.prixMandat !== undefined) {
            updateData.prixMandat = body.prixMandat;
        }

        if (body.tauxHonoraires !== undefined) {
            updateData.tauxHonoraires = body.tauxHonoraires;
        }

        if (body.honorairesHT !== undefined) {
            updateData.honorairesHT = body.honorairesHT;
        }

        if (body.honorairesTTC !== undefined) {
            updateData.honorairesTTC = body.honorairesTTC;
        }

        if (body.chargeVendeur !== undefined) {
            updateData.chargeVendeur = body.chargeVendeur;
        }

        if (body.agentId !== undefined) {
            updateData.agentId = body.agentId;
        }

        if (body.notes !== undefined) {
            updateData.notes = body.notes;
        }

        const mandat = await prisma.mandatImmobilier.update({
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
                mandant: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
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

        // Update bien status if mandat status changed
        if (body.statut === "TERMINE" || body.statut === "RESILIE") {
            await prisma.bienImmobilier.update({
                where: { id: mandat.bienId },
                data: { statut: body.statut === "TERMINE" ? "VENDU" : "DISPONIBLE" },
            });
        }

        return NextResponse.json({ mandat });
    } catch (error) {
        console.error("Error updating mandat:", error);
        return NextResponse.json(
            { error: "Failed to update mandat" },
            { status: 500 }
        );
    }
}

// DELETE /api/immobilier/mandats/[id] - Delete mandat
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

        const capabilityCheck = await requireAnyCapability("mandats_immo");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify mandat exists and belongs to entreprise
        const existing = await prisma.mandatImmobilier.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Mandat non trouvé" },
                { status: 404 }
            );
        }

        // Prevent deletion of active mandats
        if (existing.statut === "EN_COURS") {
            return NextResponse.json(
                { error: "Impossible de supprimer un mandat actif. Résiliez-le d'abord." },
                { status: 400 }
            );
        }

        await prisma.mandatImmobilier.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting mandat:", error);
        return NextResponse.json(
            { error: "Failed to delete mandat" },
            { status: 500 }
        );
    }
}
