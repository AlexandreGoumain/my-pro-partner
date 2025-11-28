/**
 * Loyalty validation schemas
 */

import { z } from "zod";

// Loyalty level schemas
export const niveauFideliteBaseSchema = z.object({
    nom: z
        .string()
        .min(1, "Le nom est requis")
        .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    description: z
        .string()
        .max(500, "La description ne peut pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
    seuilPoints: z
        .number({
            required_error: "Le seuil de points est requis",
            invalid_type_error: "Le seuil de points doit être un nombre",
        })
        .int("Le seuil de points doit être un nombre entier")
        .min(0, "Le seuil de points ne peut pas être négatif"),
    remise: z
        .number({
            invalid_type_error: "La remise doit être un nombre",
        })
        .min(0, "La remise ne peut pas être négative")
        .max(100, "La remise ne peut pas dépasser 100%")
        .default(0),
    couleur: z
        .string()
        .regex(
            /^#[0-9A-Fa-f]{6}$/,
            "La couleur doit être au format hexadécimal (#RRGGBB)"
        )
        .default("#000000"),
    icone: z
        .string()
        .max(50, "L'icône ne peut pas dépasser 50 caractères")
        .optional()
        .or(z.literal("")),
    avantages: z
        .string()
        .max(1000, "Les avantages ne peuvent pas dépasser 1000 caractères")
        .optional()
        .or(z.literal("")),
    actif: z.boolean().default(true),
});

export const niveauFideliteCreateSchema = niveauFideliteBaseSchema;
export const niveauFideliteUpdateSchema = niveauFideliteBaseSchema.partial();

// Points movement schemas
export const mouvementPointsBaseSchema = z.object({
    clientId: z.string().min(1, "Le client est requis"),
    type: z.enum(["GAIN", "DEPENSE", "EXPIRATION", "AJUSTEMENT"], {
        required_error: "Le type de mouvement est requis",
        invalid_type_error: "Type de mouvement invalide",
    }),
    points: z
        .number({
            required_error: "Le nombre de points est requis",
            invalid_type_error: "Le nombre de points doit être un nombre",
        })
        .int("Le nombre de points doit être un nombre entier")
        .refine((val) => val !== 0, {
            message: "Le nombre de points ne peut pas être zéro",
        }),
    description: z
        .string()
        .max(500, "La description ne peut pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
    reference: z
        .string()
        .max(100, "La référence ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    dateExpiration: z.string().optional().or(z.literal("")),
});

export const mouvementPointsCreateSchema = mouvementPointsBaseSchema;

// Type exports
export type NiveauFideliteCreateInput = z.infer<
    typeof niveauFideliteCreateSchema
>;
export type NiveauFideliteUpdateInput = z.infer<
    typeof niveauFideliteUpdateSchema
>;
export type MouvementPointsCreateInput = z.infer<
    typeof mouvementPointsCreateSchema
>;
