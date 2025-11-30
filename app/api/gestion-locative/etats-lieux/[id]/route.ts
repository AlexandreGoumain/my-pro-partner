import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/gestion-locative/etats-lieux/[id] - Get single etat des lieux
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

        const capabilityCheck = await requireAnyCapability("etats_lieux");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const etatDesLieux = await prisma.etatDesLieux.findFirst({
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
                                adresse: true,
                                ville: true,
                                surface: true,
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

        if (!etatDesLieux) {
            return NextResponse.json(
                { error: "État des lieux non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({ etatDesLieux });
    } catch (error) {
        console.error("Error fetching etat des lieux:", error);
        return NextResponse.json(
            { error: "Failed to fetch etat des lieux" },
            { status: 500 }
        );
    }
}

// PATCH /api/gestion-locative/etats-lieux/[id] - Update etat des lieux
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

        const capabilityCheck = await requireAnyCapability("etats_lieux");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify etat des lieux exists and belongs to entreprise
        const existing = await prisma.etatDesLieux.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "État des lieux non trouvé" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: any = {};

        if (body.dateEtat !== undefined) {
            updateData.dateEtat = new Date(body.dateEtat);
        }

        if (body.releveEau !== undefined) {
            updateData.releveEau = body.releveEau;
        }

        if (body.releveElec !== undefined) {
            updateData.releveElec = body.releveElec;
        }

        if (body.releveGaz !== undefined) {
            updateData.releveGaz = body.releveGaz;
        }

        if (body.constatations !== undefined) {
            updateData.constatations = body.constatations;
        }

        if (body.photos !== undefined) {
            updateData.photos = body.photos;
        }

        if (body.notes !== undefined) {
            updateData.notes = body.notes;
        }

        if (body.signatureLocataire !== undefined) {
            updateData.signatureLocataire = body.signatureLocataire;
        }

        if (body.signatureProprietaire !== undefined) {
            updateData.signatureProprietaire = body.signatureProprietaire;
        }

        if (body.documentUrl !== undefined) {
            updateData.documentUrl = body.documentUrl;
        }

        if (body.retenueDepot !== undefined) {
            updateData.retenueDepot = body.retenueDepot;
        }

        if (body.motifRetenue !== undefined) {
            updateData.motifRetenue = body.motifRetenue;
        }

        const etatDesLieux = await prisma.etatDesLieux.update({
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

        return NextResponse.json({ etatDesLieux });
    } catch (error) {
        console.error("Error updating etat des lieux:", error);
        return NextResponse.json(
            { error: "Failed to update etat des lieux" },
            { status: 500 }
        );
    }
}

// DELETE /api/gestion-locative/etats-lieux/[id] - Delete etat des lieux
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

        const capabilityCheck = await requireAnyCapability("etats_lieux");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify etat des lieux exists and belongs to entreprise
        const existing = await prisma.etatDesLieux.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "État des lieux non trouvé" },
                { status: 404 }
            );
        }

        // Prevent deletion if signed
        if (existing.signatureLocataire && existing.signatureProprietaire) {
            return NextResponse.json(
                { error: "Impossible de supprimer un état des lieux signé" },
                { status: 400 }
            );
        }

        await prisma.etatDesLieux.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting etat des lieux:", error);
        return NextResponse.json(
            { error: "Failed to delete etat des lieux" },
            { status: 500 }
        );
    }
}
