// ============================================
// CHATBOT VALIDATION SCHEMAS
// ============================================

import { z } from "zod";

/**
 * Schéma de validation pour un message du chatbot
 * - Rôle limité à user, assistant, system
 * - Contenu entre 1 et 10,000 caractères
 * - Pas de balises script
 */
export const chatMessageSchema = z.object({
    role: z.enum(["user", "assistant", "system"], {
        errorMap: () => ({ message: "Role must be user, assistant, or system" }),
    }),
    content: z
        .string()
        .min(1, "Message cannot be empty")
        .max(10000, "Message too long (max 10,000 characters)")
        .refine(
            (val) => !val.toLowerCase().includes("<script"),
            "Script tags are not allowed"
        ),
});

/**
 * Schéma de validation pour une requête chatbot complète
 * - Entre 1 et 50 messages
 * - ConversationId optionnel mais doit être un UUID si fourni
 */
export const chatRequestSchema = z.object({
    messages: z
        .array(chatMessageSchema)
        .min(1, "At least one message required")
        .max(50, "Too many messages (max 50)"),
    conversationId: z.string().uuid("Invalid conversation ID").nullish(),
});

/**
 * Type inféré du schéma de requête
 */
export type ChatRequest = z.infer<typeof chatRequestSchema>;

/**
 * Type inféré du schéma de message
 */
export type ChatMessage = z.infer<typeof chatMessageSchema>;

// ============================================
// VALIDATION DES PARAMÈTRES D'ACTIONS
// ============================================

/**
 * Schéma pour création de client
 */
export const createClientParamsSchema = z.object({
    nom: z.string().min(1).max(100),
    prenom: z.string().min(1).max(100).optional(),
    email: z.string().email().optional().or(z.literal("")),
    telephone: z.string().max(20).optional(),
    adresse: z.string().max(200).optional(),
    codePostal: z.string().max(10).optional(),
    ville: z.string().max(100).optional(),
    pays: z.string().max(100).optional(),
});

/**
 * Schéma pour modification de client
 */
export const updateClientParamsSchema = z.object({
    clientId: z.string().uuid(),
    nom: z.string().min(1).max(100).optional(),
    prenom: z.string().min(1).max(100).optional(),
    email: z.string().email().optional().or(z.literal("")),
    telephone: z.string().max(20).optional(),
    adresse: z.string().max(200).optional(),
    codePostal: z.string().max(10).optional(),
    ville: z.string().max(100).optional(),
    pays: z.string().max(100).optional(),
});

/**
 * Schéma pour ajout de points de fidélité
 */
export const addLoyaltyPointsParamsSchema = z.object({
    clientId: z.string().uuid(),
    points: z
        .number()
        .int()
        .min(-10000, "Points adjustment too large (min -10,000)")
        .max(10000, "Points adjustment too large (max 10,000)"),
    motif: z.string().max(200).optional(),
});

/**
 * Schéma pour ajustement de stock
 */
export const adjustStockParamsSchema = z.object({
    articleId: z.string().uuid(),
    quantite: z
        .number()
        .int()
        .min(-10000, "Quantity too large (min -10,000)")
        .max(10000, "Quantity too large (max 10,000)"),
    type: z.enum(["ENTREE", "SORTIE", "AJUSTEMENT", "INVENTAIRE", "RETOUR"]),
    motif: z.string().max(200).optional(),
});

/**
 * Schéma pour création de document
 */
export const createDocumentParamsSchema = z.object({
    type: z.enum(["DEVIS", "FACTURE", "AVOIR"]),
    clientId: z.string().uuid(),
    lignes: z.array(
        z.object({
            articleId: z.string().uuid(),
            quantite: z.number().int().min(1).max(10000),
            prixUnitaire: z.number().min(0).max(1000000).optional(),
        })
    ),
    notes: z.string().max(1000).optional(),
});

/**
 * Schéma pour ajout de paiement
 */
export const addPaymentParamsSchema = z.object({
    documentId: z.string().uuid(),
    montant: z.number().min(0.01).max(1000000),
    methode: z.enum(["ESPECES", "CARTE", "VIREMENT", "CHEQUE", "AUTRE"]),
    reference: z.string().max(100).optional(),
    notes: z.string().max(500).optional(),
});

/**
 * Schéma pour suppression
 */
export const deleteResourceParamsSchema = z.object({
    id: z.string().uuid(),
    confirmation: z.literal(true, {
        errorMap: () => ({
            message: "Deletion requires explicit confirmation",
        }),
    }),
});

/**
 * Schéma pour création de campagne
 */
export const createCampaignParamsSchema = z.object({
    nom: z.string().min(1).max(200),
    type: z.enum(["EMAIL", "SMS", "NOTIFICATION"]),
    segmentId: z.string().uuid(),
    contenu: z.string().min(1).max(5000),
    subject: z.string().min(1).max(200).optional(),
});

/**
 * Schéma pour programmation de campagne
 */
export const scheduleCampaignParamsSchema = z.object({
    campaignId: z.string().uuid(),
    scheduledAt: z.string().datetime(),
});
