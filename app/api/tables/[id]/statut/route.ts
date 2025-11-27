import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const statutSchema = z.object({
    statut: z.enum(["LIBRE", "OCCUPEE", "RESERVEE"]),
});

// POST /api/tables/[id]/statut - Change table status
export async function POST(
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
        const validation = statutSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const { statut } = validation.data;

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

        const table = await prisma.tableRestaurant.update({
            where: { id },
            data: { statut },
        });

        return NextResponse.json({ table });
    } catch (error) {
        console.error("Error updating table status:", error);
        return NextResponse.json(
            { error: "Failed to update table status" },
            { status: 500 }
        );
    }
}
