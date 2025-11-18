import { PrismaClient, Automation, TriggerType, ActionType } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { PaginationParams } from "@/lib/types";

export class AutomationRepository extends BaseRepository<Automation> {
  constructor(prisma: PrismaClient) {
    super(prisma, "automation");
  }

  /**
   * Find automations by entreprise with filters
   */
  async findByEntreprise(
    entrepriseId: string,
    search?: string,
    pagination?: PaginationParams,
    filters?: { actif?: boolean; triggerType?: TriggerType; actionType?: ActionType }
  ) {
    const where: Record<string, unknown> = { entrepriseId };

    if (search) {
      where.OR = [
        { nom: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ];
    }

    if (filters) {
      if (filters.actif !== undefined) where.actif = filters.actif;
      if (filters.triggerType) where.triggerType = filters.triggerType;
      if (filters.actionType) where.actionType = filters.actionType;
    }

    return this.findAll(
      where,
      pagination,
      {
        _count: {
          select: { executions: true },
        },
      },
      { createdAt: "desc" }
    );
  }

  /**
   * Find active automations by trigger type
   */
  async findActiveByTriggerType(
    entrepriseId: string,
    triggerType: TriggerType
  ): Promise<Automation[]> {
    return await this.prisma.automation.findMany({
      where: {
        entrepriseId,
        actif: true,
        triggerType,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Update execution statistics
   */
  async incrementExecutionCount(automationId: string): Promise<Automation> {
    return await this.prisma.automation.update({
      where: { id: automationId },
      data: {
        nombreExecutions: { increment: 1 },
        derniereExecution: new Date(),
      },
    });
  }

  /**
   * Toggle automation active status
   */
  async toggleStatus(automationId: string): Promise<Automation> {
    const automation = await this.findByIdOrFail(automationId);
    return this.update(automationId, { actif: !automation.actif });
  }

  /**
   * Get automation execution history
   */
  async getExecutions(
    automationId: string,
    pagination?: PaginationParams
  ) {
    const where = { automationId };

    const [executions, total] = await Promise.all([
      this.prisma.automationExecution.findMany({
        where,
        orderBy: { executedAt: "desc" },
        skip: pagination?.skip || 0,
        take: pagination?.limit || 50,
      }),
      this.prisma.automationExecution.count({ where }),
    ]);

    return {
      items: executions,
      total,
      page: pagination?.page || 1,
      limit: pagination?.limit || 50,
      totalPages: Math.ceil(total / (pagination?.limit || 50)),
    };
  }

  /**
   * Get automation statistics
   */
  async getStatistics(automationId: string) {
    const [successCount, failedCount, lastExecutions] = await Promise.all([
      this.prisma.automationExecution.count({
        where: { automationId, statut: "SUCCESS" },
      }),
      this.prisma.automationExecution.count({
        where: { automationId, statut: "FAILED" },
      }),
      this.prisma.automationExecution.findMany({
        where: { automationId },
        orderBy: { executedAt: "desc" },
        take: 10,
      }),
    ]);

    return {
      successCount,
      failedCount,
      totalCount: successCount + failedCount,
      successRate: (successCount / (successCount + failedCount)) * 100 || 0,
      lastExecutions,
    };
  }
}
