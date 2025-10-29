import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});

export const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
  confirmPassword: z.string(),
  name: z.string().min(2, "Nom requis"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// Backend schema without confirmPassword
export const registerBackendSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
  name: z.string().min(2, "Nom requis"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterBackendInput = z.infer<typeof registerBackendSchema>;

// Article validation schemas
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
  prix_ht: z
    .number({
      required_error: "Le prix HT est requis",
      invalid_type_error: "Le prix doit être un nombre",
    })
    .positive("Le prix doit être positif")
    .max(9999999.99, "Le prix est trop élevé"),
  tva_taux: z
    .number({
      invalid_type_error: "Le taux de TVA doit être un nombre",
    })
    .min(0, "Le taux de TVA ne peut pas être négatif")
    .max(100, "Le taux de TVA ne peut pas dépasser 100%")
    .default(20),
  categorieId: z
    .string()
    .optional()
    .or(z.literal("")),
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

// Schema pour la création (tous les champs requis)
export const articleCreateSchema = articleBaseSchema;

// Schema pour la mise à jour (tous les champs optionnels sauf validation)
export const articleUpdateSchema = articleBaseSchema.partial();

export type ArticleCreateInput = z.infer<typeof articleCreateSchema>;
export type ArticleUpdateInput = z.infer<typeof articleUpdateSchema>;

// Stock movement validation schemas
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

// Schema pour la création de mouvement de stock
export const mouvementStockCreateSchema = mouvementStockBaseSchema;

// Schema pour l'ajustement rapide de stock
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

export type MouvementStockCreateInput = z.infer<typeof mouvementStockCreateSchema>;
export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;

// Category validation schemas
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
  parentId: z
    .string()
    .optional()
    .nullable()
    .or(z.literal("")),
  ordre: z
    .number({
      invalid_type_error: "L'ordre doit être un nombre",
    })
    .int("L'ordre doit être un nombre entier")
    .default(0),
});

// Schema pour la création de catégorie
export const categorieCreateSchema = categorieBaseSchema;

// Schema pour la mise à jour de catégorie
export const categorieUpdateSchema = categorieBaseSchema.partial();

export type CategorieCreateInput = z.infer<typeof categorieCreateSchema>;
export type CategorieUpdateInput = z.infer<typeof categorieUpdateSchema>;

// Client validation schemas
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
  email: z
    .string()
    .email("Email invalide")
    .optional()
    .or(z.literal("")),
  telephone: z
    .string()
    .max(20, "Le téléphone ne peut pas dépasser 20 caractères")
    .optional()
    .or(z.literal("")),
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
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(1000, "Les notes ne peuvent pas dépasser 1000 caractères")
    .optional()
    .or(z.literal("")),
});

// Schema pour la création de client
export const clientCreateSchema = clientBaseSchema;

// Schema pour la mise à jour de client
export const clientUpdateSchema = clientBaseSchema.partial();

export type ClientCreateInput = z.infer<typeof clientCreateSchema>;
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;
