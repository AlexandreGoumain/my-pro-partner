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
    ParametresEntreprise,
    Segment,
    User,
} from "@/lib/generated/prisma";

// Re-export enums
export {
    DocumentStatut,
    DocumentType,
    MoyenPaiement,
} from "@/lib/generated/prisma";

// Re-export client-safe segment types (for use in client components)
export type {
    CreateSegmentForm,
    CustomSegmentCriteria,
    PredefinedSegmentCriteria,
    PredefinedSegmentType,
    SegmentCriteria,
    SegmentCriterion,
    SegmentField,
    SegmentOperator,
    UpdateSegmentForm,
} from "./segment-client";

// Re-export server-side segment types and functions
export type {
    BulkEmailPayload,
    ExportSegmentPayload,
    SegmentComparison,
    SegmentDisplay,
    SegmentStats,
    SegmentWithClients,
    SegmentWithRelations,
} from "./segment";

export {
    applySegmentCriteria,
    getSegmentColor,
    getSegmentIcon,
    mapSegmentToDisplay,
    TypeSegment,
} from "./segment";

// Re-export import-export types
export type {
    CSVMapping,
    ExportData,
    ExportOptions,
    ImportExportStats,
    ImportOptions,
    ImportResult,
    ParsedCSVRow,
    ValidationError,
} from "./import-export";

// Re-export reservation types
export type {
    CreateReservationData,
    Reservation,
    ReservationStats,
} from "./reservation";

export { ReservationStatut } from "./reservation";

// Re-export subscription types
export type {
    BenefitItemProps,
    ConfettiConfig,
    TimelineStepProps,
} from "./subscription";

// Re-export error types
export type { ErrorPageProps, NextJsError } from "./error";

// Re-export CRUD factory types
export type {
    CrudConfig,
    CrudHooks,
    CrudPermissions,
    CrudRouteHandlers,
    ErrorContext,
    PaginationParams,
    PrismaModelDelegate,
    ResourceByIdRouteHandlers,
    TenantResource,
} from "./crud";
