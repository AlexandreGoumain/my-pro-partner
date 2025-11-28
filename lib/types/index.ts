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

// Re-export Mission types (Consulting / SERVICE_INTELLECTUEL)
export type {
    ConsultingDashboardData,
    ConsultingStats,
    EntreeTemps,
    EntreeTempsCreateInput,
    EntreeTempsFilters,
    EntreeTempsUpdateInput,
    Mission,
    MissionCreateInput,
    MissionFilters,
    MissionStats,
    MissionUpdateInput,
    MissionWithDetails,
    StatutMission,
    TimerStartInput,
    TimerStopInput,
    TimesheetDay,
    TimesheetWeek,
    TypeFacturation,
} from "./mission";

export {
    calculateBudgetProgress,
    canTransitionTo,
    formatDuree,
    formatDureeDecimal,
    minutesToHHMM,
    parseHHMMToMinutes,
    STATUT_MISSION,
    STATUT_MISSION_COLORS,
    STATUT_MISSION_LABELS,
    STATUT_MISSION_TRANSITIONS,
    TYPE_FACTURATION,
    TYPE_FACTURATION_DESCRIPTIONS,
    TYPE_FACTURATION_LABELS,
} from "./mission";
