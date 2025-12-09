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

            // Delete line items first (foreign key constraint)
            await prisma.ligneDocument.deleteMany({
                where: {
                    document: { entrepriseId },
                },
            });

            // Then delete documents
            const result = await prisma.document.deleteMany({
                where: { entrepriseId },
            });

            return NextResponse.json({
                message: `${result.count} document${result.count > 1 ? "s" : ""} supprimé${result.count > 1 ? "s" : ""}`,
                deleted: result.count,
            });
        },
        { resourceName: "Documents", operation: "delete-all" }
    );
}
