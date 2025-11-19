import {
    handleTenantError,
    requireDevelopmentMode,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * DELETE /api/user/delete-all-data
 * Delete ALL data for the current user (development only)
 * WARNING: This action is irreversible
 */
export async function DELETE() {
    try {
        // Block this endpoint in production
        requireDevelopmentMode();

        const { userId, entrepriseId } = await requireTenantAuth();

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
                id: userId,
                entrepriseId, // Tenant isolation check
            },
        });

        return NextResponse.json({
            message: "Toutes vos données ont été supprimées avec succès",
            userId: deletedUser.id,
        });
    } catch (error) {
        return handleTenantError(error);
    }
}
