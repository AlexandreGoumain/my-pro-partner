import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
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

/**
 * GET /api/menu
 * List all menu items for the entreprise
 */
export async function GET(request: NextRequest) {
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

        const searchParams = request.nextUrl.searchParams;
        const params = getPaginationParams(searchParams);
        const search = searchParams.get("search") || "";
        const categorie = searchParams.get("categorie");
        const disponibleParam = searchParams.get("disponible");

        // Build where clause
        const where: Record<string, unknown> = {
            entrepriseId: session.user.entrepriseId,
        };

        if (search) {
            where.OR = [
                { nom: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        if (categorie && MENU_CATEGORIES.includes(categorie)) {
            where.categorie = categorie;
        }

        if (disponibleParam !== null) {
            where.disponible = disponibleParam === "true";
        }

        // Get total count
        const total = await prisma.menuItem.count({ where });

        // Get items with pagination
        const items = await prisma.menuItem.findMany({
            where,
            orderBy: [{ categorie: "asc" }, { ordre: "asc" }, { nom: "asc" }],
            skip: params.skip,
            take: params.limit,
        });

        return NextResponse.json(
            createPaginatedResponse(
                items.map((item) => ({
                    ...item,
                    prix: Number(item.prix),
                    allergenes: item.allergenes || [],
                })),
                total,
                params
            )
        );
    } catch (error) {
        console.error("Error fetching menu items:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/menu
 * Create a new menu item
 */
export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const {
            nom,
            description,
            prix,
            categorie,
            allergenes,
            tempsPreparation,
            disponible,
            imageUrl,
            ordre,
        } = body;

        // Validation
        if (!nom || nom.trim() === "") {
            return NextResponse.json(
                { error: "Le nom du plat est requis" },
                { status: 400 }
            );
        }

        if (prix === undefined || prix < 0) {
            return NextResponse.json(
                { error: "Le prix doit être positif" },
                { status: 400 }
            );
        }

        if (!categorie || !MENU_CATEGORIES.includes(categorie)) {
            return NextResponse.json(
                { error: "Catégorie invalide" },
                { status: 400 }
            );
        }

        // Create menu item
        const item = await prisma.menuItem.create({
            data: {
                entrepriseId: session.user.entrepriseId,
                nom: nom.trim(),
                description: description?.trim() || null,
                prix,
                categorie,
                allergenes: allergenes || [],
                tempsPreparation: tempsPreparation || null,
                disponible: disponible !== false,
                imageUrl: imageUrl || null,
                ordre: ordre || 0,
            },
        });

        return NextResponse.json(
            {
                ...item,
                prix: Number(item.prix),
                allergenes: item.allergenes || [],
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating menu item:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
