/**
 * Stock validation schemas
 */

import { z } from "zod";

export const mouvementStockBaseSchema = z.object({
    articleId: z.string().min(1, "L'article est requis"),
    type: z.enum(["ENTREE", "SORTIE", "AJUSTEMENT", "INVENTAIRE", "RETOUR"], {
        required_error: "Le type de mouvement est requis",
        invalid_type_error: "Type de mouvement invalide",
    }),
    quantite: z
        .number({
            required_error: "La quantité est requise",
            invalid_type_error: "La quantité doit être un nombre",
        })
        .int("La quantité doit être un nombre entier")
        .refine((val) => val !== 0, {
            message: "La quantité ne peut pas être zéro",
        }),
    motif: z
        .string()
        .max(200, "Le motif ne peut pas dépasser 200 caractères")
        .optional()
        .or(z.literal("")),
    reference: z
        .string()
        .max(100, "La référence ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    notes: z
        .string()
        .max(500, "Les notes ne peuvent pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
});

export const mouvementStockCreateSchema = mouvementStockBaseSchema;

export const stockAdjustmentSchema = z.object({
    quantite: z
        .number({
            required_error: "La quantité est requise",
            invalid_type_error: "La quantité doit être un nombre",
        })
        .int("La quantité doit être un nombre entier")
        .refine((val) => val !== 0, {
            message: "La quantité ne peut pas être zéro",
        }),
    motif: z.string().optional().or(z.literal("")),
});

// Type exports
export type MouvementStockCreateInput = z.infer<
    typeof mouvementStockCreateSchema
>;
export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;
