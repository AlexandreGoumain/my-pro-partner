import { PrismaClient, Document } from "@/lib/generated/prisma";
import { BaseRepository, PaginationParams } from "./base.repository";

/**
 * Document repository
 * Handles all database operations for documents (invoices, quotes, credits)
 */
export class DocumentRepository extends BaseRepository<Document> {
  constructor(prisma: PrismaClient) {
    super(prisma, "document");
  }

  /**
   * Find document by reference number within a specific entreprise
   */
  async findByNumero(
    numero: string,
    entrepriseId: string
  ): Promise<Document | null> {
    return this.findFirst({
      numero,
      entrepriseId,
    });
  }

  /**
   * Find all documents for an entreprise with search and filters
   */
  async findByEntreprise(
    entrepriseId: string,
    search?: string,
    pagination?: PaginationParams,
    filters?: {
      type?: "DEVIS" | "FACTURE" | "AVOIR";
      statut?: string;
      clientId?: string;
      dateFrom?: Date;
      dateTo?: Date;
    }
  ) {
    const where: Record<string, unknown> = {
      entrepriseId,
    };

    // Add search filter
    if (search) {
      where.OR = [
        { numero: { contains: search, mode: "insensitive" } },
        { client: { nom: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Add type filter
    if (filters?.type) {
      where.type = filters.type;
    }

    // Add status filter
    if (filters?.statut) {
      where.statut = filters.statut;
    }

    // Add client filter
    if (filters?.clientId) {
      where.clientId = filters.clientId;
    }

    // Add date range filter
    if (filters?.dateFrom || filters?.dateTo) {
      const dateFilter: { gte?: Date; lte?: Date } = {};
      if (filters.dateFrom) {
        dateFilter.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        dateFilter.lte = filters.dateTo;
      }
      where.dateEmission = dateFilter;
    }

    return this.findAll(
      where,
      pagination,
      {
        client: true,
        lignes: {
          include: {
            article: true,
          },
        },
      },
      { dateEmission: "desc" }
    );
  }

  /**
   * Find documents by client
   */
  async findByClient(
    clientId: string,
    entrepriseId: string,
    type?: "DEVIS" | "FACTURE" | "AVOIR"
  ): Promise<Document[]> {
    const where: Record<string, unknown> = {
      clientId,
      entrepriseId,
    };

    if (type) {
      where.type = type;
    }

    const result = await this.findAll(where, undefined, {
      lignes: {
        include: {
          article: true,
        },
      },
    });

    return result.items;
  }

  /**
   * Find unpaid invoices for a client
   */
  async findUnpaidInvoices(
    clientId: string,
    entrepriseId: string
  ): Promise<Document[]> {
    const result = await this.findAll({
      clientId,
      entrepriseId,
      type: "FACTURE",
      statut: { not: "PAYE" },
    });

    return result.items;
  }

  /**
   * Find overdue invoices
   */
  async findOverdueInvoices(entrepriseId: string): Promise<Document[]> {
    const today = new Date();
    const result = await this.findAll({
      entrepriseId,
      type: "FACTURE",
      statut: { not: "PAYE" },
      dateEcheance: { lt: today },
    });

    return result.items;
  }

  /**
   * Calculate total revenue for a period
   */
  async calculateRevenue(
    entrepriseId: string,
    dateFrom: Date,
    dateTo: Date,
    type: "FACTURE" | "DEVIS" | "AVOIR" = "FACTURE"
  ): Promise<number> {
    const documents = await this.findAll({
      entrepriseId,
      type,
      statut: "PAYE",
      dateEmission: {
        gte: dateFrom,
        lte: dateTo,
      },
    });

    return documents.items.reduce((sum, doc) => sum + Number(doc.total_ttc || 0), 0);
  }

  /**
   * Count documents by type
   */
  async countByType(
    entrepriseId: string,
    type: "DEVIS" | "FACTURE" | "AVOIR"
  ): Promise<number> {
    return this.count({
      entrepriseId,
      type,
    });
  }

  /**
   * Count documents by status
   */
  async countByStatus(
    entrepriseId: string,
    statut: string,
    type?: "DEVIS" | "FACTURE" | "AVOIR"
  ): Promise<number> {
    const where: Record<string, unknown> = {
      entrepriseId,
      statut,
    };

    if (type) {
      where.type = type;
    }

    return this.count(where);
  }

  /**
   * Update document status
   */
  async updateStatus(
    documentId: string,
    statut: string
  ): Promise<Document> {
    return this.update(documentId, { statut });
  }

  /**
   * Mark invoice as paid
   */
  async markAsPaid(
    documentId: string,
    datePaiement?: Date
  ): Promise<Document> {
    return this.update(documentId, {
      statut: "PAYE",
      datePaiement: datePaiement || new Date(),
    });
  }

  /**
   * Convert quote to invoice
   */
  async convertQuoteToInvoice(
    quoteId: string,
    newNumero: string
  ): Promise<Document> {
    const quote = await this.findByIdOrFail(quoteId);

    if (quote.type !== "DEVIS") {
      throw new Error("Le document n'est pas un devis");
    }

    // This would typically create a new invoice based on the quote
    // For now, just update the type and number
    return this.update(quoteId, {
      type: "FACTURE",
      numero: newNumero,
      statut: "IMPAYE",
    });
  }

  /**
   * Get document statistics for dashboard
   */
  async getStatistics(entrepriseId: string) {
    const [
      totalInvoices,
      paidInvoices,
      unpaidInvoices,
      overdueInvoices,
      totalQuotes,
      acceptedQuotes,
    ] = await Promise.all([
      this.countByType(entrepriseId, "FACTURE"),
      this.countByStatus(entrepriseId, "PAYE", "FACTURE"),
      this.countByStatus(entrepriseId, "IMPAYE", "FACTURE"),
      this.count({
        entrepriseId,
        type: "FACTURE",
        statut: { not: "PAYE" },
        dateEcheance: { lt: new Date() },
      }),
      this.countByType(entrepriseId, "DEVIS"),
      this.countByStatus(entrepriseId, "ACCEPTE", "DEVIS"),
    ]);

    return {
      invoices: {
        total: totalInvoices,
        paid: paidInvoices,
        unpaid: unpaidInvoices,
        overdue: overdueInvoices,
      },
      quotes: {
        total: totalQuotes,
        accepted: acceptedQuotes,
      },
    };
  }
}
