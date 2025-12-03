import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/documents/[id]/payments
 * Fetch all payments for a specific document
 */
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            // Verify document exists and belongs to entreprise
            const document = await prisma.document.findFirst({
                where: { id, entrepriseId: ctx.entrepriseId },
            });

            if (!document) {
                throw new NotFoundError("Document");
            }

            const payments = await prisma.paiement.findMany({
                where: {
                    documentId: id,
                },
                orderBy: {
                    date_paiement: "desc",
                },
            });

            return NextResponse.json({ payments });
        },
        {
            context: { resourceName: "Document", operation: "listPayments" },
        }
    );
}
