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

            // Require admin role and get entrepriseId
            const { entrepriseId } = await requireAdmin();

            // Security: Only delete the current user's enterprise (NOT all enterprises!)
            const result = await prisma.entreprise.delete({
                where: { id: entrepriseId },
            });

            return NextResponse.json({
                message: `Entreprise "${result.nom}" supprimée`,
                deleted: 1,
            });
        },
        { resourceName: "Entreprises", operation: "delete" }
    );
}
