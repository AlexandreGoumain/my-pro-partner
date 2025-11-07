import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Mot de passe trop court"),
});

export const registerSchema = z
    .object({
        email: z.string().email("Email invalide"),
        password: z.string().min(6, "Mot de passe trop court"),
        confirmPassword: z.string(),
        name: z.string().min(2, "Nom requis"),
    })
    .refine((data) => data.password === data.confirmPassword, {
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
    type: z.enum(["PRODUIT", "SERVICE"]).default("PRODUIT"),
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

// Schema pour la création (référence optionnelle car générée côté backend)
export const articleCreateSchema = articleBaseSchema.omit({ reference: true });

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

export type MouvementStockCreateInput = z.infer<
    typeof mouvementStockCreateSchema
>;
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
    parentId: z.string().optional().nullable().or(z.literal("")),
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
    email: z.string().email("Email invalide").optional().or(z.literal("")),
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

// Champs personnalisés validation schemas
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
        .nullable()
        .or(z.literal("")),
    description: z
        .string()
        .max(500, "La description ne peut pas dépasser 500 caractères")
        .optional()
        .nullable()
        .or(z.literal("")),
    options: z.array(z.string()).optional().nullable(),
    validation: validationRulesSchema,
});

// Validation conditionnelle : options requises pour SELECT et MULTISELECT
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

export type ChampPersonnaliseCreateInput = z.infer<
    typeof champPersonnaliseCreateSchema
>;
export type ChampPersonnaliseUpdateInput = z.infer<
    typeof champPersonnaliseUpdateSchema
>;

// Loyalty level validation schemas
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
        .regex(/^#[0-9A-Fa-f]{6}$/, "La couleur doit être au format hexadécimal (#RRGGBB)")
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

// Schema pour la création de niveau de fidélité
export const niveauFideliteCreateSchema = niveauFideliteBaseSchema;

// Schema pour la mise à jour de niveau de fidélité
export const niveauFideliteUpdateSchema = niveauFideliteBaseSchema.partial();

export type NiveauFideliteCreateInput = z.infer<typeof niveauFideliteCreateSchema>;
export type NiveauFideliteUpdateInput = z.infer<typeof niveauFideliteUpdateSchema>;

// Loyalty points movement validation schemas
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
    dateExpiration: z
        .string()
        .optional()
        .or(z.literal("")),
});

// Schema pour la création de mouvement de points
export const mouvementPointsCreateSchema = mouvementPointsBaseSchema;

export type MouvementPointsCreateInput = z.infer<typeof mouvementPointsCreateSchema>;
