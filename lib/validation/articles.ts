/**
 * Article validation schemas
 */

import { z } from "zod";

export const articleBaseSchema = z.object({
    reference: z
        .string()
        .min(1, "La référence est requise")
        .max(50, "La référence ne peut pas dépasser 50 caractères"),
    nom: z
        .string()
        .min(1, "Le nom est requis")
        .max(200, "Le nom ne peut pas dépasser 200 caractères"),
    description: z
        .string()
        .max(1000, "La description ne peut pas dépasser 1000 caractères")
        .optional()
        .or(z.literal("")),
    type: z
        .enum(["PRODUIT", "SERVICE", "OCCASION", "PIECE"])
        .default("PRODUIT"),
    prix_ht: z
        .number({
            required_error: "Le prix HT est requis",
            invalid_type_error: "Le prix doit être un nombre",
        })
        .min(0, "Le prix ne peut pas être négatif")
        .max(9999999.99, "Le prix est trop élevé"),
    tva_taux: z
        .number({
            invalid_type_error: "Le taux de TVA doit être un nombre",
        })
        .min(0, "Le taux de TVA ne peut pas être négatif")
        .max(100, "Le taux de TVA ne peut pas dépasser 100%")
        .default(20),
    categorieId: z.string().min(1, "La catégorie est requise"),
    stock_actuel: z
        .number({
            invalid_type_error: "Le stock doit être un nombre",
        })
        .int("Le stock doit être un nombre entier")
        .min(0, "Le stock ne peut pas être négatif")
        .default(0),
    stock_min: z
        .number({
            invalid_type_error: "Le stock minimum doit être un nombre",
        })
        .int("Le stock minimum doit être un nombre entier")
        .min(0, "Le stock minimum ne peut pas être négatif")
        .default(0),
    gestion_stock: z.boolean().default(false),
    actif: z.boolean().default(true),
});

export const articleCreateSchema = articleBaseSchema
    .omit({ reference: true })
    .extend({
        rachatId: z.string().optional(),
        etat: z
            .enum(["COMME_NEUF", "TRES_BON", "BON", "CORRECT", "POUR_PIECES"])
            .optional(),
        provenance: z
            .enum([
                "RACHAT_CLIENT",
                "MARKETPLACE_OCCASION",
                "REPRISE",
                "DON",
                "RETOUR_SAV",
                "AUTRE",
            ])
            .optional(),
        prixRachat: z.number().positive().optional(),
        numeroSerie: z.string().max(100).optional().or(z.literal("")),
        notesRachat: z.string().max(1000).optional().or(z.literal("")),
    });

export const articleUpdateSchema = articleBaseSchema.partial();

export const pieceCreateSchema = articleCreateSchema.extend({
    type: z.literal("PIECE"),
    typePiece: z.enum(
        [
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
        ],
        {
            required_error: "Le type de pièce est requis",
        }
    ),
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
    articleOrigineId: z.string().optional(),
    valeurEstimee: z
        .number()
        .positive("La valeur estimée doit être positive")
        .max(999999.99, "La valeur est trop élevée")
        .optional(),
});

// Type exports
export type ArticleCreateInput = z.infer<typeof articleCreateSchema>;
export type ArticleUpdateInput = z.infer<typeof articleUpdateSchema>;
export type PieceCreateInput = z.infer<typeof pieceCreateSchema>;
