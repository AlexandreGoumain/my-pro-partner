import type { GoalMetricType, GoalPeriod, GoalUnit } from "@/lib/generated/prisma";

// ============================================================================
// Goal Metric Types Configuration
// ============================================================================

export interface GoalMetricConfig {
    label: string;
    description: string;
    unit: GoalUnit;
    /** Whether this metric is auto-calculated from business data */
    autoCalculated: boolean;
}

export const GOAL_METRIC_TYPES: Record<GoalMetricType, GoalMetricConfig> = {
    REVENUE_MONTHLY: {
        label: "Chiffre d'affaires mensuel",
        description: "CA total des factures payées ce mois",
        unit: "CURRENCY",
        autoCalculated: true,
    },
    REVENUE_QUARTERLY: {
        label: "Chiffre d'affaires trimestriel",
        description: "CA total des factures payées ce trimestre",
        unit: "CURRENCY",
        autoCalculated: true,
    },
    REVENUE_YEARLY: {
        label: "Chiffre d'affaires annuel",
        description: "CA total des factures payées cette année",
        unit: "CURRENCY",
        autoCalculated: true,
    },
    NEW_CLIENTS: {
        label: "Nouveaux clients",
        description: "Nombre de clients créés sur la période",
        unit: "NUMBER",
        autoCalculated: true,
    },
    CONVERSION_RATE: {
        label: "Taux de conversion",
        description: "Pourcentage de devis convertis en factures",
        unit: "PERCENTAGE",
        autoCalculated: true,
    },
    DOCUMENTS_CREATED: {
        label: "Documents créés",
        description: "Nombre de documents créés sur la période",
        unit: "NUMBER",
        autoCalculated: true,
    },
    AVERAGE_TICKET: {
        label: "Panier moyen",
        description: "Montant moyen par transaction",
        unit: "CURRENCY",
        autoCalculated: true,
    },
    CUSTOM: {
        label: "Objectif personnalisé",
        description: "Progression mise à jour manuellement",
        unit: "NUMBER",
        autoCalculated: false,
    },
};

// ============================================================================
// Goal Periods Configuration
// ============================================================================

export interface GoalPeriodConfig {
    label: string;
    shortLabel: string;
}

export const GOAL_PERIODS: Record<GoalPeriod, GoalPeriodConfig> = {
    WEEKLY: {
        label: "Hebdomadaire",
        shortLabel: "Semaine",
    },
    MONTHLY: {
        label: "Mensuel",
        shortLabel: "Mois",
    },
    QUARTERLY: {
        label: "Trimestriel",
        shortLabel: "Trimestre",
    },
    YEARLY: {
        label: "Annuel",
        shortLabel: "Année",
    },
};

// ============================================================================
// Goal Units Configuration
// ============================================================================

export interface GoalUnitConfig {
    label: string;
    format: (value: number) => string;
}

export const GOAL_UNITS: Record<GoalUnit, GoalUnitConfig> = {
    CURRENCY: {
        label: "Monétaire (€)",
        format: (value: number) => `${value.toLocaleString("fr-FR")}€`,
    },
    NUMBER: {
        label: "Nombre",
        format: (value: number) => value.toLocaleString("fr-FR"),
    },
    PERCENTAGE: {
        label: "Pourcentage (%)",
        format: (value: number) => `${value}%`,
    },
};

// ============================================================================
// Goal Types for API/Frontend
// ============================================================================

/**
 * Goal data as stored in database
 */
export interface GoalData {
    id: string;
    label: string;
    description: string | null;
    metricType: GoalMetricType;
    period: GoalPeriod;
    unit: GoalUnit;
    targetValue: number;
    currentValue: number;
    enabled: boolean;
    sortOrder: number;
    entrepriseId: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Goal with calculated progress for display
 */
export interface GoalWithProgress extends GoalData {
    /** Progress percentage (0-100) */
    progress: number;
    /** Whether the goal is on track to be achieved */
    onTrack: boolean;
    /** Formatted current value */
    formattedCurrent: string;
    /** Formatted target value */
    formattedTarget: string;
}

/**
 * Input for creating a new goal
 */
export interface CreateGoalInput {
    label: string;
    description?: string;
    metricType: GoalMetricType;
    period: GoalPeriod;
    unit: GoalUnit;
    targetValue: number;
}

/**
 * Input for updating a goal
 */
export interface UpdateGoalInput {
    label?: string;
    description?: string;
    metricType?: GoalMetricType;
    period?: GoalPeriod;
    unit?: GoalUnit;
    targetValue?: number;
    enabled?: boolean;
    sortOrder?: number;
}

/**
 * Input for updating goal progress (custom goals only)
 */
export interface UpdateGoalProgressInput {
    currentValue: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a metric type is auto-calculated
 */
export function isAutoCalculated(metricType: GoalMetricType): boolean {
    return GOAL_METRIC_TYPES[metricType].autoCalculated;
}

/**
 * Get the default unit for a metric type
 */
export function getDefaultUnit(metricType: GoalMetricType): GoalUnit {
    return GOAL_METRIC_TYPES[metricType].unit;
}

/**
 * Format a value according to its unit
 */
export function formatGoalValue(value: number, unit: GoalUnit): string {
    return GOAL_UNITS[unit].format(value);
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(current: number, target: number): number {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
}

/**
 * Determine if a goal is on track based on time elapsed in period
 */
export function isGoalOnTrack(
    current: number,
    target: number,
    period: GoalPeriod,
    periodStartDate: Date = new Date()
): boolean {
    const now = new Date();
    const progress = calculateProgress(current, target);

    // Calculate expected progress based on time elapsed in period
    let expectedProgress: number;

    switch (period) {
        case "WEEKLY": {
            const dayOfWeek = now.getDay() || 7; // 1-7 (Mon-Sun)
            expectedProgress = (dayOfWeek / 7) * 100;
            break;
        }
        case "MONTHLY": {
            const dayOfMonth = now.getDate();
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            expectedProgress = (dayOfMonth / daysInMonth) * 100;
            break;
        }
        case "QUARTERLY": {
            const quarter = Math.floor(now.getMonth() / 3);
            const quarterStart = new Date(now.getFullYear(), quarter * 3, 1);
            const quarterEnd = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
            const totalDays = Math.ceil((quarterEnd.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24));
            const elapsedDays = Math.ceil((now.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24));
            expectedProgress = (elapsedDays / totalDays) * 100;
            break;
        }
        case "YEARLY": {
            const dayOfYear = Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24));
            const daysInYear = ((now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || now.getFullYear() % 400 === 0) ? 366 : 365;
            expectedProgress = (dayOfYear / daysInYear) * 100;
            break;
        }
        default:
            expectedProgress = 50;
    }

    // Goal is on track if actual progress >= expected progress (with 10% tolerance)
    return progress >= expectedProgress - 10;
}
