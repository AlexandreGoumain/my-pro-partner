import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const MENU_CATEGORIES = [
    "Entrées",
    "Plats",
    "Desserts",
    "Boissons",
    "Formules",
    "Accompagnements",
    "Autre",
];

interface RouteContext {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/menu/[id]
 * Get a single menu item
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

        const capabilityCheck = await requireCapability("menu");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await context.params;

        const item = await prisma.menuItem.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!item) {
            return NextResponse.json(
                { error: "Plat non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            ...item,
            prix: Number(item.prix),
            allergenes: item.allergenes || [],
        });
    } catch (error) {
        console.error("Error fetching menu item:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/menu/[id]
 * Update a menu item
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

        const capabilityCheck = await requireCapability("menu");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await context.params;
        const body = await request.json();

        // Check item exists and belongs to entreprise
        const existing = await prisma.menuItem.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Plat non trouvé" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: Record<string, unknown> = {};

        if (body.nom !== undefined) {
            if (!body.nom || body.nom.trim() === "") {
                return NextResponse.json(
                    { error: "Le nom du plat est requis" },
                    { status: 400 }
                );
            }
            updateData.nom = body.nom.trim();
        }

        if (body.description !== undefined) {
            updateData.description = body.description?.trim() || null;
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
            if (!MENU_CATEGORIES.includes(body.categorie)) {
                return NextResponse.json(
                    { error: "Catégorie invalide" },
                    { status: 400 }
                );
            }
            updateData.categorie = body.categorie;
        }

        if (body.allergenes !== undefined) {
            updateData.allergenes = body.allergenes || [];
        }

        if (body.tempsPreparation !== undefined) {
            updateData.tempsPreparation = body.tempsPreparation || null;
        }

        if (body.disponible !== undefined) {
            updateData.disponible = body.disponible;
        }

        if (body.imageUrl !== undefined) {
            updateData.imageUrl = body.imageUrl || null;
        }

        if (body.ordre !== undefined) {
            updateData.ordre = body.ordre;
        }

        // Update
        const item = await prisma.menuItem.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({
            ...item,
            prix: Number(item.prix),
            allergenes: item.allergenes || [],
        });
    } catch (error) {
        console.error("Error updating menu item:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/menu/[id]
 * Delete a menu item
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

        const capabilityCheck = await requireCapability("menu");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await context.params;

        // Check item exists and belongs to entreprise
        const existing = await prisma.menuItem.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Plat non trouvé" },
                { status: 404 }
            );
        }

        // Delete
        await prisma.menuItem.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting menu item:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
