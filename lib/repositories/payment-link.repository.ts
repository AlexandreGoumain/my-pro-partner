import { PrismaClient, PaymentLink } from "@/lib/generated/prisma";
import { BaseRepository, PaginationParams } from "./base.repository";

export class PaymentLinkRepository extends BaseRepository<PaymentLink> {
  constructor(prisma: PrismaClient) {
    super(prisma, "paymentLink");
  }

  /**
   * Find payment links by entreprise with filters
   */
  async findByEntreprise(
    entrepriseId: string,
    search?: string,
    pagination?: PaginationParams,
    filters?: { actif?: boolean; expired?: boolean }
  ) {
    const where: Record<string, unknown> = { entrepriseId };

    if (search) {
      where.OR = [
        { titre: { contains: search, mode: "insensitive" as const } },
        { slug: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ];
    }

    if (filters) {
      if (filters.actif !== undefined) where.actif = filters.actif;
      if (filters.expired === true) {
        where.dateExpiration = { lt: new Date() };
      } else if (filters.expired === false) {
        where.OR = [
          { dateExpiration: null },
          { dateExpiration: { gte: new Date() } },
        ];
      }
    }

    return this.findAll(where, pagination, undefined, { createdAt: "desc" });
  }

  /**
   * Find by slug
   */
  async findBySlug(slug: string): Promise<PaymentLink | null> {
    return this.findFirst({ slug });
  }

  /**
   * Increment payment count
   */
  async incrementPaymentCount(paymentLinkId: string): Promise<PaymentLink> {
    return await this.prisma.paymentLink.update({
      where: { id: paymentLinkId },
      data: { quantitePaye: { increment: 1 } },
    });
  }

  /**
   * Check if payment link is still valid
   */
  async isValid(paymentLinkId: string): Promise<boolean> {
    const link = await this.findById(paymentLinkId);
    if (!link || !link.actif) return false;

    if (link.dateExpiration && link.dateExpiration < new Date()) return false;

    if (link.quantiteMax && link.quantitePaye >= link.quantiteMax) return false;

    return true;
  }
}
