import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/prestations/[id]
 * Get a single prestation
 */
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await context.params;

        const item = await prisma.prestation.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!item) {
            return NextResponse.json(
                { error: "Prestation non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            ...item,
            prix: Number(item.prix),
        });
    } catch (error) {
        console.error("Error fetching prestation:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/prestations/[id]
 * Update a prestation
 */
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await context.params;
        const body = await request.json();

        // Check item exists and belongs to entreprise
        const existing = await prisma.prestation.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Prestation non trouvée" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: Record<string, unknown> = {};

        if (body.nom !== undefined) {
            if (!body.nom || body.nom.trim() === "") {
                return NextResponse.json(
                    { error: "Le nom de la prestation est requis" },
                    { status: 400 }
                );
            }
            updateData.nom = body.nom.trim();
        }

        if (body.description !== undefined) {
            updateData.description = body.description?.trim() || null;
        }

        if (body.duree !== undefined) {
            if (body.duree <= 0) {
                return NextResponse.json(
                    { error: "La durée doit être positive" },
                    { status: 400 }
                );
            }
            updateData.duree = body.duree;
        }

        if (body.prix !== undefined) {
            if (body.prix < 0) {
                return NextResponse.json(
                    { error: "Le prix doit être positif" },
                    { status: 400 }
                );
            }
            updateData.prix = body.prix;
        }

        if (body.categorie !== undefined) {
            updateData.categorie = body.categorie || null;
        }

        if (body.actif !== undefined) {
            updateData.actif = body.actif;
        }

        if (body.ordre !== undefined) {
            updateData.ordre = body.ordre;
        }

        // Update
        const item = await prisma.prestation.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({
            ...item,
            prix: Number(item.prix),
        });
    } catch (error) {
        console.error("Error updating prestation:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/prestations/[id]
 * Delete a prestation
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await context.params;

        // Check item exists and belongs to entreprise
        const existing = await prisma.prestation.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Prestation non trouvée" },
                { status: 404 }
            );
        }

        // Check if prestation is used in any rendez-vous
        const usedInRdv = await prisma.rendezVous.count({
            where: { prestationId: id },
        });

        if (usedInRdv > 0) {
            return NextResponse.json(
                {
                    error: "Cette prestation est utilisée dans des rendez-vous et ne peut pas être supprimée",
                },
                { status: 400 }
            );
        }

        // Delete
        await prisma.prestation.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting prestation:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
