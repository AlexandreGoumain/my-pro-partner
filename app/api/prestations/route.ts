import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const PRESTATION_CATEGORIES = [
    "Coupe",
    "Couleur",
    "Mèches",
    "Soin",
    "Coiffage",
    "Barbe",
    "Autre",
];

/**
 * GET /api/prestations
 * List all prestations for the entreprise
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

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const params = getPaginationParams(searchParams);
        const search = searchParams.get("search") || "";
        const categorie = searchParams.get("categorie");
        const actifParam = searchParams.get("actif");

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

        if (categorie) {
            where.categorie = categorie;
        }

        if (actifParam !== null) {
            where.actif = actifParam === "true";
        }

        // Get total count
        const total = await prisma.prestation.count({ where });

        // Get items with pagination
        const items = await prisma.prestation.findMany({
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
                })),
                total,
                params
            )
        );
    } catch (error) {
        console.error("Error fetching prestations:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/prestations
 * Create a new prestation
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

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();
        const { nom, description, duree, prix, categorie, actif, ordre } = body;

        // Validation
        if (!nom || nom.trim() === "") {
            return NextResponse.json(
                { error: "Le nom de la prestation est requis" },
                { status: 400 }
            );
        }

        if (!duree || duree <= 0) {
            return NextResponse.json(
                { error: "La durée doit être positive" },
                { status: 400 }
            );
        }

        if (prix === undefined || prix < 0) {
            return NextResponse.json(
                { error: "Le prix doit être positif" },
                { status: 400 }
            );
        }

        // Create prestation
        const item = await prisma.prestation.create({
            data: {
                entrepriseId: session.user.entrepriseId,
                nom: nom.trim(),
                description: description?.trim() || null,
                duree,
                prix,
                categorie: categorie || null,
                actif: actif !== false,
                ordre: ordre || 0,
            },
        });

        return NextResponse.json(
            {
                ...item,
                prix: Number(item.prix),
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating prestation:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
