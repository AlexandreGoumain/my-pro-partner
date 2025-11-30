import { prisma } from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/middleware/tenant-isolation";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";

/**
 * DELETE /api/admin/delete-entire-db
 * EXTREME DANGER - This deletes the ENTIRE database
 * Only available in development mode + requires authentication
 */
export async function DELETE() {
    return withErrorHandling(
        async () => {
            // Only allow in development
            if (process.env.NODE_ENV !== "development") {
                return NextResponse.json(
                    { message: "Cette action est uniquement disponible en développement" },
                    { status: 403 }
                );
            }

            // Require authentication even in development
            await requireTenantAuth();

            // Delete all data in the correct order (respecting foreign key constraints)
            // Start with child tables and work up to parent tables

            // 1. Delete all time entries, schedules, activities
            await prisma.timeEntry.deleteMany();
            await prisma.userSchedule.deleteMany();
            await prisma.userActivity.deleteMany();

            // 2. Delete all conversations and messages
            await prisma.message.deleteMany();
            await prisma.conversation.deleteMany();

            // 3. Delete all stock movements
            await prisma.mouvementStock.deleteMany();

            // 4. Delete all document line items
            await prisma.ligneDocument.deleteMany();

            // 5. Delete all documents
            await prisma.document.deleteMany();

            // 6. Delete all segments
            await prisma.segment.deleteMany();

            // 7. Delete all articles/products
            await prisma.article.deleteMany();

            // 8. Delete all clients
            await prisma.client.deleteMany();

            // 9. Delete all permissions
            await prisma.userPermissions.deleteMany();

            // 10. Delete all users
            await prisma.user.deleteMany();

            // 11. Finally, delete all enterprises
            await prisma.entreprise.deleteMany();

            return NextResponse.json({
                message: "Toute la base de données a été supprimée avec succès",
                success: true,
            });
        },
        { resourceName: "Database", operation: "delete-entire" }
    );
}
