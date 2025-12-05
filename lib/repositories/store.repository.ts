import { PrismaClient, Store, StoreStatus, Register } from "@/lib/generated/prisma";
import { BaseRepository, PaginationParams } from "./base.repository";

export interface StoreWithRelations extends Store {
  registers?: Register[];
  _count?: {
    documents: number;
    stockItems: number;
  };
}

export class StoreRepository extends BaseRepository<Store> {
  constructor(prisma: PrismaClient) {
    super(prisma, "store");
  }

  /**
   * Find stores by entreprise with optional filters
   */
  async findByEntreprise(
    entrepriseId: string,
    search?: string,
    pagination?: PaginationParams,
    filters?: { status?: StoreStatus; isMainStore?: boolean }
  ) {
    const where: Record<string, unknown> = { entrepriseId };

    if (search) {
      where.OR = [
        { nom: { contains: search, mode: "insensitive" as const } },
        { code: { contains: search, mode: "insensitive" as const } },
        { ville: { contains: search, mode: "insensitive" as const } },
      ];
    }

    if (filters) {
      if (filters.status) where.status = filters.status;
      if (filters.isMainStore !== undefined) where.isMainStore = filters.isMainStore;
    }

    return this.findAll(
      where,
      pagination,
      {
        registers: true,
        _count: {
          select: { documents: true, stockItems: true },
        },
      },
      [{ isMainStore: "desc" }, { createdAt: "asc" }]
    );
  }

  /**
   * Find store by code
   */
  async findByCode(code: string, entrepriseId: string): Promise<Store | null> {
    return this.findFirst({ code, entrepriseId });
  }

  /**
   * Find main store for entreprise
   */
  async findMainStore(entrepriseId: string): Promise<Store | null> {
    return this.findFirst({ entrepriseId, isMainStore: true });
  }

  /**
   * Check if store has documents
   */
  async hasDocuments(storeId: string): Promise<boolean> {
    const count = await this.prisma.document.count({
      where: { storeId },
    });
    return count > 0;
  }

  /**
   * Check if store has stock items
   */
  async hasStockItems(storeId: string): Promise<boolean> {
    const count = await this.prisma.storeStockItem.count({
      where: { storeId },
    });
    return count > 0;
  }

  /**
   * Update store status
   */
  async updateStatus(storeId: string, status: StoreStatus): Promise<Store> {
    return this.update(storeId, { status });
  }

  /**
   * Set store as main store (and unset others)
   */
  async setAsMainStore(storeId: string, entrepriseId: string): Promise<Store> {
    // Transaction to unset all other main stores and set this one
    return await this.prisma.$transaction(async (tx) => {
      // Unset all main stores for this entreprise
      await tx.store.updateMany({
        where: { entrepriseId, isMainStore: true },
        data: { isMainStore: false },
      });

      // Set this store as main
      return await tx.store.update({
        where: { id: storeId },
        data: { isMainStore: true },
      });
    });
  }
}
