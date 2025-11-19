import { prisma } from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/middleware/tenant-isolation";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";

/**
 * DELETE /api/admin/delete-all-segments
 * Delete all segments for the current enterprise
 * Only available in development mode
 */
export async function DELETE() {
    return withErrorHandling(
        async () => {
            // Only allow in development
            if (process.env.NODE_ENV !== "development") {
                return NextResponse.json(
                    {
                        message:
                            "Cette action est uniquement disponible en développement",
                    },
                    { status: 403 }
                );
            }

            const { entrepriseId } = await requireTenantAuth();

            // Delete all segments for the current enterprise
            const result = await prisma.segment.deleteMany({
                where: {
                    entrepriseId,
                },
            });

            return NextResponse.json({
                message: `${result.count} segment${result.count > 1 ? "s" : ""} supprimé${result.count > 1 ? "s" : ""} avec succès`,
                deleted: result.count,
                success: true,
            });
        },
        { resourceName: "Segments", operation: "delete-all" }
    );
}
