import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/middleware/tenant-isolation";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";

export async function DELETE() {
    return withErrorHandling(
        async () => {
            if (process.env.NODE_ENV !== "development") {
                return NextResponse.json(
                    { message: "Cette action est uniquement disponible en développement" },
                    { status: 403 }
                );
            }

            const { entrepriseId } = await requireAdmin();

            const result = await prisma.categorie.deleteMany({
                where: { entrepriseId },
            });

            return NextResponse.json({
                message: `${result.count} catégorie${result.count > 1 ? "s" : ""} supprimée${result.count > 1 ? "s" : ""}`,
                deleted: result.count,
            });
        },
        { resourceName: "Categories", operation: "delete-all" }
    );
}
