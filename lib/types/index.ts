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

// Re-export import-export types
export type {
  ImportExportStats,
  ExportOptions,
  ImportOptions,
  ImportResult,
  ExportData,
  CSVMapping,
  ValidationError,
  ParsedCSVRow,
} from "./import-export";

// Re-export reservation types
export type {
  Reservation,
  ReservationStats,
  CreateReservationData,
} from "./reservation";

export { ReservationStatut } from "./reservation";

// Re-export subscription types
export type {
  TimelineStepProps,
  BenefitItemProps,
  ConfettiConfig,
} from "./subscription";

// Re-export error types
export type {
  NextJsError,
  ErrorPageProps,
} from "./error";
