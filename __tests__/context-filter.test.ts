// ==============================================
// TESTS CRITIQUES - Context Filter (Questions hors-sujet)
// ==============================================
// Ces tests vérifient que le filtre de contexte détecte les questions
// hors-sujet et autorise les questions ERP légitimes.

import { describe, it, expect } from "vitest";
import {
    checkContext,
    getOffTopicHelpMessage,
} from "@/lib/chatbot/security/context-filter";

// ==============================================
// Tests de checkContext - Questions ERP légitimes
// ==============================================
describe("checkContext", () => {
    describe("devrait AUTORISER les questions ERP", () => {
        it("autorise les questions sur les clients", () => {
            expect(checkContext("combien de clients j'ai ?").isOnTopic).toBe(true);
            expect(checkContext("montre moi mes clients").isOnTopic).toBe(true);
            expect(checkContext("recherche client Dupont").isOnTopic).toBe(true);
            expect(checkContext("créer un nouveau client").isOnTopic).toBe(true);
        });

        it("autorise les questions sur le stock", () => {
            expect(checkContext("quel est mon stock ?").isOnTopic).toBe(true);
            expect(checkContext("articles en rupture").isOnTopic).toBe(true);
            expect(checkContext("alerte stock faible").isOnTopic).toBe(true);
        });

        it("autorise les questions sur les documents", () => {
            expect(checkContext("factures impayées").isOnTopic).toBe(true);
            expect(checkContext("créer un devis").isOnTopic).toBe(true);
            expect(checkContext("mes avoirs").isOnTopic).toBe(true);
        });

        it("autorise les questions sur les statistiques", () => {
            expect(checkContext("quel est mon CA ce mois ?").isOnTopic).toBe(true);
            expect(checkContext("mes KPIs").isOnTopic).toBe(true);
            expect(checkContext("statistiques de ventes").isOnTopic).toBe(true);
        });

        it("autorise les questions sur le marketing", () => {
            expect(checkContext("mes segments").isOnTopic).toBe(true);
            expect(checkContext("créer une campagne").isOnTopic).toBe(true);
            expect(checkContext("mes meilleurs clients").isOnTopic).toBe(true);
        });

        it("autorise les questions sur la fidélité", () => {
            expect(checkContext("points de fidélité").isOnTopic).toBe(true);
            expect(checkContext("programme fidélité").isOnTopic).toBe(true);
        });
    });

    describe("devrait AUTORISER les salutations et politesses", () => {
        it("autorise les salutations", () => {
            expect(checkContext("bonjour").isOnTopic).toBe(true);
            expect(checkContext("Bonjour !").isOnTopic).toBe(true);
            expect(checkContext("salut").isOnTopic).toBe(true);
            expect(checkContext("hello").isOnTopic).toBe(true);
            expect(checkContext("coucou").isOnTopic).toBe(true);
            expect(checkContext("bonsoir").isOnTopic).toBe(true);
        });

        it("autorise les remerciements", () => {
            expect(checkContext("merci").isOnTopic).toBe(true);
            expect(checkContext("thanks").isOnTopic).toBe(true);
            expect(checkContext("ok").isOnTopic).toBe(true);
            expect(checkContext("super").isOnTopic).toBe(true);
            expect(checkContext("parfait").isOnTopic).toBe(true);
        });

        it("donne un score de 100 aux salutations", () => {
            expect(checkContext("bonjour").relevanceScore).toBe(100);
            expect(checkContext("merci").relevanceScore).toBe(100);
        });
    });

    describe("devrait BLOQUER les questions hors-sujet", () => {
        it("bloque les questions météo", () => {
            expect(checkContext("quel temps fait-il ?").isOnTopic).toBe(false);
            expect(checkContext("météo demain").isOnTopic).toBe(false);
            expect(checkContext("il pleut ?").isOnTopic).toBe(false);
        });

        it("bloque les questions de culture générale", () => {
            expect(checkContext("capitale de la France").isOnTopic).toBe(false);
            expect(checkContext("qui a inventé l'électricité").isOnTopic).toBe(false);
            expect(checkContext("en quelle année Napoléon est mort").isOnTopic).toBe(false);
            expect(checkContext("combien de pays en Europe").isOnTopic).toBe(false);
        });

        it("bloque les demandes de divertissement", () => {
            expect(checkContext("raconte moi une blague").isOnTopic).toBe(false);
            expect(checkContext("chante une chanson").isOnTopic).toBe(false);
            expect(checkContext("qui va gagner le match").isOnTopic).toBe(false);
        });

        it("bloque les questions personnelles sur l'IA", () => {
            expect(checkContext("qui es-tu ?").isOnTopic).toBe(false);
            expect(checkContext("comment tu t'appelles").isOnTopic).toBe(false);
            expect(checkContext("tu penses quoi de X").isOnTopic).toBe(false);
            expect(checkContext("es-tu un robot").isOnTopic).toBe(false);
        });

        it("bloque les questions de code/programmation", () => {
            expect(checkContext("écris moi un code Python").isOnTopic).toBe(false);
            expect(checkContext("comment coder en JavaScript").isOnTopic).toBe(false);
        });

        it("bloque les questions de recettes", () => {
            expect(checkContext("recette de gâteau au chocolat").isOnTopic).toBe(false);
            expect(checkContext("comment préparer un plat").isOnTopic).toBe(false);
        });

        it("bloque les questions de santé", () => {
            expect(checkContext("symptômes du rhume").isOnTopic).toBe(false);
            expect(checkContext("quel médicament prendre").isOnTopic).toBe(false);
            expect(checkContext("j'ai mal à la tête").isOnTopic).toBe(false);
        });

        it("bloque les questions de voyage", () => {
            expect(checkContext("où se trouve Paris").isOnTopic).toBe(false);
            expect(checkContext("comment aller à Londres").isOnTopic).toBe(false);
            expect(checkContext("hôtel pas cher").isOnTopic).toBe(false);
        });

        it("bloque les questions d'actualité", () => {
            expect(checkContext("dernières nouvelles").isOnTopic).toBe(false);
            expect(checkContext("que se passe-t-il dans le monde").isOnTopic).toBe(false);
        });

        it("bloque les questions de maths générales", () => {
            expect(checkContext("combien font 2+2").isOnTopic).toBe(false);
            expect(checkContext("résoudre cette équation").isOnTopic).toBe(false);
        });
    });

    describe("devrait donner un score de 0 aux hors-sujet évidents", () => {
        it("score = 0 pour questions clairement hors-sujet", () => {
            expect(checkContext("quel temps fait-il ?").relevanceScore).toBe(0);
            expect(checkContext("raconte moi une blague").relevanceScore).toBe(0);
            expect(checkContext("qui es-tu ?").relevanceScore).toBe(0);
        });
    });

    describe("devrait retourner une reason pour les hors-sujet", () => {
        it("retourne une reason explicative", () => {
            const result = checkContext("quel temps fait-il ?");
            expect(result.reason).toBeDefined();
            expect(result.reason).toContain("ERP");
        });

        it("ne retourne pas de reason si on-topic", () => {
            const result = checkContext("mes clients");
            expect(result.reason).toBeUndefined();
        });
    });

    describe("devrait gérer les cas limites", () => {
        it("pénalise les messages très courts sans contexte", () => {
            const result = checkContext("ok"); // Mais "ok" est une politesse donc score 100
            // Messages très courts sans keywords ERP ont un score bas
            const shortResult = checkContext("xyz");
            expect(shortResult.relevanceScore).toBeLessThan(50);
        });

        it("augmente le score avec les mots-clés ERP", () => {
            const noKeywords = checkContext("quelque chose");
            const withKeywords = checkContext("client facture stock");
            expect(withKeywords.relevanceScore).toBeGreaterThan(noKeywords.relevanceScore);
        });

        it("augmente le score avec les intentions ERP", () => {
            const result = checkContext("montre moi mes clients");
            expect(result.relevanceScore).toBeGreaterThan(50);
        });
    });
});

// ==============================================
// Tests de getOffTopicHelpMessage
// ==============================================
describe("getOffTopicHelpMessage", () => {
    it("retourne un message d'aide", () => {
        const message = getOffTopicHelpMessage();
        expect(message).toBeDefined();
        expect(message.length).toBeGreaterThan(0);
    });

    it("mentionne les fonctionnalités principales", () => {
        const message = getOffTopicHelpMessage();
        expect(message).toContain("Analytics");
        expect(message).toContain("Clients");
        expect(message).toContain("Stock");
        expect(message).toContain("Documents");
        expect(message).toContain("Marketing");
    });

    it("mentionne MyProPartner", () => {
        const message = getOffTopicHelpMessage();
        expect(message).toContain("MyProPartner");
    });
});
