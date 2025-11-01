import { Segment as PrismaSegment, TypeSegment, Client } from "@/lib/generated/prisma";

// Re-export Prisma types
export { TypeSegment };
export type SegmentWithRelations = PrismaSegment;

// Re-export client-safe types from segment-client.ts
export type {
  SegmentOperator,
  SegmentField,
  SegmentCriterion,
  CustomSegmentCriteria,
  PredefinedSegmentType,
  PredefinedSegmentCriteria,
  SegmentCriteria,
  CreateSegmentForm,
  UpdateSegmentForm,
} from "./segment-client";

// ============================================
// DISPLAY TYPES
// ============================================

export interface SegmentDisplay {
  id: string;
  nom: string;
  description: string | null;
  type: TypeSegment;
  icone: string | null;
  couleur: string | null;
  nombreClients: number;
  derniereCalcul: Date | null;
  actif: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SegmentWithClients extends SegmentDisplay {
  clients: Client[];
}

export interface SegmentStats {
  segmentId: string;
  segmentNom: string;
  nombreClients: number;
  pourcentage: number;
  evolutionMois?: number; // Evolution vs last month
}

// ============================================
// ACTION TYPES
// ============================================

export interface SegmentAction {
  id: string;
  label: string;
  icon: string;
  action: (segmentId: string) => void | Promise<void>;
  variant?: "default" | "destructive" | "outline";
}

export interface BulkEmailPayload {
  segmentId: string;
  subject: string;
  body: string;
  clientIds?: string[]; // Optional: override segment clients
}

export interface ExportSegmentPayload {
  segmentId: string;
  format: "csv" | "json" | "xlsx";
  fields?: string[]; // Fields to include
}

// ============================================
// COMPARISON TYPES
// ============================================

export interface SegmentComparison {
  segments: SegmentDisplay[];
  overlap: number; // Number of clients in both segments
  uniqueToFirst: number;
  uniqueToSecond: number;
  commonClients: Client[];
}


// ============================================
// MAPPER FUNCTIONS
// ============================================

export function mapSegmentToDisplay(segment: SegmentWithRelations): SegmentDisplay {
  return {
    id: segment.id,
    nom: segment.nom,
    description: segment.description,
    type: segment.type,
    icone: segment.icone,
    couleur: segment.couleur,
    nombreClients: segment.nombreClients ?? 0,
    derniereCalcul: segment.derniereCalcul,
    actif: segment.actif,
    createdAt: segment.createdAt,
    updatedAt: segment.updatedAt,
  };
}

// ============================================
// SEGMENT FILTER FUNCTION
// ============================================

import type { SegmentCriterion, SegmentCriteria, PredefinedSegmentType } from "./segment-client";

/**
 * Apply segment criteria to filter clients
 * Generic to work with both Client type and plain objects
 */
export function applySegmentCriteria(
  clients: Client[],
  criteria: SegmentCriteria
): Client[] {
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

function applyPredefinedSegment(
  clients: Client[],
  type: PredefinedSegmentType
): Client[] {
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
      return clients.filter((c) => c.points_solde > 0);
    case "recent":
      return clients.filter((c) => new Date(c.createdAt) >= thirtyDaysAgo);
    case "inactive":
      return clients.filter((c) => new Date(c.updatedAt) <= ninetyDaysAgo);
    case "vip":
      return clients.filter((c) => c.points_solde > 100);
    default:
      return clients;
  }
}

function evaluateCondition(
  client: Client,
  condition: SegmentCriterion
): boolean {
  const fieldValue = client[condition.field as keyof Client];
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
      return Array.isArray(value) ? (value as (string | number)[]).includes(fieldValue as string | number) : false;
    case "notIn":
      return Array.isArray(value) ? !(value as (string | number)[]).includes(fieldValue as string | number) : true;
    default:
      return false;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getSegmentIcon(type: PredefinedSegmentType | string): string {
  const iconMap: Record<string, string> = {
    all: "Users",
    "with-email": "Mail",
    "with-phone": "Phone",
    "by-city": "MapPin",
    recent: "Clock",
    inactive: "UserX",
    loyalty: "Star",
  };

  return iconMap[type] || "Filter";
}

export function getSegmentColor(type: PredefinedSegmentType | string): string {
  const colorMap: Record<string, string> = {
    all: "#f3f4f6",
    "with-email": "#f3f4f6",
    "with-phone": "#f3f4f6",
    "by-city": "#f3f4f6",
    recent: "#f3f4f6",
    inactive: "#f3f4f6",
    loyalty: "#f3f4f6",
  };

  return colorMap[type] || "#f3f4f6";
}
