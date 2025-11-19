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

            // Delete line items first (foreign key constraint)
            await prisma.ligneFacture.deleteMany({
                where: {
                    facture: { entrepriseId },
                },
            });

            // Then delete invoices
            const result = await prisma.facture.deleteMany({
                where: { entrepriseId },
            });

            return NextResponse.json({
                message: `${result.count} facture${result.count > 1 ? "s" : ""}/devis supprimé${result.count > 1 ? "s" : ""}`,
                deleted: result.count,
            });
        },
        { resourceName: "Factures", operation: "delete-all" }
    );
}
