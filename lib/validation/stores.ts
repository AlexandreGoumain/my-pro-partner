/**
 * Store and terminal validation schemas
 */

import { z } from "zod";

// Store schemas
export const storeBaseSchema = z.object({
    nom: z
        .string()
        .min(1, "Le nom du magasin est requis")
        .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    code: z
        .string()
        .min(1, "Le code du magasin est requis")
        .max(20, "Le code ne peut pas dépasser 20 caractères")
        .regex(
            /^[A-Z0-9]+$/,
            "Le code doit contenir uniquement des lettres majuscules et des chiffres"
        ),
    adresse: z
        .string()
        .max(200, "L'adresse ne peut pas dépasser 200 caractères")
        .optional()
        .or(z.literal("")),
    codePostal: z
        .string()
        .max(10, "Le code postal ne peut pas dépasser 10 caractères")
        .optional()
        .or(z.literal("")),
    ville: z
        .string()
        .max(100, "La ville ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    pays: z
        .string()
        .max(100, "Le pays ne peut pas dépasser 100 caractères")
        .default("France"),
    latitude: z
        .number()
        .min(-90, "La latitude doit être entre -90 et 90")
        .max(90, "La latitude doit être entre -90 et 90")
        .optional(),
    longitude: z
        .number()
        .min(-180, "La longitude doit être entre -180 et 180")
        .max(180, "La longitude doit être entre -180 et 180")
        .optional(),
    telephone: z
        .string()
        .max(20, "Le téléphone ne peut pas dépasser 20 caractères")
        .optional()
        .or(z.literal("")),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    isMainStore: z.boolean().default(false),
    status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]).default("ACTIVE"),
    timezone: z.string().default("Europe/Paris"),
    openingHours: z.unknown().optional(),
});

export const storeCreateSchema = storeBaseSchema;
export const storeUpdateSchema = storeBaseSchema.partial();

// Terminal schemas
export const terminalBaseSchema = z.object({
    stripeTerminalId: z.string().min(1, "L'ID Stripe Terminal est requis"),
    label: z
        .string()
        .min(1, "Le nom du terminal est requis")
        .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    location: z
        .string()
        .max(200, "L'emplacement ne peut pas dépasser 200 caractères")
        .optional()
        .or(z.literal("")),
    status: z.enum(["ONLINE", "OFFLINE", "MAINTENANCE"]).default("OFFLINE"),
    device_type: z
        .string()
        .max(50, "Le type d'appareil ne peut pas dépasser 50 caractères")
        .optional()
        .or(z.literal("")),
    serial_number: z
        .string()
        .max(100, "Le numéro de série ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    ip_address: z
        .string()
        .max(50, "L'adresse IP ne peut pas dépasser 50 caractères")
        .optional()
        .or(z.literal("")),
});

export const terminalCreateSchema = terminalBaseSchema;
export const terminalUpdateSchema = terminalBaseSchema.partial();

// Payment link schemas
export const paymentLinkBaseSchema = z.object({
    slug: z
        .string()
        .min(1, "Le slug est requis")
        .max(100, "Le slug ne peut pas dépasser 100 caractères")
        .regex(
            /^[a-z0-9-]+$/,
            "Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets"
        ),
    titre: z
        .string()
        .min(1, "Le titre est requis")
        .max(200, "Le titre ne peut pas dépasser 200 caractères"),
    description: z
        .string()
        .max(1000, "La description ne peut pas dépasser 1000 caractères")
        .optional()
        .or(z.literal("")),
    montant: z
        .number({
            required_error: "Le montant est requis",
            invalid_type_error: "Le montant doit être un nombre",
        })
        .positive("Le montant doit être positif")
        .max(999999.99, "Le montant est trop élevé"),
    devise: z.string().default("EUR"),
    quantiteMax: z
        .number()
        .int("La quantité maximum doit être un nombre entier")
        .positive("La quantité maximum doit être positive")
        .optional(),
    dateExpiration: z.string().optional().or(z.literal("")),
    actif: z.boolean().default(true),
    imageCouverture: z
        .string()
        .url("L'URL de l'image doit être valide")
        .optional()
        .or(z.literal("")),
    messageSucces: z
        .string()
        .max(500, "Le message de succès ne peut pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
    metadata: z.unknown().optional(),
});

export const paymentLinkCreateSchema = paymentLinkBaseSchema;
export const paymentLinkUpdateSchema = paymentLinkBaseSchema.partial();

// Type exports
export type StoreCreateInput = z.infer<typeof storeCreateSchema>;
export type StoreUpdateInput = z.infer<typeof storeUpdateSchema>;
export type TerminalCreateInput = z.infer<typeof terminalCreateSchema>;
export type TerminalUpdateInput = z.infer<typeof terminalUpdateSchema>;
export type PaymentLinkCreateInput = z.infer<typeof paymentLinkCreateSchema>;
export type PaymentLinkUpdateInput = z.infer<typeof paymentLinkUpdateSchema>;
