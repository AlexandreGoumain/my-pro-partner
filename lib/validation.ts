import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Mot de passe trop court"),
});

// Client Portal Login Schema
export const clientLoginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Le mot de passe est requis"),
});

export type ClientLoginInput = z.infer<typeof clientLoginSchema>;

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
    email: z.string().email("Email invalide"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

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

// Client Portal Registration Schema
export const clientRegisterSchema = z
    .object({
        nom: z
            .string()
            .min(1, "Le nom est requis")
            .max(100, "Le nom ne peut pas dépasser 100 caractères"),
        prenom: z
            .string()
            .max(100, "Le prénom ne peut pas dépasser 100 caractères")
            .optional(),
        email: z.string().email("Email invalide"),
        telephone: z
            .string()
            .min(1, "Le téléphone est requis")
            .max(20, "Le téléphone ne peut pas dépasser 20 caractères"),
        password: z
            .string()
            .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
        confirmPassword: z.string(),
        adresse: z
            .string()
            .max(200, "L'adresse ne peut pas dépasser 200 caractères")
            .optional(),
        codePostal: z
            .string()
            .max(10, "Le code postal ne peut pas dépasser 10 caractères")
            .optional(),
        ville: z
            .string()
            .max(100, "La ville ne peut pas dépasser 100 caractères")
            .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

export type ClientRegisterInput = z.infer<typeof clientRegisterSchema>;

// Reset Password Schema
export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Accept Team Invitation Schema
export const acceptInvitationSchema = z
    .object({
        name: z.string().optional(),
        prenom: z.string().optional(),
        telephone: z.string().optional(),
        password: z
            .string()
            .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;

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

// Schema pour la création (référence optionnelle car générée côté backend)
export const articleCreateSchema = articleBaseSchema
    .omit({ reference: true })
    .extend({
        // Champs optionnels pour les produits d'occasion
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

// Schema pour la mise à jour (tous les champs optionnels sauf validation)
export const articleUpdateSchema = articleBaseSchema.partial();

// Schema pour la création de pièces détachées (avec champs spécifiques)
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

export type ArticleCreateInput = z.infer<typeof articleCreateSchema>;
export type ArticleUpdateInput = z.infer<typeof articleUpdateSchema>;
export type PieceCreateInput = z.infer<typeof pieceCreateSchema>;

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

// Schema pour la création de niveau de fidélité
export const niveauFideliteCreateSchema = niveauFideliteBaseSchema;

// Schema pour la mise à jour de niveau de fidélité
export const niveauFideliteUpdateSchema = niveauFideliteBaseSchema.partial();

export type NiveauFideliteCreateInput = z.infer<
    typeof niveauFideliteCreateSchema
>;
export type NiveauFideliteUpdateInput = z.infer<
    typeof niveauFideliteUpdateSchema
>;

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
    dateExpiration: z.string().optional().or(z.literal("")),
});

// Schema pour la création de mouvement de points
export const mouvementPointsCreateSchema = mouvementPointsBaseSchema;

export type MouvementPointsCreateInput = z.infer<
    typeof mouvementPointsCreateSchema
>;

// ==========================================
// STORES - Magasins Multi-stores
// ==========================================

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

    // Localisation
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

    // Contact
    telephone: z
        .string()
        .max(20, "Le téléphone ne peut pas dépasser 20 caractères")
        .optional()
        .or(z.literal("")),
    email: z.string().email("Email invalide").optional().or(z.literal("")),

    // Configuration
    isMainStore: z.boolean().default(false),
    status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]).default("ACTIVE"),
    timezone: z.string().default("Europe/Paris"),

    // Horaires d'ouverture (JSON)
    openingHours: z.unknown().optional(),
});

// Schema pour la création de magasin
export const storeCreateSchema = storeBaseSchema;

// Schema pour la mise à jour (tous les champs optionnels)
export const storeUpdateSchema = storeBaseSchema.partial();

export type StoreCreateInput = z.infer<typeof storeCreateSchema>;
export type StoreUpdateInput = z.infer<typeof storeUpdateSchema>;

// ==========================================
// TERMINALS - Terminaux de paiement
// ==========================================

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

export type TerminalCreateInput = z.infer<typeof terminalCreateSchema>;
export type TerminalUpdateInput = z.infer<typeof terminalUpdateSchema>;

// ==========================================
// PAYMENT LINKS - Liens de paiement
// ==========================================

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

export type PaymentLinkCreateInput = z.infer<typeof paymentLinkCreateSchema>;
export type PaymentLinkUpdateInput = z.infer<typeof paymentLinkUpdateSchema>;

// ==========================================
// PERSONNEL / USERS - Gestion des employés
// ==========================================

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

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

// ==========================================
// AUTOMATIONS - Automatisations marketing
// ==========================================

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

export type AutomationCreateInput = z.infer<typeof automationCreateSchema>;
export type AutomationUpdateInput = z.infer<typeof automationUpdateSchema>;

// ============================================
// SYSTÈME D'OCCASION (BOUTIQUES INFORMATIQUE)
// ============================================

// Rachat d'articles d'occasion
export const rachatCreateSchema = z.object({
    // Données de l'article d'occasion à créer
    articleData: articleCreateSchema.extend({
        type: z.literal("OCCASION"),
    }),
    // Informations de rachat
    clientId: z.string().optional(),
    prixRachat: z
        .number({
            required_error: "Le prix de rachat est requis",
            invalid_type_error: "Le prix doit être un nombre",
        })
        .positive("Le prix de rachat doit être positif")
        .max(999999.99, "Le prix est trop élevé"),
    etat: z.enum(["COMME_NEUF", "TRES_BON", "BON", "CORRECT", "POUR_PIECES"], {
        required_error: "L'état est requis",
        invalid_type_error: "État invalide",
    }),
    provenance: z.enum(
        [
            "RACHAT_CLIENT",
            "MARKETPLACE_OCCASION",
            "REPRISE",
            "DON",
            "RETOUR_SAV",
            "AUTRE",
        ],
        {
            required_error: "La provenance est requise",
        }
    ),
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

export type RachatCreateInput = z.infer<typeof rachatCreateSchema>;

// Démontage d'articles d'occasion
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
                typeRessource: z.enum(
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
                        required_error: "Le type de ressource est requis",
                    }
                ),
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
                etat: z.enum(
                    ["COMME_NEUF", "TRES_BON", "BON", "CORRECT", "POUR_PIECES"],
                    {
                        required_error: "L'état est requis",
                    }
                ),
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

export type DemontageCreateInput = z.infer<typeof demontageCreateSchema>;

// Utilisation d'une ressource d'atelier
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

export type RessourceUtiliserInput = z.infer<typeof ressourceUtiliserSchema>;

// Mise à jour d'une ressource d'atelier
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
    etat: z
        .enum(["COMME_NEUF", "TRES_BON", "BON", "CORRECT", "POUR_PIECES"])
        .optional(),
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

export type RessourceUpdateInput = z.infer<typeof ressourceUpdateSchema>;

// ============================================
// RÉPARATIONS (BOUTIQUES INFORMATIQUE)
// ============================================

// Création d'une réparation
export const reparationCreateSchema = z.object({
    clientId: z.string().min(1, "Le client est requis"),
    typeAppareil: z.enum(
        [
            "PC_PORTABLE",
            "PC_BUREAU",
            "MAC",
            "SMARTPHONE",
            "TABLETTE",
            "CONSOLE_JEU",
            "SERVEUR",
            "PERIPHERIQUE",
            "AUTRE",
        ],
        {
            required_error: "Le type d'appareil est requis",
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
    priorite: z.enum(["NORMALE", "URGENTE", "CRITIQUE"]).default("NORMALE"),
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

export type ReparationCreateInput = z.infer<typeof reparationCreateSchema>;

// Mise à jour d'une réparation
export const reparationUpdateSchema = z.object({
    typeAppareil: z
        .enum([
            "PC_PORTABLE",
            "PC_BUREAU",
            "MAC",
            "SMARTPHONE",
            "TABLETTE",
            "CONSOLE_JEU",
            "SERVEUR",
            "PERIPHERIQUE",
            "AUTRE",
        ])
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
    priorite: z.enum(["NORMALE", "URGENTE", "CRITIQUE"]).optional(),
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

export type ReparationUpdateInput = z.infer<typeof reparationUpdateSchema>;

// Changement de statut
export const reparationStatusSchema = z.object({
    statut: z.enum(
        [
            "DEPOSE",
            "DIAGNOSTIC",
            "DEVIS_ENVOYE",
            "ATTENTE_PIECES",
            "EN_COURS",
            "PRETE",
            "LIVREE",
            "ANNULEE",
            "ABANDONNEE",
        ],
        {
            required_error: "Le statut est requis",
        }
    ),
    notes: z
        .string()
        .max(500, "Les notes ne peuvent pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
});

export type ReparationStatusInput = z.infer<typeof reparationStatusSchema>;

// Assignation technicien
export const reparationAssignSchema = z.object({
    technicienId: z.string().min(1, "Le technicien est requis"),
});

export type ReparationAssignInput = z.infer<typeof reparationAssignSchema>;

// Diagnostic
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

export type ReparationDiagnosticInput = z.infer<
    typeof reparationDiagnosticSchema
>;

// Ajout de pièce
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
        message:
            "Vous devez spécifier soit un article, soit une ressource d'atelier",
    });

export type ReparationAddPieceInput = z.infer<typeof reparationAddPieceSchema>;

// Intervention
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

export type ReparationInterventionInput = z.infer<
    typeof reparationInterventionSchema
>;

// ============================================
// GESTION DU PERSONNEL
// ============================================

// Base schema pour Employee
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

// Schema pour la création d'employé
export const employeeCreateSchema = employeeBaseSchema;

// Schema pour la mise à jour d'employé
export const employeeUpdateSchema = employeeBaseSchema.partial();

export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;
export type EmployeeUpdateInput = z.infer<typeof employeeUpdateSchema>;

// ============================================
// FITNESS - Types d'abonnements
// ============================================

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
    periodicite: z.enum(
        [
            "JOURNALIER",
            "HEBDOMADAIRE",
            "MENSUEL",
            "TRIMESTRIEL",
            "SEMESTRIEL",
            "ANNUEL",
            "ILLIMITE",
        ],
        {
            required_error: "La périodicité est requise",
        }
    ),
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

export type TypeAbonnementCreateInput = z.infer<
    typeof typeAbonnementCreateSchema
>;
export type TypeAbonnementUpdateInput = z.infer<
    typeof typeAbonnementUpdateSchema
>;

// ============================================
// FITNESS - Abonnements
// ============================================

export const abonnementBaseSchema = z.object({
    clientId: z.string().min(1, "Le client est requis"),
    typeAbonnementId: z.string().min(1, "Le type d'abonnement est requis"),
    dateDebut: z.coerce.date({
        required_error: "La date de début est requise",
    }),
    dateFin: z.coerce.date().optional().nullable(),
    statut: z
        .enum(["ACTIF", "SUSPENDU", "EXPIRE", "RESILIE", "EN_ATTENTE"])
        .default("ACTIF"),
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

export type AbonnementCreateInput = z.infer<typeof abonnementCreateSchema>;
export type AbonnementUpdateInput = z.infer<typeof abonnementUpdateSchema>;
