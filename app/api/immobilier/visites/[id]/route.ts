import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/immobilier/visites/[id] - Get single visite
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

        const capabilityCheck = await requireAnyCapability("visites_immo");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const visite = await prisma.visiteImmobilier.findFirst({
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
                        photos: true,
                        prixVente: true,
                    },
                },
                visiteur: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        email: true,
                    },
                },
                agent: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                    },
                },
                mandat: {
                    select: {
                        id: true,
                        numero: true,
                    },
                },
            },
        });

        if (!visite) {
            return NextResponse.json(
                { error: "Visite non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json({ visite });
    } catch (error) {
        console.error("Error fetching visite:", error);
        return NextResponse.json(
            { error: "Failed to fetch visite" },
            { status: 500 }
        );
    }
}

// PATCH /api/immobilier/visites/[id] - Update visite
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

        const capabilityCheck = await requireAnyCapability("visites_immo");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify visite exists and belongs to entreprise
        const existing = await prisma.visiteImmobilier.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Visite non trouvée" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: any = {};

        if (body.statut !== undefined) {
            updateData.statut = body.statut;
        }

        if (body.dateVisite !== undefined) {
            updateData.dateVisite = new Date(body.dateVisite);
        }

        if (body.duree !== undefined) {
            updateData.duree = body.duree;
        }

        if (body.agentId !== undefined) {
            updateData.agentId = body.agentId;
        }

        if (body.compteRendu !== undefined) {
            updateData.compteRendu = body.compteRendu;
        }

        if (body.noteInteret !== undefined) {
            updateData.noteInteret = body.noteInteret;
        }

        if (body.notes !== undefined) {
            updateData.notes = body.notes;
        }

        const visite = await prisma.visiteImmobilier.update({
            where: { id },
            data: updateData,
            include: {
                bien: {
                    select: {
                        id: true,
                        reference: true,
                        titre: true,
                    },
                },
                visiteur: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
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

        return NextResponse.json({ visite });
    } catch (error) {
        console.error("Error updating visite:", error);
        return NextResponse.json(
            { error: "Failed to update visite" },
            { status: 500 }
        );
    }
}

// DELETE /api/immobilier/visites/[id] - Delete visite
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

        const capabilityCheck = await requireAnyCapability("visites_immo");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify visite exists and belongs to entreprise
        const existing = await prisma.visiteImmobilier.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Visite non trouvée" },
                { status: 404 }
            );
        }

        await prisma.visiteImmobilier.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting visite:", error);
        return NextResponse.json(
            { error: "Failed to delete visite" },
            { status: 500 }
        );
    }
}
