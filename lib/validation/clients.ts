/**
 * Client validation schemas
 */

import { z } from "zod";
import { phoneSchema, postalCodeFrSchema } from "./patterns";

// Category schemas
export const categorieBaseSchema = z.object({
    nom: z
        .string()
        .min(1, "Le nom est requis")
        .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    description: z
        .string()
        .max(500, "La description ne peut pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
    parentId: z.string().optional().nullable().or(z.literal("")),
    ordre: z
        .number({
            invalid_type_error: "L'ordre doit être un nombre",
        })
        .int("L'ordre doit être un nombre entier")
        .default(0),
});

export const categorieCreateSchema = categorieBaseSchema;
export const categorieUpdateSchema = categorieBaseSchema.partial();

// Client schemas
export const clientBaseSchema = z.object({
    nom: z
        .string()
        .min(1, "Le nom est requis")
        .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    prenom: z
        .string()
        .max(100, "Le prénom ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    // Security: Validate phone format to prevent injection attacks
    telephone: phoneSchema,
    adresse: z
        .string()
        .max(200, "L'adresse ne peut pas dépasser 200 caractères")
        .optional()
        .or(z.literal("")),
    // Security: Validate postal code format (French 5-digit format)
    codePostal: postalCodeFrSchema,
    ville: z
        .string()
        .max(100, "La ville ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    pays: z
        .string()
        .max(100, "Le pays ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    notes: z
        .string()
        .max(1000, "Les notes ne peuvent pas dépasser 1000 caractères")
        .optional()
        .or(z.literal("")),
});

export const clientCreateSchema = clientBaseSchema;
export const clientUpdateSchema = clientBaseSchema.partial();

// Custom fields schemas
const validationRulesSchema = z
    .object({
        min: z.number().optional(),
        max: z.number().optional(),
        minLength: z.number().optional(),
        maxLength: z.number().optional(),
        pattern: z.string().optional(),
        required: z.boolean().optional(),
    })
    .optional()
    .nullable();

export const champPersonnaliseBaseSchema = z.object({
    nom: z
        .string()
        .min(1, "Le nom du champ est requis")
        .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    code: z
        .string()
        .min(1, "Le code du champ est requis")
        .max(50, "Le code ne peut pas dépasser 50 caractères")
        .regex(
            /^[a-z][a-z0-9_]*$/,
            "Le code doit commencer par une lettre minuscule et ne contenir que des lettres minuscules, chiffres et underscores"
        ),
    type: z.enum([
        "TEXT",
        "TEXTAREA",
        "NUMBER",
        "DECIMAL",
        "SELECT",
        "MULTISELECT",
        "CHECKBOX",
        "DATE",
        "COLOR",
        "URL",
        "EMAIL",
    ]),
    ordre: z
        .number({
            invalid_type_error: "L'ordre doit être un nombre",
        })
        .int("L'ordre doit être un nombre entier")
        .default(0),
    obligatoire: z.boolean().default(false),
    placeholder: z
        .string()
        .max(200, "Le placeholder ne peut pas dépasser 200 caractères")
        .optional()
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val)),
    description: z
        .string()
        .max(500, "La description ne peut pas dépasser 500 caractères")
        .optional()
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val)),
    options: z.array(z.string()).optional().nullable(),
    validation: validationRulesSchema,
});

export const champPersonnaliseCreateSchema = champPersonnaliseBaseSchema.refine(
    (data) => {
        if (data.type === "SELECT" || data.type === "MULTISELECT") {
            return data.options && data.options.length > 0;
        }
        return true;
    },
    {
        message:
            "Les options sont requises pour les champs de type SELECT ou MULTISELECT",
        path: ["options"],
    }
);

export const champPersonnaliseUpdateSchema =
    champPersonnaliseBaseSchema.partial();

// Type exports
export type CategorieCreateInput = z.infer<typeof categorieCreateSchema>;
export type CategorieUpdateInput = z.infer<typeof categorieUpdateSchema>;
export type ClientCreateInput = z.infer<typeof clientCreateSchema>;
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;
export type ChampPersonnaliseCreateInput = z.infer<
    typeof champPersonnaliseCreateSchema
>;
export type ChampPersonnaliseUpdateInput = z.infer<
    typeof champPersonnaliseUpdateSchema
>;
