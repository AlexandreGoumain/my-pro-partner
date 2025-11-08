import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";

/**
 * POST /api/bank/import
 * Importer un fichier CSV de relevé bancaire
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    // Lire le contenu du fichier
    const csvContent = await file.text();

    // Parser le CSV
    const transactions = BankReconciliationService.parseBankCSV(csvContent);

    // Importer les transactions
    const imported = await BankReconciliationService.importTransactions({
      entrepriseId: session.user.entrepriseId,
      transactions,
    });

    return NextResponse.json({
      success: true,
      imported: imported.length,
      total: transactions.length,
    });
  } catch (error: any) {
    console.error("[IMPORT_BANK_CSV_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'import du CSV" },
      { status: 500 }
    );
  }
}
