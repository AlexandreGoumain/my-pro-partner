import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";

/**
 * Service de rapprochement bancaire
 */
export class BankReconciliationService {
  /**
   * Parser un fichier CSV de relevé bancaire
   */
  static parseBankCSV(csvContent: string) {
    try {
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ";", // Format français courant
      });

      return records.map((record: any) => ({
        date: this.parseDate(record.Date || record.date),
        libelle: record.Libellé || record.libelle || record.description || "",
        montant: this.parseMontant(record.Montant || record.montant || record.amount),
        reference: record.Référence || record.reference || null,
      }));
    } catch (error) {
      console.error("[CSV_PARSE_ERROR]", error);
      throw new Error("Erreur lors du parsing du CSV");
    }
  }

  /**
   * Parser une date (format DD/MM/YYYY ou YYYY-MM-DD)
   */
  private static parseDate(dateStr: string): Date {
    // Format DD/MM/YYYY
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
    // Format YYYY-MM-DD
    return new Date(dateStr);
  }

  /**
   * Parser un montant (gérer virgule et point)
   */
  private static parseMontant(montantStr: string): number {
    if (typeof montantStr === "number") return montantStr;

    // Remplacer virgule par point
    const cleaned = montantStr.replace(",", ".").replace(/\s/g, "");
    return parseFloat(cleaned);
  }

  /**
   * Importer des transactions bancaires
   */
  static async importTransactions({
    entrepriseId,
    transactions,
  }: {
    entrepriseId: string;
    transactions: Array<{
      date: Date;
      libelle: string;
      montant: number;
      reference?: string | null;
    }>;
  }) {
    const imported = [];

    for (const transaction of transactions) {
      // Vérifier si la transaction existe déjà (éviter les doublons)
      const existing = await prisma.bankTransaction.findFirst({
        where: {
          entrepriseId,
          date: transaction.date,
          montant: transaction.montant,
          libelle: transaction.libelle,
        },
      });

      if (existing) {
        continue; // Skip si existe déjà
      }

      const created = await prisma.bankTransaction.create({
        data: {
          entrepriseId,
          date: transaction.date,
          libelle: transaction.libelle,
          montant: transaction.montant,
          reference: transaction.reference,
          statut: "PENDING",
        },
      });

      imported.push(created);
    }

    // Lancer le matching automatique
    await this.autoMatch(entrepriseId);

    return imported;
  }

  /**
   * Matching automatique intelligent
   */
  static async autoMatch(entrepriseId: string) {
    const pendingTransactions = await prisma.bankTransaction.findMany({
      where: {
        entrepriseId,
        statut: "PENDING",
      },
    });

    for (const transaction of pendingTransactions) {
      const match = await this.findMatch(entrepriseId, transaction);

      if (match) {
        await prisma.bankTransaction.update({
          where: { id: transaction.id },
          data: {
            documentId: match.id,
            statut: "MATCHED",
          },
        });
      }
    }
  }

  /**
   * Trouver une facture correspondante
   */
  private static async findMatch(
    entrepriseId: string,
    transaction: any
  ) {
    const montant = Number(transaction.montant);
    const date = transaction.date;

    // Rechercher par montant et date (±3 jours)
    const dateMin = new Date(date);
    dateMin.setDate(dateMin.getDate() - 3);
    const dateMax = new Date(date);
    dateMax.setDate(dateMax.getDate() + 3);

    const documents = await prisma.document.findMany({
      where: {
        entrepriseId,
        type: "FACTURE",
        total_ttc: montant,
        dateEmission: {
          gte: dateMin,
          lte: dateMax,
        },
      },
      include: {
        paiements: true,
      },
    });

    // Vérifier si le document n'est pas déjà complètement payé
    for (const doc of documents) {
      const totalPaye = doc.paiements.reduce(
        (sum, p) => sum + Number(p.montant),
        0
      );
      const reste = Number(doc.total_ttc) - totalPaye;

      if (reste > 0 && Math.abs(reste - montant) < 0.01) {
        return doc;
      }
    }

    // Rechercher par numéro de facture dans le libellé
    const factures = await prisma.document.findMany({
      where: {
        entrepriseId,
        type: "FACTURE",
      },
    });

    for (const facture of factures) {
      if (transaction.libelle.includes(facture.numero)) {
        return facture;
      }
    }

    return null;
  }

  /**
   * Rapprochement manuel
   */
  static async manualMatch({
    transactionId,
    documentId,
  }: {
    transactionId: string;
    documentId: string;
  }) {
    await prisma.bankTransaction.update({
      where: { id: transactionId },
      data: {
        documentId,
        statut: "MANUAL",
      },
    });
  }

  /**
   * Ignorer une transaction
   */
  static async ignoreTransaction(transactionId: string) {
    await prisma.bankTransaction.update({
      where: { id: transactionId },
      data: { statut: "IGNORED" },
    });
  }

  /**
   * Marquer comme anomalie
   */
  static async markAsAnomaly(transactionId: string, notes: string) {
    await prisma.bankTransaction.update({
      where: { id: transactionId },
      data: {
        statut: "ANOMALY",
        notes,
      },
    });
  }

  /**
   * Récupérer les transactions en attente
   */
  static async getPendingTransactions(entrepriseId: string) {
    return await prisma.bankTransaction.findMany({
      where: {
        entrepriseId,
        statut: "PENDING",
      },
      orderBy: { date: "desc" },
    });
  }

  /**
   * Récupérer toutes les transactions
   */
  static async getAllTransactions(entrepriseId: string) {
    return await prisma.bankTransaction.findMany({
      where: { entrepriseId },
      include: {
        document: {
          include: {
            client: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });
  }

  /**
   * Statistiques
   */
  static async getStats(entrepriseId: string) {
    const total = await prisma.bankTransaction.count({
      where: { entrepriseId },
    });

    const matched = await prisma.bankTransaction.count({
      where: {
        entrepriseId,
        statut: { in: ["MATCHED", "MANUAL"] },
      },
    });

    const pending = await prisma.bankTransaction.count({
      where: {
        entrepriseId,
        statut: "PENDING",
      },
    });

    const anomalies = await prisma.bankTransaction.count({
      where: {
        entrepriseId,
        statut: "ANOMALY",
      },
    });

    return {
      total,
      matched,
      pending,
      anomalies,
      matchRate: total > 0 ? ((matched / total) * 100).toFixed(1) : "0",
    };
  }
}
