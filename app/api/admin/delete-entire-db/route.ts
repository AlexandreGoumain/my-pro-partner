import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * DELETE /api/admin/delete-entire-db
 * ⚠️ EXTREME DANGER - This deletes the ENTIRE database
 * Only available in development mode
 */
export async function DELETE() {
    // Only allow in development
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json(
            { message: "Cette action est uniquement disponible en développement" },
            { status: 403 }
        );
    }

    try {
        // Delete all data in the correct order (respecting foreign key constraints)
        // Start with child tables and work up to parent tables

        // 1. Delete all time entries, schedules, activities
        await prisma.timeEntry.deleteMany();
        await prisma.workSchedule.deleteMany();
        await prisma.activity.deleteMany();

        // 2. Delete all AI conversations and messages
        await prisma.aIMessage.deleteMany();
        await prisma.aIConversation.deleteMany();

        // 3. Delete all stock movements
        await prisma.mouvementStock.deleteMany();

        // 4. Delete all invoice/quote line items
        await prisma.ligneFacture.deleteMany();

        // 5. Delete all invoices and quotes
        await prisma.facture.deleteMany();

        // 6. Delete all segments
        await prisma.segment.deleteMany();

        // 7. Delete all articles/products
        await prisma.article.deleteMany();

        // 8. Delete all clients
        await prisma.client.deleteMany();

        // 9. Delete all suppliers
        await prisma.fournisseur.deleteMany();

        // 10. Delete all permissions
        await prisma.utilisateurPermission.deleteMany();

        // 11. Delete all users
        await prisma.utilisateur.deleteMany();

        // 12. Delete all accounts and sessions (NextAuth)
        await prisma.account.deleteMany();
        await prisma.session.deleteMany();
        await prisma.verificationToken.deleteMany();

        // 13. Finally, delete all enterprises
        await prisma.entreprise.deleteMany();

        return NextResponse.json({
            message: "Toute la base de données a été supprimée avec succès",
            success: true,
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de la DB:", error);
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Erreur lors de la suppression de la base de données",
            },
            { status: 500 }
        );
    }
}
