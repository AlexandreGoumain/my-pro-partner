import { PrismaClient } from "@/lib/generated/prisma";
import { NotFoundError } from "@/lib/errors";

/**
 * Pagination parameters
 */
export interface PaginationParams {
  skip: number;
  take: number;
  page: number;
  limit: number;
  [key: string]: unknown;
}

/**
 * Paginated response
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Base repository class
 * Provides common CRUD operations for all entities
 *
 * @template T - The entity type
 */
export abstract class BaseRepository<T> {
  constructor(
    protected prisma: PrismaClient,
    protected modelName: string
  ) {}

  /**
   * Get the Prisma model delegate
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected get model(): any {
    return (this.prisma as any)[this.modelName];
  }

  /**
   * Find all records with optional filtering and pagination
   */
  async findAll(
    where: Record<string, unknown> = {},
    pagination?: PaginationParams,
    include?: Record<string, unknown>,
    orderBy?: Record<string, unknown> | Record<string, unknown>[]
  ): Promise<PaginatedResult<T>> {
    const [items, total] = await Promise.all([
      this.model.findMany({
        where,
        ...(pagination && { skip: pagination.skip, take: pagination.take }),
        ...(include && { include }),
        ...(orderBy && { orderBy }),
      }),
      this.model.count({ where }),
    ]);

    return {
      items: items as T[],
      total,
      page: pagination?.page || 1,
      limit: pagination?.limit || total,
      totalPages: pagination ? Math.ceil(total / pagination.limit) : 1,
    };
  }

  /**
   * Find a single record by ID
   */
  async findById(
    id: string,
    include?: Record<string, unknown>
  ): Promise<T | null> {
    const record = await this.model.findUnique({
      where: { id },
      ...(include && { include }),
    });

    return record as T | null;
  }

  /**
   * Find a single record by ID or throw NotFoundError
   */
  async findByIdOrFail(
    id: string,
    include?: Record<string, unknown>
  ): Promise<T> {
    const record = await this.findById(id, include);

    if (!record) {
      throw new NotFoundError(this.modelName, id);
    }

    return record;
  }

  /**
   * Find first record matching criteria
   */
  async findFirst(
    where: Record<string, unknown>,
    include?: Record<string, unknown>
  ): Promise<T | null> {
    const record = await this.model.findFirst({
      where,
      ...(include && { include }),
    });

    return record as T | null;
  }

  /**
   * Find unique record
   */
  async findUnique(
    where: Record<string, unknown>,
    include?: Record<string, unknown>
  ): Promise<T | null> {
    const record = await this.model.findUnique({
      where,
      ...(include && { include }),
    });

    return record as T | null;
  }

  /**
   * Create a new record
   */
  async create(data: Record<string, unknown>, include?: Record<string, unknown>): Promise<T> {
    const record = await this.model.create({
      data,
      ...(include && { include }),
    });

    return record as T;
  }

  /**
   * Update a record by ID
   */
  async update(
    id: string,
    data: Record<string, unknown>,
    include?: Record<string, unknown>
  ): Promise<T> {
    const record = await this.model.update({
      where: { id },
      data,
      ...(include && { include }),
    });

    return record as T;
  }

  /**
   * Update many records
   */
  async updateMany(
    where: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<{ count: number }> {
    const result = await this.model.updateMany({
      where,
      data,
    });

    return { count: result.count };
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string): Promise<T> {
    const record = await this.model.delete({
      where: { id },
    });

    return record as T;
  }

  /**
   * Delete many records
   */
  async deleteMany(where: Record<string, unknown>): Promise<{ count: number }> {
    const result = await this.model.deleteMany({
      where,
    });

    return { count: result.count };
  }

  /**
   * Count records matching criteria
   */
  async count(where: Record<string, unknown> = {}): Promise<number> {
    return this.model.count({ where });
  }

  /**
   * Check if record exists
   */
  async exists(where: Record<string, unknown>): Promise<boolean> {
    const count = await this.count(where);
    return count > 0;
  }

  /**
   * Check if a record exists with a specific field value
   * Useful for uniqueness checks
   */
  async existsByField(
    field: string,
    value: unknown,
    entrepriseId: string,
    excludeId?: string
  ): Promise<boolean> {
    const where: Record<string, unknown> = {
      entrepriseId,
      [field]: value,
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    return this.exists(where);
  }

  /**
   * Execute a raw query
   */
  async raw(query: string, params?: unknown[]): Promise<unknown> {
    return this.prisma.$queryRawUnsafe(query, ...(params || []));
  }

  /**
   * Execute operations in a transaction
   */
  async transaction<R>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (tx: any) => Promise<R>
  ): Promise<R> {
    return this.prisma.$transaction(callback);
  }
}
