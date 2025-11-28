/**
 * Personnel validation schemas
 */

import { z } from "zod";

// User schemas
export const userBaseSchema = z.object({
    email: z.string().email("Email invalide").min(1, "L'email est requis"),
    name: z
        .string()
        .max(100, "Le nom ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    prenom: z
        .string()
        .max(100, "Le prénom ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    role: z.enum(["OWNER", "ADMIN", "MANAGER", "EMPLOYEE", "ACCOUNTANT"], {
        required_error: "Le rôle est requis",
    }),
    password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .optional(),
    telephone: z
        .string()
        .max(20, "Le téléphone ne peut pas dépasser 20 caractères")
        .optional()
        .or(z.literal("")),
    dateNaissance: z.string().optional().or(z.literal("")),
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
    photoUrl: z
        .string()
        .url("L'URL de la photo doit être valide")
        .optional()
        .or(z.literal("")),
    poste: z
        .string()
        .max(100, "Le poste ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    departement: z
        .string()
        .max(100, "Le département ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    dateEmbauche: z.string().optional().or(z.literal("")),
    dateFinContrat: z.string().optional().or(z.literal("")),
    salaireHoraire: z
        .number()
        .positive("Le salaire horaire doit être positif")
        .max(999.99, "Le salaire horaire est trop élevé")
        .optional(),
    numeroSecu: z
        .string()
        .max(
            50,
            "Le numéro de sécurité sociale ne peut pas dépasser 50 caractères"
        )
        .optional()
        .or(z.literal("")),
    iban: z
        .string()
        .max(34, "L'IBAN ne peut pas dépasser 34 caractères")
        .optional()
        .or(z.literal("")),
    sendInvitation: z.boolean().default(true),
});

export const userCreateSchema = userBaseSchema.extend({
    role: z.enum(["OWNER", "ADMIN", "MANAGER", "EMPLOYEE", "ACCOUNTANT"], {
        required_error: "Le rôle est requis",
    }),
});

export const userUpdateSchema = userBaseSchema.partial().extend({
    status: z.enum(["INVITED", "ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
});

// Employee schemas
export const employeeBaseSchema = z.object({
    prenom: z
        .string()
        .min(1, "Le prénom est requis")
        .max(100, "Le prénom ne peut pas dépasser 100 caractères"),
    nom: z
        .string()
        .min(1, "Le nom est requis")
        .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    email: z.string().email("Email invalide"),
    telephone: z
        .string()
        .max(20, "Le téléphone ne peut pas dépasser 20 caractères")
        .optional()
        .or(z.literal("")),
    dateNaissance: z.coerce.date().optional().nullable(),
    adresse: z
        .string()
        .max(200, "L'adresse ne peut pas dépasser 200 caractères")
        .optional()
        .or(z.literal("")),
    ville: z
        .string()
        .max(100, "La ville ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    codePostal: z
        .string()
        .max(10, "Le code postal ne peut pas dépasser 10 caractères")
        .optional()
        .or(z.literal("")),
    pays: z
        .string()
        .max(100, "Le pays ne peut pas dépasser 100 caractères")
        .default("France"),
    photoUrl: z.string().url("URL invalide").optional().or(z.literal("")),
    poste: z
        .string()
        .min(1, "Le poste est requis")
        .max(100, "Le poste ne peut pas dépasser 100 caractères"),
    departement: z
        .string()
        .max(100, "Le département ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    statut: z
        .enum(["ACTIF", "CONGE", "MALADIE", "ABSENT", "INACTIF"])
        .default("ACTIF"),
    typeContrat: z
        .enum(["CDI", "CDD", "INTERIM", "APPRENTI", "STAGE", "FREELANCE"])
        .default("CDI"),
    dateEmbauche: z.coerce.date({
        required_error: "La date d'embauche est requise",
    }),
    dateFin: z.coerce.date().optional().nullable(),
    salaireBrut: z
        .number({
            required_error: "Le salaire brut est requis",
        })
        .min(0, "Le salaire ne peut pas être négatif")
        .max(999999.99, "Le salaire est trop élevé"),
    devise: z
        .string()
        .max(10, "La devise ne peut pas dépasser 10 caractères")
        .default("EUR"),
    heuresHebdo: z
        .number()
        .int("Les heures doivent être un nombre entier")
        .min(1, "Les heures doivent être au moins 1")
        .max(70, "Les heures ne peuvent pas dépasser 70")
        .default(35)
        .optional(),
    joursTravail: z
        .string()
        .max(100, "Les jours de travail ne peuvent pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    notes: z
        .string()
        .max(2000, "Les notes ne peuvent pas dépasser 2000 caractères")
        .optional()
        .or(z.literal("")),
    competences: z
        .string()
        .max(2000, "Les compétences ne peuvent pas dépasser 2000 caractères")
        .optional()
        .or(z.literal("")),
    congesRestants: z
        .number()
        .int("Les congés doivent être un nombre entier")
        .min(0, "Les congés ne peuvent pas être négatifs")
        .max(365, "Les congés ne peuvent pas dépasser 365 jours")
        .default(25)
        .optional(),
    congesPris: z
        .number()
        .int("Les congés pris doivent être un nombre entier")
        .min(0, "Les congés pris ne peuvent pas être négatifs")
        .max(365, "Les congés pris ne peuvent pas dépasser 365 jours")
        .default(0)
        .optional(),
});

export const employeeCreateSchema = employeeBaseSchema;
export const employeeUpdateSchema = employeeBaseSchema.partial();

// Automation schemas
export const automationBaseSchema = z.object({
    nom: z
        .string()
        .min(1, "Le nom est requis")
        .max(200, "Le nom ne peut pas dépasser 200 caractères"),
    description: z
        .string()
        .max(1000, "La description ne peut pas dépasser 1000 caractères")
        .optional()
        .or(z.literal("")),
    triggerType: z.enum(
        [
            "NEW_CLIENT_IN_SEGMENT",
            "CLIENT_MILESTONE",
            "SEGMENT_CHANGE",
            "INACTIVITY",
            "SCHEDULED",
        ],
        {
            required_error: "Le type de déclencheur est requis",
        }
    ),
    triggerConfig: z.record(z.unknown()).default({}),
    actionType: z.enum(
        [
            "SEND_EMAIL",
            "ADD_TO_SEGMENT",
            "REMOVE_FROM_SEGMENT",
            "ADD_POINTS",
            "SEND_SMS",
            "CREATE_TASK",
        ],
        {
            required_error: "Le type d'action est requis",
        }
    ),
    actionConfig: z.record(z.unknown()).default({}),
    actif: z.boolean().default(true),
});

export const automationCreateSchema = automationBaseSchema;
export const automationUpdateSchema = automationBaseSchema.partial();

// Type exports
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;
export type EmployeeUpdateInput = z.infer<typeof employeeUpdateSchema>;
export type AutomationCreateInput = z.infer<typeof automationCreateSchema>;
export type AutomationUpdateInput = z.infer<typeof automationUpdateSchema>;
