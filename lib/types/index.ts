/**
 * Centralized type definitions
 * Eliminates duplicate interfaces across components
 */

// Re-export Prisma generated types
export type {
  Article,
  Categorie,
  Client,
  Document,
  LigneDocument,
  Paiement,
  User,
  ParametresEntreprise,
  Segment,
} from "@/lib/generated/prisma";

// Re-export enums
export { DocumentType, DocumentStatut, MoyenPaiement, TypeSegment } from "@/lib/generated/prisma";

// Re-export client-safe segment types (for use in client components)
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

// Re-export server-side segment types and functions
export type {
  SegmentDisplay,
  SegmentWithClients,
  SegmentStats,
  BulkEmailPayload,
  ExportSegmentPayload,
  SegmentComparison,
  SegmentWithRelations,
} from "./segment";

export {
  applySegmentCriteria,
  mapSegmentToDisplay,
  getSegmentIcon,
  getSegmentColor,
  TypeSegment,
} from "./segment";
