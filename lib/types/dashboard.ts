import type { LucideIcon } from "lucide-react";
import type { Capability } from "./capability";

// ============================================================================
// Client Portal Dashboard Types
// ============================================================================

/**
 * Loyalty level information
 * Defines the benefits and appearance of a loyalty tier
 */
export interface LoyaltyLevel {
    /** Display name of the loyalty level */
    nom: string;
    /** Hex color code for visual representation */
    couleur: string;
    /** Discount percentage for this level */
    remise: number;
}

/**
 * Client information for dashboard display
 * Contains basic profile data and loyalty information
 */
export interface DashboardClient {
    /** Client last name */
    nom: string;
    /** Client first name (optional) */
    prenom?: string;
    /** Client phone number (optional) */
    telephone?: string;
    /** Client address (optional) */
    adresse?: string;
    /** Current loyalty points balance */
    points_solde: number;
    /** Current loyalty level (optional) */
    niveauFidelite?: LoyaltyLevel;
}

/**
 * Upcoming RDV for dashboard widget
 */
export interface DashboardUpcomingRdv {
    id: string;
    date: string;
    heure: string;
    statut: string;
    prestation?: {
        nom: string;
        duree: number;
    };
    employe?: {
        prenom: string;
        nom: string;
    };
}

/**
 * Active intervention for dashboard widget
 */
export interface DashboardActiveIntervention {
    id: string;
    numero: string;
    typeIntervention: string;
    statut: string;
    priorite: string;
    datePrevisionnelle?: string;
    plombier?: {
        name: string;
    };
}

/**
 * Complete dashboard statistics
 * Aggregated data for the client portal dashboard
 */
export interface DashboardStats {
    /** Client profile and loyalty information */
    client: DashboardClient;
    /** Total number of documents */
    documentsCount: number;
    /** Total amount spent */
    totalSpent: number;
    /** Points expiring soon */
    pointsExpiringSoon: number;
    /** Business capabilities */
    capabilities: Capability[];
    /** Upcoming RDV (if agenda capability) */
    upcomingRdv?: DashboardUpcomingRdv[];
    /** Active interventions (if domicile/atelier capability) */
    activeInterventions?: DashboardActiveIntervention[];
}

// ============================================================================
// Enhanced Client Portal Dashboard Types (2025 Design)
// ============================================================================

/**
 * Activity item for client portal timeline
 */
export interface ActivityItem {
    id: string;
    type:
        | "document"
        | "rdv"
        | "intervention"
        | "points"
        | "loyalty"
        | "notification";
    title: string;
    description?: string;
    timestamp: Date | string;
    href?: string;
    metadata?: {
        documentNumber?: string;
        pointsAmount?: number;
        rdvDate?: string;
    };
}

/**
 * Next loyalty level information
 */
export interface NextLevelInfo {
    nom: string;
    couleur: string;
    seuilPoints: number;
}

/**
 * Enhanced dashboard statistics with micro-visualizations data
 * Extends base DashboardStats with trend data and activity timeline
 */
export interface EnhancedDashboardStats
    extends Omit<DashboardStats, "totalSpent"> {
    /** Points history for sparkline (last 6 months cumulative) */
    pointsHistory?: number[];
    /** Progress to next loyalty level (0-100) */
    progressToNextLevel?: number;
    /** Next loyalty level info */
    nextLevel?: NextLevelInfo | null;
    /** Documents created in last 30 days */
    recentDocumentsCount?: number;
    /** Days until next points expiration */
    daysUntilNextExpiry?: number;
    /** Recent activities for timeline widget */
    recentActivities?: ActivityItem[];
    /** Last update timestamp */
    lastUpdated?: Date | string;
}

// ============================================================================
// Admin Dashboard Types
// ============================================================================

/**
 * Task priority levels
 */
export type TaskPriority = "urgent" | "high" | "medium" | "low";

/**
 * Task item for the dashboard
 */
export interface DashboardTask {
    id: string;
    title: string;
    time?: string;
    priority: TaskPriority;
    onClick?: () => void;
}

/**
 * Quick action item
 */
export interface QuickAction {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
}

/**
 * Recent client for display in dashboard
 */
export interface RecentClientItem {
    initials: string;
    fullName: string;
    timeLabel: string;
    onClick?: () => void;
}

/**
 * Activity item for recent activity feed
 */
export interface DashboardActivity {
    icon: LucideIcon;
    title: string;
    description: string;
    timeLabel: string;
}

// ============================================================================
// Advanced Admin Dashboard Types (Top 1% Dashboard)
// ============================================================================

/**
 * Period comparison data
 * Compares current vs previous period with trend analysis
 */
export interface PeriodComparison {
    current: number;
    previous: number;
    change: number; // Percentage change
    trend: "up" | "down" | "stable";
}

/**
 * Revenue metrics with trend analysis
 */
export interface RevenueMetrics {
    total: number;
    thisMonth: number;
    lastMonth: number;
    comparison: PeriodComparison;
    trend: Array<{ month: string; amount: number }>;
    averageTransaction: number;
    projectedEndOfMonth: number;
}

/**
 * Payment and cash flow metrics
 */
export interface PaymentMetrics {
    outstanding: number; // Total unpaid
    overdue: number; // Overdue amount
    averagePaymentDelay: number; // Days
    dso: number; // Days Sales Outstanding
}

/**
 * Client metrics with growth analysis
 */
export interface ClientMetrics {
    total: number;
    new: number;
    newComparison: PeriodComparison;
    active: number; // Clients with activity in last 30 days
    inactive: number; // No activity > 30 days
    churnRisk: number; // Number at risk
    averageLifetimeValue: number;
}

/**
 * Sales and conversion metrics
 */
export interface SalesMetrics {
    quotesCreated: number;
    quotesConverted: number;
    conversionRate: number;
    conversionRateComparison: PeriodComparison;
    invoicesPaid: number;
    invoicesPending: number;
    averageTicket: number;
    averageTicketComparison: PeriodComparison;
}

/**
 * Stock and inventory metrics
 */
export interface StockMetrics {
    totalArticles: number;
    outOfStock: number;
    lowStock: number;
    stockValue: number;
    turnoverRate: number; // How fast stock moves
    totalArticlesComparison: PeriodComparison;
}

/**
 * Top client performer data
 */
export interface TopClient {
    id: string;
    nom: string;
    revenue: number;
    invoiceCount: number;
    lastPurchase: Date;
}

/**
 * Top product performer data
 */
export interface TopProduct {
    id: string;
    reference: string;
    nom: string;
    revenue: number;
    quantitySold: number;
    margin?: number;
}

/**
 * Top performers aggregation
 */
export interface TopPerformers {
    clients: TopClient[];
    products: TopProduct[];
}

/**
 * Document pipeline status
 * Overview of quotes and invoices at different stages
 */
export interface DocumentPipeline {
    quotes: {
        draft: number;
        sent: number;
        accepted: number;
        rejected: number;
        total: number;
        totalAmount: number;
    };
    invoices: {
        draft: number;
        sent: number;
        paid: number;
        overdue: number;
        total: number;
        totalAmount: number;
    };
}

/**
 * Business health score
 * Calculated score based on multiple business factors
 */
export interface BusinessHealth {
    score: number; // 0-100
    level: "critical" | "poor" | "good" | "excellent";
    factors: {
        revenue: number; // 0-100
        cashflow: number; // 0-100
        clientGrowth: number; // 0-100
        conversion: number; // 0-100
        stock: number; // 0-100
    };
    /** True when there's no data to calculate health (empty DB) */
    isEmpty?: boolean;
}

/**
 * Smart insight with actionable recommendations
 */
export interface Insight {
    id: string;
    type: "alert" | "opportunity" | "warning" | "info";
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    action?: {
        label: string;
        href: string;
    };
    metric?: {
        value: string;
        change?: string;
    };
}

/**
 * Activity timeline event
 * Represents any business activity (documents, payments, clients, etc.)
 */
export interface ActivityEvent {
    id: string;
    type: "client" | "document" | "payment" | "stock" | "campaign";
    action: string;
    description: string;
    timestamp: Date;
    metadata?: {
        clientName?: string;
        amount?: number;
        documentNumber?: string;
        productName?: string;
    };
}

/**
 * Goal tracking for objectives
 * @deprecated Use GoalWithProgress from '@/lib/types/goals' instead.
 * Goals are now managed via /api/goals endpoint and useGoals() hook.
 */
export interface Goal {
    id: string;
    label: string;
    target: number;
    current: number;
    unit: "currency" | "number" | "percentage";
    period: "day" | "week" | "month" | "year";
    progress: number; // 0-100
    onTrack: boolean;
}

/**
 * Complete dashboard overview
 * Aggregates all dashboard data in one comprehensive structure
 */
export interface DashboardOverview {
    // Core metrics
    revenue: RevenueMetrics;
    payments: PaymentMetrics;
    clients: ClientMetrics;
    sales: SalesMetrics;
    stock: StockMetrics;

    // Advanced data
    topPerformers: TopPerformers;
    pipeline: DocumentPipeline;
    health: BusinessHealth;
    insights: Insight[];
    activities: ActivityEvent[];
    // Goals are now managed via /api/goals and useGoals() hook

    // Metadata
    lastUpdated: Date;
    period: {
        start: Date;
        end: Date;
    };

    /** True when there's no data in the database */
    isEmpty: boolean;
}

/**
 * API response type for dashboard endpoint
 */
export interface DashboardApiResponse {
    success: boolean;
    data?: DashboardOverview;
    error?: string;
}
