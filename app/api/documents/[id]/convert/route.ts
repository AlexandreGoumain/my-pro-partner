import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DocumentConverterService } from "@/lib/services/document-converter.service";
import { getServerSession } from "next-auth/next";
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
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const invoice = await DocumentConverterService.convertQuoteToInvoice({
            quoteId: id,
            entrepriseId: session.user.entrepriseId,
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
