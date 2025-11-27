import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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
 * GET /api/menu/stats
 * Get menu statistics
 */
export async function GET() {
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

        // Get all items for the entreprise
        const items = await prisma.menuItem.findMany({
            where: { entrepriseId: session.user.entrepriseId },
            select: {
                prix: true,
                disponible: true,
                categorie: true,
            },
        });

        const total = items.length;
        const disponibles = items.filter((i) => i.disponible).length;
        const indisponibles = total - disponibles;

        // Calculate average price
        const prixMoyen =
            total > 0
                ? items.reduce((sum, i) => sum + Number(i.prix), 0) / total
                : 0;

        // Count by category
        const categoryCounts: Record<string, number> = {};
        MENU_CATEGORIES.forEach((cat) => {
            categoryCounts[cat] = 0;
        });

        items.forEach((item) => {
            if (categoryCounts[item.categorie] !== undefined) {
                categoryCounts[item.categorie]++;
            }
        });

        const parCategorie = Object.entries(categoryCounts)
            .map(([categorie, count]) => ({ categorie, count }))
            .filter((c) => c.count > 0);

        return NextResponse.json({
            total,
            disponibles,
            indisponibles,
            parCategorie,
            prixMoyen: Math.round(prixMoyen * 100) / 100,
        });
    } catch (error) {
        console.error("Error fetching menu stats:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
