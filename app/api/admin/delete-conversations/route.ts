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

            // Delete messages first
            await prisma.message.deleteMany({
                where: { conversation: { user: { entrepriseId } } },
            });

            // Then delete conversations
            const result = await prisma.conversation.deleteMany({
                where: { user: { entrepriseId } },
            });

            return NextResponse.json({
                message: `${result.count} conversation${result.count > 1 ? "s" : ""} supprimée${result.count > 1 ? "s" : ""}`,
                deleted: result.count,
            });
        },
        { resourceName: "Conversations", operation: "delete-all" }
    );
}
