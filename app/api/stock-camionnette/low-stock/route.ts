import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("stock_camionnette");
        if (capabilityCheck) return capabilityCheck;

        // Find all stock items where quantite <= seuilAlerte
        const lowStockItems = await prisma.stockCamionnette.findMany({
            where: {
                entrepriseId: session.user.entrepriseId,
                quantite: {
                    lte: prisma.stockCamionnette.fields.seuilAlerte,
                },
            },
            include: {
                camionnette: {
                    select: {
                        nom: true,
                        immatriculation: true,
                    },
                },
            },
            orderBy: {
                quantite: "asc",
            },
        });

        return NextResponse.json({ lowStockItems });
    } catch (error) {
        console.error("Error fetching low stock:", error);
        return NextResponse.json(
            { error: "Failed to fetch low stock" },
            { status: 500 }
        );
    }
}
