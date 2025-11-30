import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/immobilier/diffusion/[id] - Get single diffusion
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

        const capabilityCheck = await requireAnyCapability("diffusion_annonces");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const diffusion = await prisma.diffusionAnnonce.findFirst({
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
                        description: true,
                    },
                },
                _count: {
                    select: {
                        leads: true,
                    },
                },
            },
        });

        if (!diffusion) {
            return NextResponse.json(
                { error: "Diffusion non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json({ diffusion });
    } catch (error) {
        console.error("Error fetching diffusion:", error);
        return NextResponse.json(
            { error: "Failed to fetch diffusion" },
            { status: 500 }
        );
    }
}

// PATCH /api/immobilier/diffusion/[id] - Update diffusion
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

        const capabilityCheck = await requireAnyCapability("diffusion_annonces");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify diffusion exists and belongs to entreprise
        const existing = await prisma.diffusionAnnonce.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Diffusion non trouvée" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: any = {};

        if (body.statut !== undefined) {
            updateData.statut = body.statut;

            // Set dates based on status
            if (body.statut === "ACTIVE" && !existing.datePublication) {
                updateData.datePublication = new Date();
            }
            if (body.statut === "EXPIREE" && !existing.dateExpiration) {
                updateData.dateExpiration = new Date();
            }
        }

        if (body.typeAnnonce !== undefined) {
            updateData.typeAnnonce = body.typeAnnonce;
        }

        if (body.titreAnnonce !== undefined) {
            updateData.titreAnnonce = body.titreAnnonce;
        }

        if (body.descriptionAnnonce !== undefined) {
            updateData.descriptionAnnonce = body.descriptionAnnonce;
        }

        if (body.photosSelectionnees !== undefined) {
            updateData.photosSelectionnees = body.photosSelectionnees;
        }

        if (body.urlAnnonce !== undefined) {
            updateData.urlAnnonce = body.urlAnnonce;
        }

        if (body.vues !== undefined) {
            updateData.vues = body.vues;
        }

        if (body.contacts !== undefined) {
            updateData.contacts = body.contacts;
        }

        const diffusion = await prisma.diffusionAnnonce.update({
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
                        prixVente: true,
                        photos: true,
                    },
                },
                _count: {
                    select: {
                        leads: true,
                    },
                },
            },
        });

        return NextResponse.json({ diffusion });
    } catch (error) {
        console.error("Error updating diffusion:", error);
        return NextResponse.json(
            { error: "Failed to update diffusion" },
            { status: 500 }
        );
    }
}

// DELETE /api/immobilier/diffusion/[id] - Delete diffusion (retire from portal)
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

        const capabilityCheck = await requireAnyCapability("diffusion_annonces");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify diffusion exists and belongs to entreprise
        const existing = await prisma.diffusionAnnonce.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Diffusion non trouvée" },
                { status: 404 }
            );
        }

        // Instead of hard delete, mark as expired (soft delete for history)
        if (existing.statut === "ACTIVE") {
            await prisma.diffusionAnnonce.update({
                where: { id },
                data: {
                    statut: "EXPIREE",
                    dateExpiration: new Date(),
                },
            });
        } else {
            // If not active, can delete
            await prisma.diffusionAnnonce.delete({
                where: { id },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting diffusion:", error);
        return NextResponse.json(
            { error: "Failed to delete diffusion" },
            { status: 500 }
        );
    }
}
