/**
 * Repair validation schemas
 */

import { z } from "zod";

const typeAppareilEnum = z.enum([
    "PC_PORTABLE",
    "PC_BUREAU",
    "MAC",
    "SMARTPHONE",
    "TABLETTE",
    "CONSOLE_JEU",
    "SERVEUR",
    "PERIPHERIQUE",
    "AUTRE",
]);

const prioriteEnum = z.enum(["NORMALE", "URGENTE", "CRITIQUE"]);

const statutEnum = z.enum([
    "DEPOSE",
    "DIAGNOSTIC",
    "DEVIS_ENVOYE",
    "ATTENTE_PIECES",
    "EN_COURS",
    "PRETE",
    "LIVREE",
    "ANNULEE",
    "ABANDONNEE",
]);

// Repair create schema
export const reparationCreateSchema = z.object({
    clientId: z.string().min(1, "Le client est requis"),
    typeAppareil: typeAppareilEnum,
    marque: z
        .string()
        .max(100, "La marque ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    modele: z
        .string()
        .max(100, "Le modèle ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    numeroSerie: z
        .string()
        .max(100, "Le numéro de série ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    motAuthentification: z
        .string()
        .max(500, "Le mot de passe ne peut pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
    panne: z
        .string()
        .min(1, "La description de la panne est requise")
        .max(2000, "La description ne peut pas dépasser 2000 caractères"),
    etatVisuel: z
        .string()
        .max(1000, "L'état visuel ne peut pas dépasser 1000 caractères")
        .optional()
        .or(z.literal("")),
    accessoires: z
        .string()
        .max(500, "Les accessoires ne peuvent pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
    priorite: prioriteEnum.default("NORMALE"),
    reference: z
        .string()
        .max(100, "La référence ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    storeId: z.string().optional(),
    registerId: z.string().optional(),
    notesInternes: z
        .string()
        .max(2000, "Les notes ne peuvent pas dépasser 2000 caractères")
        .optional()
        .or(z.literal("")),
});

// Repair update schema
export const reparationUpdateSchema = z.object({
    typeAppareil: typeAppareilEnum.optional(),
    marque: z
        .string()
        .max(100, "La marque ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    modele: z
        .string()
        .max(100, "Le modèle ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    numeroSerie: z
        .string()
        .max(100, "Le numéro de série ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    motAuthentification: z
        .string()
        .max(500, "Le mot de passe ne peut pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
    panne: z
        .string()
        .max(2000, "La description ne peut pas dépasser 2000 caractères")
        .optional(),
    etatVisuel: z
        .string()
        .max(1000, "L'état visuel ne peut pas dépasser 1000 caractères")
        .optional()
        .or(z.literal("")),
    accessoires: z
        .string()
        .max(500, "Les accessoires ne peuvent pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
    priorite: prioriteEnum.optional(),
    dateEstimeeRetour: z.date().optional(),
    notesInternes: z
        .string()
        .max(2000, "Les notes ne peuvent pas dépasser 2000 caractères")
        .optional()
        .or(z.literal("")),
    notesTechnicien: z
        .string()
        .max(2000, "Les notes ne peuvent pas dépasser 2000 caractères")
        .optional()
        .or(z.literal("")),
});

// Status change schema
export const reparationStatusSchema = z.object({
    statut: statutEnum,
    notes: z
        .string()
        .max(500, "Les notes ne peuvent pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
});

// Technician assignment schema
export const reparationAssignSchema = z.object({
    technicienId: z.string().min(1, "Le technicien est requis"),
});

// Diagnostic schema
export const reparationDiagnosticSchema = z.object({
    diagnosticDetail: z
        .string()
        .min(1, "Le diagnostic est requis")
        .max(2000, "Le diagnostic ne peut pas dépasser 2000 caractères"),
    devisEstime: z
        .number()
        .nonnegative("Le montant doit être positif ou nul")
        .max(999999.99, "Le montant est trop élevé"),
    delaiReparation: z
        .number()
        .int("Le délai doit être un nombre entier")
        .positive("Le délai doit être positif")
        .optional(),
});

// Add piece schema
export const reparationAddPieceSchema = z
    .object({
        articleId: z.string().optional(),
        ressourceAtelierId: z.string().optional(),
        designation: z
            .string()
            .min(1, "La désignation est requise")
            .max(200, "La désignation ne peut pas dépasser 200 caractères"),
        quantite: z
            .number()
            .int("La quantité doit être un nombre entier")
            .positive("La quantité doit être positive"),
        prixUnitaire: z
            .number()
            .nonnegative("Le prix doit être positif ou nul")
            .max(999999.99, "Le prix est trop élevé"),
    })
    .refine((data) => data.articleId || data.ressourceAtelierId, {
        message: "Vous devez spécifier soit un article, soit une ressource d'atelier",
    });

// Intervention schema
export const reparationInterventionSchema = z.object({
    technicienId: z.string().min(1, "Le technicien est requis"),
    dateDebut: z.date({
        required_error: "La date de début est requise",
    }),
    dateFin: z.date().optional(),
    description: z
        .string()
        .min(1, "La description est requise")
        .max(1000, "La description ne peut pas dépasser 1000 caractères"),
    type: z
        .string()
        .max(50, "Le type ne peut pas dépasser 50 caractères")
        .default("REPARATION"),
});

// Type exports
export type ReparationCreateInput = z.infer<typeof reparationCreateSchema>;
export type ReparationUpdateInput = z.infer<typeof reparationUpdateSchema>;
export type ReparationStatusInput = z.infer<typeof reparationStatusSchema>;
export type ReparationAssignInput = z.infer<typeof reparationAssignSchema>;
export type ReparationDiagnosticInput = z.infer<typeof reparationDiagnosticSchema>;
export type ReparationAddPieceInput = z.infer<typeof reparationAddPieceSchema>;
export type ReparationInterventionInput = z.infer<typeof reparationInterventionSchema>;
