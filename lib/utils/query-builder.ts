/**
 * Query Builder
 * Helps construct Prisma where clauses dynamically
 */

// Type for Prisma filter values
type FilterValue = string | number | boolean | Date | null | undefined;

// Type for range filters
interface RangeFilter {
  gte?: Date | number;
  lte?: Date | number;
}

// Type for array filters
interface ArrayFilter<T> {
  in?: T[];
  notIn?: T[];
}

// Type for string filters
interface StringFilter {
  contains: string;
  mode: "insensitive";
}

// Type for the where clause
type WhereClause = Record<string, FilterValue | RangeFilter | ArrayFilter<FilterValue> | StringFilter | WhereClause[]>;

export interface QueryBuilderOptions {
  entrepriseId: string;
  search?: string;
  searchFields?: string[];
  filters?: Record<string, FilterValue>;
}

/**
 * QueryBuilder class for building dynamic Prisma where clauses
 */
export class QueryBuilder {
  private where: WhereClause = {};

  constructor(entrepriseId: string) {
    this.where.entrepriseId = entrepriseId;
  }

  /**
   * Add search filter across multiple fields
   */
  addSearch(search: string | null, fields: string[]): this {
    if (search && fields.length > 0) {
      this.where.OR = fields.map((field) => ({
        [field]: { contains: search, mode: "insensitive" as const },
      }));
    }
    return this;
  }

  /**
   * Add a single filter
   */
  addFilter(key: string, value: FilterValue): this {
    if (value !== undefined && value !== null && value !== "") {
      this.where[key] = value;
    }
    return this;
  }

  /**
   * Add multiple filters at once
   */
  addFilters(filters: Record<string, FilterValue>): this {
    Object.entries(filters).forEach(([key, value]) => {
      this.addFilter(key, value);
    });
    return this;
  }

  /**
   * Add a range filter (e.g., for dates or numbers)
   */
  addRange(key: string, min?: Date | number, max?: Date | number): this {
    if (min !== undefined || max !== undefined) {
      const range: RangeFilter = {};
      if (min !== undefined) range.gte = min;
      if (max !== undefined) range.lte = max;
      this.where[key] = range;
    }
    return this;
  }

  /**
   * Add a contains filter (case insensitive)
   */
  addContains(key: string, value: string | null): this {
    if (value) {
      this.where[key] = { contains: value, mode: "insensitive" as const };
    }
    return this;
  }

  /**
   * Add an IN filter (value in array)
   */
  addIn(key: string, values: FilterValue[] | null): this {
    if (values && values.length > 0) {
      this.where[key] = { in: values };
    }
    return this;
  }

  /**
   * Add a NOT IN filter (value not in array)
   */
  addNotIn(key: string, values: FilterValue[] | null): this {
    if (values && values.length > 0) {
      this.where[key] = { notIn: values };
    }
    return this;
  }

  /**
   * Add a boolean filter
   */
  addBoolean(key: string, value: boolean | string | null): this {
    if (value === true || value === "true") {
      this.where[key] = true;
    } else if (value === false || value === "false") {
      this.where[key] = false;
    }
    return this;
  }

  /**
   * Add a date range filter
   */
  addDateRange(key: string, from?: Date | string, to?: Date | string): this {
    if (from || to) {
      const range: RangeFilter = {};
      if (from) range.gte = new Date(from);
      if (to) range.lte = new Date(to);
      this.where[key] = range;
    }
    return this;
  }

  /**
   * Add a custom where clause
   */
  addCustom(whereClause: WhereClause): this {
    this.where = { ...this.where, ...whereClause };
    return this;
  }

  /**
   * Build and return the final where clause
   */
  build(): WhereClause {
    return this.where;
  }

  /**
   * Static helper to create a QueryBuilder with common filters
   */
  static create(options: QueryBuilderOptions): WhereClause {
    const builder = new QueryBuilder(options.entrepriseId);

    // Add search filter
    if (options.search && options.searchFields) {
      builder.addSearch(options.search, options.searchFields);
    }

    // Add custom filters
    if (options.filters) {
      builder.addFilters(options.filters);
    }

    return builder.build();
  }
}
