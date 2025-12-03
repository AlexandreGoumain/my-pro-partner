/**
 * Feature Catalog - All reusable features
 * Each feature can be enabled/disabled per business type
 *
 * This file re-exports all features from categorized modules
 * for better organization and maintainability.
 */

import { FeatureModule } from "@/lib/navigation/core/types";

// Core
export { DashboardFeature, ClientsFeature } from "./core";

// Products & Inventory
export {
    ProductsFeature,
    InventoryFeature,
    CatalogueFeature,
} from "./products";

// Documents
export { QuotesFeature, InvoicesFeature, CreditsFeature } from "./documents";

// Services & Appointments
export {
    AgendaFeature,
    PrestationsFeature,
    EquipeFeature,
    CabinesFeature,
    ReservationsFeature,
    TablesFeature,
    MenuFeature,
    POSFeature,
} from "./services";

// Marketing
export {
    LoyaltyFeature,
    SegmentsFeature,
    CampaignsFeature,
    AutomationsFeature,
} from "./marketing";

// Analytics
export { AnalyticsFeature } from "./analytics";

// Team
export { PersonnelFeature, TimeTrackingFeature, StoresFeature } from "./team";

// Finance
export {
    PaymentsFeature,
    PaymentLinksFeature,
    BankReconciliationFeature,
} from "./finance";

// Computer Shops
export { RepairsFeature, RachatsFeature, AtelierFeature } from "./computer-shop";

// Interventions (Plumbing/Heating)
export {
    InterventionsFeature,
    StockCamionnetteFeature,
    ContratsEntretienFeature,
    PlanningFeature,
    FlotteFeature,
    EquipementsFeature,
    EntretiensPlanifierFeature,
} from "./interventions";

// Fitness
export {
    AbonnementsFitnessFeature,
    CoursFitnessFeature,
    SallesFitnessFeature,
    CheckInFeature,
    CoachsFeature,
} from "./fitness";

// Consulting
export {
    MissionsFeature,
    TimesheetFeature,
    EcheancesFeature,
} from "./consulting";

// Legal
export {
    AffairesFeature,
    DiligencesFeature,
    EcheancesProcFeature,
} from "./legal";

// Real Estate - Agent
export {
    BiensImmoFeature,
    MandatsFeature,
    VisitesImmoFeature,
    EstimationsFeature,
    MatchingFeature,
    DiffusionFeature,
    PipelineFeature,
} from "./real-estate-agent";

// Real Estate - Rental
export {
    BauxFeature,
    LoyersFeature,
    ImpayesFeature,
    EtatsLieuxFeature,
    TravauxLocatifsFeature,
} from "./real-estate-rental";

// Real Estate - Syndic
export {
    CoproprietesFeature,
    LotsFeature,
    ChargesFeature,
    AGFeature,
    TravauxCoproFeature,
    ComptaCoproFeature,
    ConseilSyndicalFeature,
} from "./real-estate-syndic";

// Settings
export { IntegrationsFeature, SettingsFeature } from "./settings";

// Import all for catalog
import { DashboardFeature, ClientsFeature } from "./core";
import { ProductsFeature, InventoryFeature, CatalogueFeature } from "./products";
import { QuotesFeature, InvoicesFeature, CreditsFeature } from "./documents";
import {
    AgendaFeature,
    PrestationsFeature,
    EquipeFeature,
    CabinesFeature,
    ReservationsFeature,
    TablesFeature,
    MenuFeature,
    POSFeature,
} from "./services";
import {
    LoyaltyFeature,
    SegmentsFeature,
    CampaignsFeature,
    AutomationsFeature,
} from "./marketing";
import { AnalyticsFeature } from "./analytics";
import { PersonnelFeature, TimeTrackingFeature, StoresFeature } from "./team";
import {
    PaymentsFeature,
    PaymentLinksFeature,
    BankReconciliationFeature,
} from "./finance";
import { RepairsFeature, RachatsFeature, AtelierFeature } from "./computer-shop";
import {
    InterventionsFeature,
    StockCamionnetteFeature,
    ContratsEntretienFeature,
    PlanningFeature,
    FlotteFeature,
    EquipementsFeature,
    EntretiensPlanifierFeature,
} from "./interventions";
import {
    AbonnementsFitnessFeature,
    CoursFitnessFeature,
    SallesFitnessFeature,
    CheckInFeature,
    CoachsFeature,
} from "./fitness";
import { MissionsFeature, TimesheetFeature, EcheancesFeature } from "./consulting";
import { AffairesFeature, DiligencesFeature, EcheancesProcFeature } from "./legal";
import {
    BiensImmoFeature,
    MandatsFeature,
    VisitesImmoFeature,
    EstimationsFeature,
    MatchingFeature,
    DiffusionFeature,
    PipelineFeature,
} from "./real-estate-agent";
import {
    BauxFeature,
    LoyersFeature,
    ImpayesFeature,
    EtatsLieuxFeature,
    TravauxLocatifsFeature,
} from "./real-estate-rental";
import {
    CoproprietesFeature,
    LotsFeature,
    ChargesFeature,
    AGFeature,
    TravauxCoproFeature,
    ComptaCoproFeature,
    ConseilSyndicalFeature,
} from "./real-estate-syndic";
import { IntegrationsFeature, SettingsFeature } from "./settings";

// ============================================
// FEATURE CATALOG
// ============================================

export const FEATURE_CATALOG: Record<string, FeatureModule> = {
    // Core
    dashboard: DashboardFeature,
    clients: ClientsFeature,

    // Products & Inventory
    products: ProductsFeature,
    inventory: InventoryFeature,

    // Documents
    quotes: QuotesFeature,
    invoices: InvoicesFeature,
    credits: CreditsFeature,

    // Services & Appointments
    agenda: AgendaFeature,
    prestations: PrestationsFeature,
    equipe: EquipeFeature,
    cabines: CabinesFeature,
    reservations: ReservationsFeature,
    tables: TablesFeature,
    menu: MenuFeature,

    // Point of Sale
    pos: POSFeature,

    // Loyalty & Marketing
    loyalty: LoyaltyFeature,
    segments: SegmentsFeature,
    campaigns: CampaignsFeature,
    automations: AutomationsFeature,

    // Analytics
    analytics: AnalyticsFeature,

    // Team
    personnel: PersonnelFeature,
    "time-tracking": TimeTrackingFeature,

    // Multi-store
    stores: StoresFeature,

    // Computer shops specific
    repairs: RepairsFeature,
    rachats: RachatsFeature,
    atelier: AtelierFeature,
    catalogue: CatalogueFeature,

    // Plumbing/Heating specific
    interventions: InterventionsFeature,
    "stock-camionnette": StockCamionnetteFeature,
    contrats: ContratsEntretienFeature,
    planning: PlanningFeature,
    flotte: FlotteFeature,
    equipements: EquipementsFeature,
    "entretiens-planifier": EntretiensPlanifierFeature,

    // Fitness / Gym specific
    "abonnements-fitness": AbonnementsFitnessFeature,
    "cours-fitness": CoursFitnessFeature,
    "salles-fitness": SallesFitnessFeature,
    "check-in": CheckInFeature,
    coachs: CoachsFeature,

    // Consulting / Service intellectuel specific
    missions: MissionsFeature,
    timesheet: TimesheetFeature,

    // Accounting / Comptabilite specific
    echeances: EcheancesFeature,

    // Juridique / Law firm specific
    affaires: AffairesFeature,
    diligences: DiligencesFeature,
    "echeances-proc": EcheancesProcFeature,

    // Immobilier - Agent Immobilier
    "biens-immo": BiensImmoFeature,
    mandats: MandatsFeature,
    visites: VisitesImmoFeature,
    estimations: EstimationsFeature,
    matching: MatchingFeature,
    diffusion: DiffusionFeature,
    pipeline: PipelineFeature,

    // Immobilier - Gestion Locative
    baux: BauxFeature,
    loyers: LoyersFeature,
    impayes: ImpayesFeature,
    "etats-lieux": EtatsLieuxFeature,
    "travaux-locatifs": TravauxLocatifsFeature,

    // Immobilier - Syndic
    coproprietes: CoproprietesFeature,
    lots: LotsFeature,
    charges: ChargesFeature,
    ag: AGFeature,
    "travaux-copro": TravauxCoproFeature,
    "compta-copro": ComptaCoproFeature,
    "conseil-syndical": ConseilSyndicalFeature,

    // Finance
    payments: PaymentsFeature,
    "payment-links": PaymentLinksFeature,
    "bank-reconciliation": BankReconciliationFeature,

    // Integrations
    integrations: IntegrationsFeature,

    // Settings
    settings: SettingsFeature,
} as const;

export type FeatureId = keyof typeof FEATURE_CATALOG;
