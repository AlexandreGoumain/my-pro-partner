import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/bank/import
 * Importer un fichier CSV de relevé bancaire
 */
export async function POST(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "Fichier manquant" },
                { status: 400 }
            );
        }

        // Lire le contenu du fichier
        const csvContent = await file.text();

        // Parser le CSV
        const transactions = BankReconciliationService.parseBankCSV(csvContent);

        // Importer les transactions
        const imported = await BankReconciliationService.importTransactions({
            entrepriseId,
            transactions,
        });

        return NextResponse.json({
            success: true,
            imported: imported.length,
            total: transactions.length,
        });
    } catch (error) {
        return handleTenantError(error);
    }
}
