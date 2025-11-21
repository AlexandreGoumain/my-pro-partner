import { prisma } from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/middleware/tenant-isolation";
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

            const { entrepriseId } = await requireTenantAuth();

            const result = await prisma.rachatArticle.deleteMany({
                where: { entrepriseId },
            });

            return NextResponse.json({
                message: `${result.count} rachat${result.count > 1 ? "s" : ""} supprimé${result.count > 1 ? "s" : ""}`,
                deleted: result.count,
            });
        },
        { resourceName: "Rachats", operation: "delete-all" }
    );
}
