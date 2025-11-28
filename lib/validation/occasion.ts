/**
 * Occasion (second-hand) validation schemas
 */

import { z } from "zod";
import { articleCreateSchema } from "./articles";

// Type de ressource partagé
const typeRessourceEnum = z.enum([
    "ECRAN",
    "BATTERIE",
    "CARTE_MERE",
    "CAMERA",
    "HAUT_PARLEUR",
    "CONNECTEUR_CHARGE",
    "VITRE",
    "CHASSIS",
    "MEMOIRE_RAM",
    "DISQUE_DUR",
    "ALIMENTATION",
    "VENTILATEUR",
    "CLAVIER",
    "TRACKPAD",
    "AUTRE",
]);

const etatEnum = z.enum([
    "COMME_NEUF",
    "TRES_BON",
    "BON",
    "CORRECT",
    "POUR_PIECES",
]);

const provenanceEnum = z.enum([
    "RACHAT_CLIENT",
    "MARKETPLACE_OCCASION",
    "REPRISE",
    "DON",
    "RETOUR_SAV",
    "AUTRE",
]);

// Rachat schemas
export const rachatCreateSchema = z.object({
    articleData: articleCreateSchema.extend({
        type: z.literal("OCCASION"),
    }),
    clientId: z.string().optional(),
    prixRachat: z
        .number({
            required_error: "Le prix de rachat est requis",
            invalid_type_error: "Le prix doit être un nombre",
        })
        .positive("Le prix de rachat doit être positif")
        .max(999999.99, "Le prix est trop élevé"),
    etat: etatEnum.refine((val) => val !== undefined, {
        message: "L'état est requis",
    }),
    provenance: provenanceEnum.refine((val) => val !== undefined, {
        message: "La provenance est requise",
    }),
    numeroSerie: z
        .string()
        .max(100, "Le numéro de série ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    notes: z
        .string()
        .max(1000, "Les notes ne peuvent pas dépasser 1000 caractères")
        .optional()
        .or(z.literal("")),
});

// Démontage schemas
export const demontageCreateSchema = z.object({
    articleSourceId: z.string().min(1, "L'article source est requis"),
    motif: z
        .string()
        .max(200, "Le motif ne peut pas dépasser 200 caractères")
        .optional()
        .or(z.literal("")),
    notes: z
        .string()
        .max(1000, "Les notes ne peuvent pas dépasser 1000 caractères")
        .optional()
        .or(z.literal("")),
    ressources: z
        .array(
            z.object({
                typeRessource: typeRessourceEnum,
                nom: z
                    .string()
                    .min(1, "Le nom est requis")
                    .max(200, "Le nom ne peut pas dépasser 200 caractères"),
                description: z
                    .string()
                    .max(
                        500,
                        "La description ne peut pas dépasser 500 caractères"
                    )
                    .optional()
                    .or(z.literal("")),
                etat: etatEnum,
                quantite: z
                    .number()
                    .int("La quantité doit être un nombre entier")
                    .positive("La quantité doit être positive")
                    .default(1),
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
                reference: z
                    .string()
                    .max(
                        100,
                        "La référence ne peut pas dépasser 100 caractères"
                    )
                    .optional()
                    .or(z.literal("")),
                notes: z
                    .string()
                    .max(
                        500,
                        "Les notes ne peuvent pas dépasser 500 caractères"
                    )
                    .optional()
                    .or(z.literal("")),
            })
        )
        .min(1, "Au moins une pièce doit être récupérée"),
});

// Ressource schemas
export const ressourceUtiliserSchema = z.object({
    quantiteUtilisee: z
        .number({
            required_error: "La quantité utilisée est requise",
        })
        .int("La quantité doit être un nombre entier")
        .positive("La quantité doit être positive"),
    reparationId: z.string().optional(),
    notes: z
        .string()
        .max(500, "Les notes ne peuvent pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
});

export const ressourceUpdateSchema = z.object({
    nom: z
        .string()
        .min(1, "Le nom est requis")
        .max(200, "Le nom ne peut pas dépasser 200 caractères")
        .optional(),
    description: z
        .string()
        .max(500, "La description ne peut pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
    etat: etatEnum.optional(),
    quantite: z
        .number()
        .int("La quantité doit être un nombre entier")
        .min(0, "La quantité ne peut pas être négative")
        .optional(),
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
    reference: z
        .string()
        .max(100, "La référence ne peut pas dépasser 100 caractères")
        .optional()
        .or(z.literal("")),
    valeurEstimee: z
        .number()
        .positive("La valeur doit être positive")
        .max(999999.99, "La valeur est trop élevée")
        .optional(),
    notes: z
        .string()
        .max(500, "Les notes ne peuvent pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
});

// Type exports
export type RachatCreateInput = z.infer<typeof rachatCreateSchema>;
export type DemontageCreateInput = z.infer<typeof demontageCreateSchema>;
export type RessourceUtiliserInput = z.infer<typeof ressourceUtiliserSchema>;
export type RessourceUpdateInput = z.infer<typeof ressourceUpdateSchema>;
