/**
 * Fitness validation schemas
 */

import { z } from "zod";

const periodiciteEnum = z.enum([
    "JOURNALIER",
    "HEBDOMADAIRE",
    "MENSUEL",
    "TRIMESTRIEL",
    "SEMESTRIEL",
    "ANNUEL",
    "ILLIMITE",
]);

const statutAbonnementEnum = z.enum([
    "ACTIF",
    "SUSPENDU",
    "EXPIRE",
    "RESILIE",
    "EN_ATTENTE",
]);

// Type d'abonnement schemas
export const typeAbonnementBaseSchema = z.object({
    nom: z
        .string()
        .min(1, "Le nom est requis")
        .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    description: z
        .string()
        .max(500, "La description ne peut pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
    prix: z
        .number({
            required_error: "Le prix est requis",
            invalid_type_error: "Le prix doit être un nombre",
        })
        .min(0, "Le prix ne peut pas être négatif")
        .max(99999.99, "Le prix est trop élevé"),
    periodicite: periodiciteEnum,
    dureeJours: z
        .number()
        .int("La durée doit être un nombre entier")
        .min(0, "La durée ne peut pas être négative")
        .optional()
        .nullable(),
    nombreSeances: z
        .number()
        .int("Le nombre de séances doit être un nombre entier")
        .min(0, "Le nombre de séances ne peut pas être négatif")
        .optional()
        .nullable(),
    accesIllimite: z.boolean().default(true),
    nombreAccesSemaine: z
        .number()
        .int("Le nombre d'accès doit être un nombre entier")
        .min(0, "Le nombre d'accès ne peut pas être négatif")
        .optional()
        .nullable(),
    accesCours: z.boolean().default(true),
    accesZonesPremium: z.boolean().default(false),
    engagementMois: z
        .number()
        .int("L'engagement doit être un nombre entier")
        .min(0, "L'engagement ne peut pas être négatif")
        .max(60, "L'engagement ne peut pas dépasser 60 mois")
        .default(0),
    fraisInscription: z
        .number()
        .min(0, "Les frais ne peuvent pas être négatifs")
        .max(9999.99, "Les frais sont trop élevés")
        .default(0),
    actif: z.boolean().default(true),
    ordre: z.number().int().min(0).default(0),
    couleur: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "Couleur invalide (format #RRGGBB)")
        .optional()
        .nullable()
        .or(z.literal("")),
});

export const typeAbonnementCreateSchema = typeAbonnementBaseSchema;
export const typeAbonnementUpdateSchema = typeAbonnementBaseSchema.partial();

// Abonnement schemas
export const abonnementBaseSchema = z.object({
    clientId: z.string().min(1, "Le client est requis"),
    typeAbonnementId: z.string().min(1, "Le type d'abonnement est requis"),
    dateDebut: z.coerce.date({
        required_error: "La date de début est requise",
    }),
    dateFin: z.coerce.date().optional().nullable(),
    statut: statutAbonnementEnum.default("ACTIF"),
    seancesRestantes: z
        .number()
        .int("Le nombre de séances doit être un nombre entier")
        .min(0, "Le nombre de séances ne peut pas être négatif")
        .optional()
        .nullable(),
    montantPaye: z
        .number()
        .min(0, "Le montant ne peut pas être négatif")
        .max(99999.99, "Le montant est trop élevé")
        .default(0),
    prochainPaiement: z.coerce.date().optional().nullable(),
    modePaiement: z
        .string()
        .max(50, "Le mode de paiement ne peut pas dépasser 50 caractères")
        .optional()
        .or(z.literal("")),
    numeroCarte: z
        .string()
        .max(50, "Le numéro de carte ne peut pas dépasser 50 caractères")
        .optional()
        .or(z.literal("")),
    codeAcces: z
        .string()
        .max(20, "Le code d'accès ne peut pas dépasser 20 caractères")
        .optional()
        .or(z.literal("")),
    notes: z
        .string()
        .max(1000, "Les notes ne peuvent pas dépasser 1000 caractères")
        .optional()
        .or(z.literal("")),
});

export const abonnementCreateSchema = abonnementBaseSchema;
export const abonnementUpdateSchema = abonnementBaseSchema.partial();

// Type exports
export type TypeAbonnementCreateInput = z.infer<
    typeof typeAbonnementCreateSchema
>;
export type TypeAbonnementUpdateInput = z.infer<
    typeof typeAbonnementUpdateSchema
>;
export type AbonnementCreateInput = z.infer<typeof abonnementCreateSchema>;
export type AbonnementUpdateInput = z.infer<typeof abonnementUpdateSchema>;
