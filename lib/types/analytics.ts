/**
 * Analytics types for business intelligence features
 */

// Profitability Analytics Types
export interface ProfitabilityTypeData {
    revenue: number;
    count: number;
    quantity: number;
    percentage: number;
}

export interface ProfitabilityArticle {
    nom: string;
    reference: string;
    revenue: number;
    quantity: number;
}

export interface ProfitabilityCategoryData {
    categorieId: string;
    nom: string;
    revenue: number;
    count: number;
    percentage: number;
    topArticles: ProfitabilityArticle[];
}

export interface ProfitabilitySummary {
    totalRevenue: number;
    totalInvoices: number;
    period: string;
    dateFrom?: string;
    dateTo: string;
}

export interface ProfitabilityTrends {
    currentPeriod: number;
    previousPeriod: number;
    growth: number;
}

export interface ProfitabilityByType {
    PRODUIT: ProfitabilityTypeData;
    SERVICE: ProfitabilityTypeData;
    UNKNOWN: ProfitabilityTypeData;
}

export interface ProfitabilityResponse {
    byType: ProfitabilityByType;
    byCategory: ProfitabilityCategoryData[];
    summary: ProfitabilitySummary;
    trends: ProfitabilityTrends;
}

// Revenue Breakdown Types
export interface RevenueBreakdownItem {
    label: string;
    revenue: number;
    count: number;
    percentage: number;
    color: string;
}

// Period Selection Types
export type AnalyticsPeriod = "month" | "quarter" | "year" | "all";

export interface PeriodOption {
    value: AnalyticsPeriod;
    label: string;
}

// Unpaid Invoices Types
export interface UnpaidInvoiceClient {
    id: string;
    nom: string;
    prenom: string | null;
    email: string | null;
    telephone: string | null;
    ville: string | null;
}

export interface UnpaidInvoice {
    id: string;
    numero: string;
    dateEmission: Date;
    dateEcheance: Date | null;
    daysOverdue: number;
    isOverdue: boolean;
    montantTTC: number;
    resteAPayer: number;
    statut: string;
    client: UnpaidInvoiceClient;
}

export interface UnpaidInvoicesSummary {
    totalInvoices: number;
    totalUnpaid: number;
    overdueCount: number;
    totalOverdue: number;
    averageOverdueDays: number;
}

export interface UnpaidInvoicesResponse {
    invoices: UnpaidInvoice[];
    summary: UnpaidInvoicesSummary;
}

export type UnpaidInvoicesSortBy = "dateEcheance" | "dateEmission" | "reste_a_payer" | "numero";
export type SortOrder = "asc" | "desc";

// Sales Analytics Types
export interface Analytics {
    totalRevenue: number;
    totalQuotes: number;
    totalInvoices: number;
    paidInvoices: number;
    unpaidInvoices: number;
    overdueInvoices: number;
    revenueThisMonth: number;
    revenueLastMonth: number;
    averageQuoteValue: number;
    averageInvoiceValue: number;
    conversionRate: number;
}

export interface AnalyticsTrend {
    value: number;
    isPositive: boolean;
}
