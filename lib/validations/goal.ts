import { z } from "zod";

// ============================================================================
// Goal Validation Schemas
// ============================================================================

/**
 * Schema for creating a new goal
 */
export const createGoalSchema = z.object({
    label: z
        .string()
        .min(1, "Le nom de l'objectif est requis")
        .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    description: z
        .string()
        .max(500, "La description ne peut pas dépasser 500 caractères")
        .optional()
        .nullable(),
    metricType: z.enum([
        "REVENUE_MONTHLY",
        "REVENUE_QUARTERLY",
        "REVENUE_YEARLY",
        "NEW_CLIENTS",
        "CONVERSION_RATE",
        "DOCUMENTS_CREATED",
        "AVERAGE_TICKET",
        "CUSTOM",
    ]),
    period: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]).default("MONTHLY"),
    unit: z.enum(["CURRENCY", "NUMBER", "PERCENTAGE"]).default("NUMBER"),
    targetValue: z
        .number()
        .positive("La valeur cible doit être positive")
        .max(999999999999, "La valeur cible est trop grande"),
});

/**
 * Schema for updating an existing goal
 */
export const updateGoalSchema = z.object({
    label: z
        .string()
        .min(1, "Le nom de l'objectif est requis")
        .max(100, "Le nom ne peut pas dépasser 100 caractères")
        .optional(),
    description: z
        .string()
        .max(500, "La description ne peut pas dépasser 500 caractères")
        .optional()
        .nullable(),
    metricType: z
        .enum([
            "REVENUE_MONTHLY",
            "REVENUE_QUARTERLY",
            "REVENUE_YEARLY",
            "NEW_CLIENTS",
            "CONVERSION_RATE",
            "DOCUMENTS_CREATED",
            "AVERAGE_TICKET",
            "CUSTOM",
        ])
        .optional(),
    period: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]).optional(),
    unit: z.enum(["CURRENCY", "NUMBER", "PERCENTAGE"]).optional(),
    targetValue: z
        .number()
        .positive("La valeur cible doit être positive")
        .max(999999999999, "La valeur cible est trop grande")
        .optional(),
    enabled: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
});

/**
 * Schema for updating goal progress (custom goals only)
 */
export const updateGoalProgressSchema = z.object({
    currentValue: z
        .number()
        .min(0, "La valeur actuelle doit être positive ou nulle")
        .max(999999999999, "La valeur actuelle est trop grande"),
});

/**
 * Schema for reordering goals
 */
export const reorderGoalsSchema = z.object({
    goalIds: z.array(z.string().cuid()).min(1, "Au moins un objectif requis"),
});

// ============================================================================
// Type Exports
// ============================================================================

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type UpdateGoalProgressInput = z.infer<typeof updateGoalProgressSchema>;
export type ReorderGoalsInput = z.infer<typeof reorderGoalsSchema>;
