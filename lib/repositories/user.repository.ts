import { PrismaClient, User, UserRole, UserStatus } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { PaginationParams } from "@/lib/types";

export class UserRepository extends BaseRepository<User> {
  constructor(prisma: PrismaClient) {
    super(prisma, "user");
  }

  /**
   * Find users by entreprise with filters
   */
  async findByEntreprise(
    entrepriseId: string,
    search?: string,
    pagination?: PaginationParams,
    filters?: { role?: UserRole; status?: UserStatus }
  ) {
    const where: Record<string, unknown> = { entrepriseId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" as const } },
        { prenom: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { poste: { contains: search, mode: "insensitive" as const } },
        { departement: { contains: search, mode: "insensitive" as const } },
      ];
    }

    if (filters) {
      if (filters.role) where.role = filters.role;
      if (filters.status) where.status = filters.status;
    }

    return this.findAll(
      where,
      pagination,
      {
        permissions: true,
      },
      { createdAt: "desc" }
    );
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.findFirst({ email });
  }

  /**
   * Find user by email in specific entreprise
   */
  async findByEmailInEntreprise(
    email: string,
    entrepriseId: string
  ): Promise<User | null> {
    return this.findFirst({ email, entrepriseId });
  }

  /**
   * Count users by entreprise
   */
  async countByEntreprise(entrepriseId: string): Promise<number> {
    return this.count({ entrepriseId });
  }

  /**
   * Count active users by entreprise
   */
  async countActiveByEntreprise(entrepriseId: string): Promise<number> {
    return this.count({
      entrepriseId,
      status: { in: ["ACTIVE", "INVITED"] as UserStatus[] },
    });
  }

  /**
   * Find users by role
   */
  async findByRole(
    entrepriseId: string,
    role: UserRole,
    pagination?: PaginationParams
  ) {
    return this.findAll(
      { entrepriseId, role },
      pagination,
      { permissions: true },
      { createdAt: "desc" }
    );
  }

  /**
   * Find users by status
   */
  async findByStatus(
    entrepriseId: string,
    status: UserStatus,
    pagination?: PaginationParams
  ) {
    return this.findAll(
      { entrepriseId, status },
      pagination,
      { permissions: true },
      { createdAt: "desc" }
    );
  }

  /**
   * Update user status
   */
  async updateStatus(userId: string, status: UserStatus): Promise<User> {
    return this.update(userId, { status });
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId: string): Promise<User> {
    return this.update(userId, {
      lastLoginAt: new Date(),
      lastActivityAt: new Date(),
    });
  }

  /**
   * Update last activity timestamp
   */
  async updateLastActivity(userId: string): Promise<User> {
    return this.update(userId, { lastActivityAt: new Date() });
  }

  /**
   * Check if user has completed onboarding
   */
  async hasCompletedOnboarding(userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    return user?.onboardingComplete || false;
  }

  /**
   * Mark onboarding as complete
   */
  async completeOnboarding(userId: string): Promise<User> {
    return this.update(userId, { onboardingComplete: true });
  }

  /**
   * Find users by department
   */
  async findByDepartment(
    entrepriseId: string,
    departement: string,
    pagination?: PaginationParams
  ) {
    return this.findAll(
      { entrepriseId, departement },
      pagination,
      { permissions: true },
      { name: "asc" }
    );
  }

  /**
   * Get user with full details (permissions, schedules, etc.)
   */
  async findByIdWithDetails(
    userId: string,
    entrepriseId: string
  ): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        id: userId,
        entrepriseId,
      },
      include: {
        permissions: true,
        schedules: {
          orderBy: { dayOfWeek: "asc" },
        },
        _count: {
          select: {
            timeEntries: true,
            mouvementsStock: true,
          },
        },
      },
    });
  }
}
