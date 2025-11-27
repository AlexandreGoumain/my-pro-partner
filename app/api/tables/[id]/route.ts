import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for update
const tableUpdateSchema = z.object({
    numero: z.number().int().positive().optional(),
    nom: z.string().optional(),
    capacite: z.number().int().min(1).optional(),
    zone: z.string().optional(),
    statut: z.enum(["LIBRE", "OCCUPEE", "RESERVEE"]).optional(),
});

// GET /api/tables/[id] - Get table detail
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

        const capabilityCheck = await requireCapability("tables");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const table = await prisma.tableRestaurant.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                reservations: {
                    where: {
                        date: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        },
                        statut: {
                            in: ["EN_ATTENTE", "CONFIRMEE"],
                        },
                    },
                    orderBy: { date: "asc" },
                    take: 5,
                },
            },
        });

        if (!table) {
            return NextResponse.json(
                { error: "Table not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ table });
    } catch (error) {
        console.error("Error fetching table:", error);
        return NextResponse.json(
            { error: "Failed to fetch table" },
            { status: 500 }
        );
    }
}

// PUT /api/tables/[id] - Update table
export async function PUT(
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

        const capabilityCheck = await requireCapability("tables");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();
        const validation = tableUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validation.error.errors,
                },
                { status: 400 }
            );
        }

        // Check if table exists and belongs to entreprise
        const existingTable = await prisma.tableRestaurant.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existingTable) {
            return NextResponse.json(
                { error: "Table not found" },
                { status: 404 }
            );
        }

        // If updating numero, check for conflicts
        if (
            validation.data.numero &&
            validation.data.numero !== existingTable.numero
        ) {
            const conflict = await prisma.tableRestaurant.findUnique({
                where: {
                    entrepriseId_numero: {
                        entrepriseId: session.user.entrepriseId,
                        numero: validation.data.numero,
                    },
                },
            });

            if (conflict) {
                return NextResponse.json(
                    {
                        error: `La table n°${validation.data.numero} existe déjà`,
                    },
                    { status: 400 }
                );
            }
        }

        const table = await prisma.tableRestaurant.update({
            where: { id },
            data: validation.data,
        });

        return NextResponse.json({ table });
    } catch (error) {
        console.error("Error updating table:", error);
        return NextResponse.json(
            { error: "Failed to update table" },
            { status: 500 }
        );
    }
}

// DELETE /api/tables/[id] - Delete table
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

        const capabilityCheck = await requireCapability("tables");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Check if table exists and belongs to entreprise
        const table = await prisma.tableRestaurant.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                reservations: {
                    where: {
                        statut: {
                            in: ["EN_ATTENTE", "CONFIRMEE"],
                        },
                    },
                },
            },
        });

        if (!table) {
            return NextResponse.json(
                { error: "Table not found" },
                { status: 404 }
            );
        }

        // Check for active reservations
        if (table.reservations.length > 0) {
            return NextResponse.json(
                {
                    error: "Impossible de supprimer une table avec des réservations actives",
                },
                { status: 400 }
            );
        }

        await prisma.tableRestaurant.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting table:", error);
        return NextResponse.json(
            { error: "Failed to delete table" },
            { status: 500 }
        );
    }
}
