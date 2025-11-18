import { PrismaClient, Terminal, TerminalStatus } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { PaginationParams } from "@/lib/types";

export class TerminalRepository extends BaseRepository<Terminal> {
  constructor(prisma: PrismaClient) {
    super(prisma, "terminal");
  }

  /**
   * Find terminals by entreprise with optional status filter
   */
  async findByEntreprise(
    entrepriseId: string,
    search?: string,
    pagination?: PaginationParams,
    filters?: { status?: TerminalStatus }
  ) {
    const where: Record<string, unknown> = { entrepriseId };

    if (search) {
      where.OR = [
        { label: { contains: search, mode: "insensitive" as const } },
        { location: { contains: search, mode: "insensitive" as const } },
        { stripeTerminalId: { contains: search, mode: "insensitive" as const } },
      ];
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.findAll(where, pagination, undefined, { createdAt: "desc" });
  }

  /**
   * Find by Stripe Terminal ID
   */
  async findByStripeTerminalId(stripeTerminalId: string): Promise<Terminal | null> {
    return this.findFirst({ stripeTerminalId });
  }

  /**
   * Update terminal status
   */
  async updateStatus(terminalId: string, status: TerminalStatus): Promise<Terminal> {
    return this.update(terminalId, { status, lastSyncAt: new Date() });
  }

  /**
   * Update last used timestamp
   */
  async updateLastUsed(terminalId: string): Promise<Terminal> {
    return this.update(terminalId, { lastUsedAt: new Date() });
  }
}
