/**
 * Client-safe segment filtering utilities
 * Does not import Prisma types - safe for use in client components
 */

import type {
  SegmentCriterion,
  SegmentCriteria,
  PredefinedSegmentType,
} from "@/lib/types/segment-client";

// Generic client type that matches the structure we need
export type ClientLike = {
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  telephone?: string | null;
  ville?: string | null;
  codePostal?: string | null;
  pays?: string | null;
  points_solde?: number;
  niveauFideliteId?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

/**
 * Apply segment criteria to filter clients
 */
export function applySegmentCriteria<T extends Partial<ClientLike>>(
  clients: T[],
  criteria: SegmentCriteria
): T[] {
  // Handle predefined segments
  if ("type" in criteria) {
    return applyPredefinedSegment(clients, criteria.type);
  }

  // Handle custom segments
  const { conditions, logic = "AND" } = criteria;

  return clients.filter((client) => {
    const results = conditions.map((condition) =>
      evaluateCondition(client, condition)
    );

    return logic === "AND"
      ? results.every((result) => result)
      : results.some((result) => result);
  });
}

function applyPredefinedSegment<T extends Partial<ClientLike>>(
  clients: T[],
  type: PredefinedSegmentType
): T[] {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  switch (type) {
    case "all":
      return clients;
    case "with-email":
      return clients.filter((c) => c.email && c.email.trim() !== "");
    case "with-phone":
      return clients.filter((c) => c.telephone && c.telephone.trim() !== "");
    case "with-loyalty":
      return clients.filter((c) => (c.points_solde ?? 0) > 0);
    case "recent":
      return clients.filter((c) => c.createdAt && new Date(c.createdAt) >= thirtyDaysAgo);
    case "inactive":
      return clients.filter((c) => c.updatedAt && new Date(c.updatedAt) <= ninetyDaysAgo);
    case "vip":
      return clients.filter((c) => (c.points_solde ?? 0) > 100);
    default:
      return clients;
  }
}

function evaluateCondition<T extends Partial<ClientLike>>(
  client: T,
  condition: SegmentCriterion
): boolean {
  const fieldValue = (client as Record<string, unknown>)[condition.field];
  const { operator, value } = condition;

  switch (operator) {
    case "eq":
      return fieldValue === value;
    case "ne":
      return fieldValue !== value;
    case "gt":
      return typeof fieldValue === "number" && typeof value === "number"
        ? fieldValue > value
        : false;
    case "gte":
      return typeof fieldValue === "number" && typeof value === "number"
        ? fieldValue >= value
        : false;
    case "lt":
      return typeof fieldValue === "number" && typeof value === "number"
        ? fieldValue < value
        : false;
    case "lte":
      return typeof fieldValue === "number" && typeof value === "number"
        ? fieldValue <= value
        : false;
    case "contains":
      return typeof fieldValue === "string" && typeof value === "string"
        ? fieldValue.toLowerCase().includes(value.toLowerCase())
        : false;
    case "startsWith":
      return typeof fieldValue === "string" && typeof value === "string"
        ? fieldValue.toLowerCase().startsWith(value.toLowerCase())
        : false;
    case "endsWith":
      return typeof fieldValue === "string" && typeof value === "string"
        ? fieldValue.toLowerCase().endsWith(value.toLowerCase())
        : false;
    case "exists":
      return fieldValue !== null && fieldValue !== undefined && fieldValue !== "";
    case "notExists":
      return fieldValue === null || fieldValue === undefined || fieldValue === "";
    case "in":
      return Array.isArray(value)
        ? (value as (string | number)[]).includes(fieldValue as string | number)
        : false;
    case "notIn":
      return Array.isArray(value)
        ? !(value as (string | number)[]).includes(fieldValue as string | number)
        : true;
    default:
      return false;
  }
}
