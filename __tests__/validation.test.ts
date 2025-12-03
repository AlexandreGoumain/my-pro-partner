// ==============================================
// TESTS - Validation Schemas (Zod)
// ==============================================
// Ces tests vérifient que les schémas de validation Zod
// acceptent les données valides et rejettent les invalides.

import { describe, it, expect } from "vitest";
import {
    chatMessageSchema,
    chatRequestSchema,
    createClientParamsSchema,
    updateClientParamsSchema,
    addLoyaltyPointsParamsSchema,
    adjustStockParamsSchema,
    createDocumentParamsSchema,
    addPaymentParamsSchema,
    deleteResourceParamsSchema,
    createCampaignParamsSchema,
    scheduleCampaignParamsSchema,
} from "@/lib/chatbot/validation";

// ==============================================
// Tests de chatMessageSchema
// ==============================================
describe("chatMessageSchema", () => {
    describe("données valides", () => {
        it("accepte un message user valide", () => {
            const result = chatMessageSchema.safeParse({
                role: "user",
                content: "Bonjour !",
            });
            expect(result.success).toBe(true);
        });

        it("accepte un message assistant valide", () => {
            const result = chatMessageSchema.safeParse({
                role: "assistant",
                content: "Comment puis-je vous aider ?",
            });
            expect(result.success).toBe(true);
        });

        it("accepte un message system valide", () => {
            const result = chatMessageSchema.safeParse({
                role: "system",
                content: "Tu es un assistant ERP.",
            });
            expect(result.success).toBe(true);
        });
    });

    describe("données invalides", () => {
        it("rejette un rôle invalide", () => {
            const result = chatMessageSchema.safeParse({
                role: "admin",
                content: "Test",
            });
            expect(result.success).toBe(false);
        });

        it("rejette un contenu vide", () => {
            const result = chatMessageSchema.safeParse({
                role: "user",
                content: "",
            });
            expect(result.success).toBe(false);
        });

        it("rejette un contenu trop long (>10000)", () => {
            const result = chatMessageSchema.safeParse({
                role: "user",
                content: "a".repeat(10001),
            });
            expect(result.success).toBe(false);
        });

        it("rejette les balises script", () => {
            const result = chatMessageSchema.safeParse({
                role: "user",
                content: "<script>alert(1)</script>",
            });
            expect(result.success).toBe(false);
        });

        it("rejette <script en majuscules", () => {
            const result = chatMessageSchema.safeParse({
                role: "user",
                content: "<SCRIPT>alert(1)</SCRIPT>",
            });
            expect(result.success).toBe(false);
        });
    });
});

// ==============================================
// Tests de chatRequestSchema
// ==============================================
describe("chatRequestSchema", () => {
    describe("données valides", () => {
        it("accepte une requête avec un message", () => {
            const result = chatRequestSchema.safeParse({
                messages: [{ role: "user", content: "Bonjour" }],
            });
            expect(result.success).toBe(true);
        });

        it("accepte une requête avec plusieurs messages", () => {
            const result = chatRequestSchema.safeParse({
                messages: [
                    { role: "user", content: "Bonjour" },
                    { role: "assistant", content: "Bonjour !" },
                    { role: "user", content: "Aide-moi" },
                ],
            });
            expect(result.success).toBe(true);
        });

        it("accepte une requête avec conversationId valide", () => {
            const result = chatRequestSchema.safeParse({
                messages: [{ role: "user", content: "Test" }],
                conversationId: "550e8400-e29b-41d4-a716-446655440000",
            });
            expect(result.success).toBe(true);
        });

        it("accepte conversationId null", () => {
            const result = chatRequestSchema.safeParse({
                messages: [{ role: "user", content: "Test" }],
                conversationId: null,
            });
            expect(result.success).toBe(true);
        });
    });

    describe("données invalides", () => {
        it("rejette une requête sans messages", () => {
            const result = chatRequestSchema.safeParse({
                messages: [],
            });
            expect(result.success).toBe(false);
        });

        it("rejette plus de 50 messages", () => {
            const messages = Array(51)
                .fill(null)
                .map(() => ({ role: "user" as const, content: "Test" }));
            const result = chatRequestSchema.safeParse({ messages });
            expect(result.success).toBe(false);
        });

        it("rejette un conversationId invalide", () => {
            const result = chatRequestSchema.safeParse({
                messages: [{ role: "user", content: "Test" }],
                conversationId: "not-a-uuid",
            });
            expect(result.success).toBe(false);
        });
    });
});

// ==============================================
// Tests de createClientParamsSchema
// ==============================================
describe("createClientParamsSchema", () => {
    it("accepte un client minimal (nom seulement)", () => {
        const result = createClientParamsSchema.safeParse({ nom: "Dupont" });
        expect(result.success).toBe(true);
    });

    it("accepte un client complet", () => {
        const result = createClientParamsSchema.safeParse({
            nom: "Dupont",
            prenom: "Jean",
            email: "jean@example.com",
            telephone: "0612345678",
            adresse: "123 rue de Paris",
            codePostal: "75001",
            ville: "Paris",
            pays: "France",
        });
        expect(result.success).toBe(true);
    });

    it("accepte un email vide (optionnel)", () => {
        const result = createClientParamsSchema.safeParse({
            nom: "Dupont",
            email: "",
        });
        expect(result.success).toBe(true);
    });

    it("rejette un nom vide", () => {
        const result = createClientParamsSchema.safeParse({ nom: "" });
        expect(result.success).toBe(false);
    });

    it("rejette un email invalide", () => {
        const result = createClientParamsSchema.safeParse({
            nom: "Dupont",
            email: "pas-un-email",
        });
        expect(result.success).toBe(false);
    });

    it("rejette un nom trop long (>100)", () => {
        const result = createClientParamsSchema.safeParse({
            nom: "a".repeat(101),
        });
        expect(result.success).toBe(false);
    });
});

// ==============================================
// Tests de addLoyaltyPointsParamsSchema
// ==============================================
describe("addLoyaltyPointsParamsSchema", () => {
    it("accepte des points positifs", () => {
        const result = addLoyaltyPointsParamsSchema.safeParse({
            clientId: "550e8400-e29b-41d4-a716-446655440000",
            points: 100,
        });
        expect(result.success).toBe(true);
    });

    it("accepte des points négatifs (retrait)", () => {
        const result = addLoyaltyPointsParamsSchema.safeParse({
            clientId: "550e8400-e29b-41d4-a716-446655440000",
            points: -50,
        });
        expect(result.success).toBe(true);
    });

    it("accepte un motif optionnel", () => {
        const result = addLoyaltyPointsParamsSchema.safeParse({
            clientId: "550e8400-e29b-41d4-a716-446655440000",
            points: 100,
            motif: "Achat fidélité",
        });
        expect(result.success).toBe(true);
    });

    it("rejette des points trop élevés (>10000)", () => {
        const result = addLoyaltyPointsParamsSchema.safeParse({
            clientId: "550e8400-e29b-41d4-a716-446655440000",
            points: 10001,
        });
        expect(result.success).toBe(false);
    });

    it("rejette des points trop bas (<-10000)", () => {
        const result = addLoyaltyPointsParamsSchema.safeParse({
            clientId: "550e8400-e29b-41d4-a716-446655440000",
            points: -10001,
        });
        expect(result.success).toBe(false);
    });

    it("rejette des points décimaux", () => {
        const result = addLoyaltyPointsParamsSchema.safeParse({
            clientId: "550e8400-e29b-41d4-a716-446655440000",
            points: 10.5,
        });
        expect(result.success).toBe(false);
    });
});

// ==============================================
// Tests de adjustStockParamsSchema
// ==============================================
describe("adjustStockParamsSchema", () => {
    it("accepte un ajustement valide", () => {
        const result = adjustStockParamsSchema.safeParse({
            articleId: "550e8400-e29b-41d4-a716-446655440000",
            quantite: 10,
            type: "ENTREE",
        });
        expect(result.success).toBe(true);
    });

    it("accepte tous les types de mouvement", () => {
        const types = ["ENTREE", "SORTIE", "AJUSTEMENT", "INVENTAIRE", "RETOUR"] as const;
        types.forEach((type) => {
            const result = adjustStockParamsSchema.safeParse({
                articleId: "550e8400-e29b-41d4-a716-446655440000",
                quantite: 10,
                type,
            });
            expect(result.success).toBe(true);
        });
    });

    it("rejette un type invalide", () => {
        const result = adjustStockParamsSchema.safeParse({
            articleId: "550e8400-e29b-41d4-a716-446655440000",
            quantite: 10,
            type: "VENTE",
        });
        expect(result.success).toBe(false);
    });
});

// ==============================================
// Tests de createDocumentParamsSchema
// ==============================================
describe("createDocumentParamsSchema", () => {
    it("accepte un document valide", () => {
        const result = createDocumentParamsSchema.safeParse({
            type: "FACTURE",
            clientId: "550e8400-e29b-41d4-a716-446655440000",
            lignes: [
                {
                    articleId: "550e8400-e29b-41d4-a716-446655440001",
                    quantite: 2,
                },
            ],
        });
        expect(result.success).toBe(true);
    });

    it("accepte tous les types de document", () => {
        const types = ["DEVIS", "FACTURE", "AVOIR"] as const;
        types.forEach((type) => {
            const result = createDocumentParamsSchema.safeParse({
                type,
                clientId: "550e8400-e29b-41d4-a716-446655440000",
                lignes: [{ articleId: "550e8400-e29b-41d4-a716-446655440001", quantite: 1 }],
            });
            expect(result.success).toBe(true);
        });
    });

    it("rejette une quantité de 0", () => {
        const result = createDocumentParamsSchema.safeParse({
            type: "FACTURE",
            clientId: "550e8400-e29b-41d4-a716-446655440000",
            lignes: [{ articleId: "550e8400-e29b-41d4-a716-446655440001", quantite: 0 }],
        });
        expect(result.success).toBe(false);
    });
});

// ==============================================
// Tests de addPaymentParamsSchema
// ==============================================
describe("addPaymentParamsSchema", () => {
    it("accepte un paiement valide", () => {
        const result = addPaymentParamsSchema.safeParse({
            documentId: "550e8400-e29b-41d4-a716-446655440000",
            montant: 100.50,
            methode: "CARTE",
        });
        expect(result.success).toBe(true);
    });

    it("accepte toutes les méthodes de paiement", () => {
        const methodes = ["ESPECES", "CARTE", "VIREMENT", "CHEQUE", "AUTRE"] as const;
        methodes.forEach((methode) => {
            const result = addPaymentParamsSchema.safeParse({
                documentId: "550e8400-e29b-41d4-a716-446655440000",
                montant: 50,
                methode,
            });
            expect(result.success).toBe(true);
        });
    });

    it("rejette un montant de 0", () => {
        const result = addPaymentParamsSchema.safeParse({
            documentId: "550e8400-e29b-41d4-a716-446655440000",
            montant: 0,
            methode: "CARTE",
        });
        expect(result.success).toBe(false);
    });

    it("rejette un montant trop élevé (>1000000)", () => {
        const result = addPaymentParamsSchema.safeParse({
            documentId: "550e8400-e29b-41d4-a716-446655440000",
            montant: 1000001,
            methode: "CARTE",
        });
        expect(result.success).toBe(false);
    });
});

// ==============================================
// Tests de deleteResourceParamsSchema
// ==============================================
describe("deleteResourceParamsSchema", () => {
    it("accepte une suppression confirmée", () => {
        const result = deleteResourceParamsSchema.safeParse({
            id: "550e8400-e29b-41d4-a716-446655440000",
            confirmation: true,
        });
        expect(result.success).toBe(true);
    });

    it("rejette sans confirmation", () => {
        const result = deleteResourceParamsSchema.safeParse({
            id: "550e8400-e29b-41d4-a716-446655440000",
        });
        expect(result.success).toBe(false);
    });

    it("rejette avec confirmation = false", () => {
        const result = deleteResourceParamsSchema.safeParse({
            id: "550e8400-e29b-41d4-a716-446655440000",
            confirmation: false,
        });
        expect(result.success).toBe(false);
    });
});

// ==============================================
// Tests de createCampaignParamsSchema
// ==============================================
describe("createCampaignParamsSchema", () => {
    it("accepte une campagne email valide", () => {
        const result = createCampaignParamsSchema.safeParse({
            nom: "Promo été",
            type: "EMAIL",
            segmentId: "550e8400-e29b-41d4-a716-446655440000",
            contenu: "Profitez de nos offres !",
            subject: "Offre spéciale",
        });
        expect(result.success).toBe(true);
    });

    it("accepte tous les types de campagne", () => {
        const types = ["EMAIL", "SMS", "NOTIFICATION"] as const;
        types.forEach((type) => {
            const result = createCampaignParamsSchema.safeParse({
                nom: "Test",
                type,
                segmentId: "550e8400-e29b-41d4-a716-446655440000",
                contenu: "Contenu",
            });
            expect(result.success).toBe(true);
        });
    });

    it("rejette un contenu vide", () => {
        const result = createCampaignParamsSchema.safeParse({
            nom: "Test",
            type: "EMAIL",
            segmentId: "550e8400-e29b-41d4-a716-446655440000",
            contenu: "",
        });
        expect(result.success).toBe(false);
    });
});

// ==============================================
// Tests de scheduleCampaignParamsSchema
// ==============================================
describe("scheduleCampaignParamsSchema", () => {
    it("accepte une date ISO valide", () => {
        const result = scheduleCampaignParamsSchema.safeParse({
            campaignId: "550e8400-e29b-41d4-a716-446655440000",
            scheduledAt: "2025-12-25T10:00:00.000Z",
        });
        expect(result.success).toBe(true);
    });

    it("rejette une date invalide", () => {
        const result = scheduleCampaignParamsSchema.safeParse({
            campaignId: "550e8400-e29b-41d4-a716-446655440000",
            scheduledAt: "demain",
        });
        expect(result.success).toBe(false);
    });

    it("rejette un campaignId invalide", () => {
        const result = scheduleCampaignParamsSchema.safeParse({
            campaignId: "not-a-uuid",
            scheduledAt: "2025-12-25T10:00:00.000Z",
        });
        expect(result.success).toBe(false);
    });
});
