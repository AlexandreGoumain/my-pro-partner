import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createCabineSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    type: z.string().optional(),
    capacite: z.number().min(1).optional().default(1),
    equipements: z.string().optional(),
    couleur: z.string().optional(),
    actif: z.boolean().optional().default(true),
    ordre: z.number().optional().default(0),
});

// GET /api/cabines - Liste des cabines
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        // Vérifier la capability
        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");
        const search = searchParams.get("search") || "";
        const type = searchParams.get("type") || "";
        const actif = searchParams.get("actif");

        const where = {
            entrepriseId: session.user.entrepriseId,
            ...(search && {
                OR: [
                    { nom: { contains: search, mode: "insensitive" as const } },
                    {
                        description: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }),
            ...(type && { type }),
            ...(actif !== null && actif !== "" && { actif: actif === "true" }),
        };

        const [cabines, total] = await Promise.all([
            prisma.cabine.findMany({
                where,
                orderBy: [{ ordre: "asc" }, { nom: "asc" }],
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    _count: {
                        select: { rendezVous: true },
                    },
                },
            }),
            prisma.cabine.count({ where }),
        ]);

        return NextResponse.json({
            data: cabines,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Erreur GET cabines:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST /api/cabines - Créer une cabine
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        // Vérifier la capability
        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();
        const validatedData = createCabineSchema.parse(body);

        const cabine = await prisma.cabine.create({
            data: {
                ...validatedData,
                entrepriseId: session.user.entrepriseId,
            },
        });

        return NextResponse.json(cabine, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur POST cabine:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
