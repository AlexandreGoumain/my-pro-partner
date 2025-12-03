import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/bank/import
 * Import a CSV bank statement file
 */
export async function POST(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const formData = await req.formData();
            const file = formData.get("file") as File;

            if (!file) {
                throw new ValidationError("Fichier manquant");
            }

            // Read file content
            const csvContent = await file.text();

            // Parse CSV
            const transactions = BankReconciliationService.parseBankCSV(csvContent);

            // Import transactions
            const imported = await BankReconciliationService.importTransactions({
                entrepriseId: ctx.entrepriseId,
                transactions,
            });

            return NextResponse.json({
                success: true,
                imported: imported.length,
                total: transactions.length,
            });
        },
        {
            context: { resourceName: "BankTransaction", operation: "import" },
        }
    );
}
