import { withApiHandler } from "@/lib/api/api-handler";
import { BusinessError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * DELETE /api/user/delete-all-data
 * Delete ALL data for the current user (development only)
 * WARNING: This action is irreversible
 */
export async function DELETE() {
    return withApiHandler(
        async (ctx) => {
            // Block this endpoint in production
            if (process.env.NODE_ENV === "production") {
                throw new BusinessError("Cette opération n'est pas autorisée en production");
            }

            // Delete the user (cascade will automatically delete all related data)
            // This includes:
            // - UserPermissions
            // - UserSchedule
            // - TimeEntry
            // - UserActivity
            // - Conversation (and nested Messages)
            // - MouvementStock
            const deletedUser = await prisma.user.delete({
                where: {
                    id: ctx.userId,
                    entrepriseId: ctx.entrepriseId, // Tenant isolation check
                },
            });

            return NextResponse.json({
                message: "Toutes vos données ont été supprimées avec succès",
                userId: deletedUser.id,
            });
        },
        {
            context: { resourceName: "User", operation: "deleteAllData" },
        }
    );
}
