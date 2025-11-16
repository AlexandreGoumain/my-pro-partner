import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { DocumentConverterService } from "@/lib/services/document-converter.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/documents/[id]/convert
 * Convert a quote (DEVIS) to an invoice (FACTURE)
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id } = await params;

        const invoice = await DocumentConverterService.convertQuoteToInvoice({
            quoteId: id,
            entrepriseId,
        });

        return NextResponse.json({ invoice }, { status: 201 });
    } catch (error) {
        console.error("[Document Convert API] Error:", error);

        const message = error instanceof Error ? error.message : "Erreur interne du serveur";
        const status = error instanceof Error && error.message.includes("non trouvé") ? 404
            : error instanceof Error && error.message.includes("pas un devis") ? 400
            : error instanceof Error && error.message.includes("acceptés") ? 400
            : error instanceof Error && error.message.includes("déjà été converti") ? 400
            : 500;

        return NextResponse.json({ message }, { status });
    }
}
