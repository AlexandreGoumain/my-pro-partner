import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const tableCreateSchema = z.object({
    numero: z.number().int().positive("Le numéro doit être positif"),
    nom: z.string().optional(),
    capacite: z.number().int().min(1).default(4),
    zone: z.string().default("Salle principale"),
});

// GET /api/tables - List tables with filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("tables");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const zone = searchParams.get("zone");
        const statut = searchParams.get("statut");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
        };

        if (zone && zone !== "all") {
            where.zone = zone;
        }

        if (statut && statut !== "all") {
            where.statut = statut;
        }

        if (search) {
            where.OR = [
                { nom: { contains: search, mode: "insensitive" } },
                { zone: { contains: search, mode: "insensitive" } },
            ];
        }

        const [tables, total] = await Promise.all([
            prisma.tableRestaurant.findMany({
                where,
                orderBy: [{ zone: "asc" }, { numero: "asc" }],
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.tableRestaurant.count({ where }),
        ]);

        return NextResponse.json({
            tables,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching tables:", error);
        return NextResponse.json(
            { error: "Failed to fetch tables" },
            { status: 500 }
        );
    }
}

// POST /api/tables - Create new table
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("tables");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();
        const validation = tableCreateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const { numero, nom, capacite, zone } = validation.data;

        // Check if table number already exists
        const existingTable = await prisma.tableRestaurant.findUnique({
            where: {
                entrepriseId_numero: {
                    entrepriseId: session.user.entrepriseId,
                    numero,
                },
            },
        });

        if (existingTable) {
            return NextResponse.json(
                { error: `La table n°${numero} existe déjà` },
                { status: 400 }
            );
        }

        const table = await prisma.tableRestaurant.create({
            data: {
                numero,
                nom: nom || `Table ${numero}`,
                capacite,
                zone,
                statut: "LIBRE",
                entrepriseId: session.user.entrepriseId,
            },
        });

        return NextResponse.json({ table }, { status: 201 });
    } catch (error) {
        console.error("Error creating table:", error);
        return NextResponse.json(
            { error: "Failed to create table" },
            { status: 500 }
        );
    }
}
