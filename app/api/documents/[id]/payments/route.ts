import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/documents/[id]/payments
 * Fetch all payments for a specific document
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId: _entrepriseId } = await requireTenantAuth();
        const { id } = await params;

        const payments = await prisma.paiement.findMany({
            where: {
                documentId: id,
            },
            orderBy: {
                date_paiement: "desc",
            },
        });

        return NextResponse.json({ payments });
    } catch (error) {
        return handleTenantError(error);
    }
}
