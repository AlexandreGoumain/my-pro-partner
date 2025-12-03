// ==============================================
// TESTS - Plan Helpers (Erreurs et limites)
// ==============================================
// Ces tests vérifient les helpers de création d'erreurs pour les plans.
// Les fonctions async (checkCanAdd*, etc.) nécessitent des mocks Prisma.

import { describe, it, expect } from "vitest";
import {
    createLimitError,
    createFeatureError,
} from "@/lib/utils/plan-helpers";

// ==============================================
// Tests de createLimitError
// ==============================================
describe("createLimitError", () => {
    it("retourne une erreur avec le bon format", () => {
        const error = createLimitError("maxClients");

        expect(error).toHaveProperty("error");
        expect(error).toHaveProperty("limitReached", true);
        expect(error).toHaveProperty("limitName", "maxClients");
        expect(error).toHaveProperty("upgradeRequired", true);
    });

    it("inclut le nom de la limite", () => {
        const error = createLimitError("maxDocumentsPerMonth");
        expect(error.limitName).toBe("maxDocumentsPerMonth");
    });

    it("indique que l'upgrade est requis", () => {
        const error = createLimitError("maxUsers");
        expect(error.upgradeRequired).toBe(true);
    });

    it("contient un message d'erreur lisible", () => {
        const error = createLimitError("maxProducts");
        expect(error.error).toContain("Limite");
    });

    describe("différentes limites", () => {
        const limits = [
            "maxClients",
            "maxProducts",
            "maxUsers",
            "maxDocumentsPerMonth",
            "maxSegments",
            "maxAutomations",
            "maxStores",
        ];

        it.each(limits)("fonctionne pour la limite %s", (limitName) => {
            const error = createLimitError(limitName);
            expect(error.limitName).toBe(limitName);
            expect(error.limitReached).toBe(true);
        });
    });
});

// ==============================================
// Tests de createFeatureError
// ==============================================
describe("createFeatureError", () => {
    it("retourne une erreur avec le bon format", () => {
        const error = createFeatureError("aiChatbot");

        expect(error).toHaveProperty("error");
        expect(error).toHaveProperty("featureUnavailable", true);
        expect(error).toHaveProperty("featureName", "aiChatbot");
        expect(error).toHaveProperty("upgradeRequired", true);
    });

    it("inclut le nom de la feature", () => {
        const error = createFeatureError("advancedAnalytics");
        expect(error.featureName).toBe("advancedAnalytics");
    });

    it("indique que l'upgrade est requis", () => {
        const error = createFeatureError("bulkImport");
        expect(error.upgradeRequired).toBe(true);
    });

    it("contient un message d'erreur lisible", () => {
        const error = createFeatureError("automation");
        expect(error.error).toContain("fonctionnalité");
        expect(error.error).toContain("disponible");
    });

    describe("différentes features", () => {
        const features = [
            "aiChatbot",
            "advancedAnalytics",
            "automation",
            "bulkImport",
            "customBranding",
            "apiAccess",
        ];

        it.each(features)("fonctionne pour la feature %s", (featureName) => {
            const error = createFeatureError(featureName);
            expect(error.featureName).toBe(featureName);
            expect(error.featureUnavailable).toBe(true);
        });
    });
});

// ==============================================
// Tests de cohérence entre les deux erreurs
// ==============================================
describe("cohérence des erreurs", () => {
    it("les deux types ont upgradeRequired = true", () => {
        const limitError = createLimitError("maxClients");
        const featureError = createFeatureError("aiChatbot");

        expect(limitError.upgradeRequired).toBe(featureError.upgradeRequired);
    });

    it("les deux types ont un message error", () => {
        const limitError = createLimitError("maxClients");
        const featureError = createFeatureError("aiChatbot");

        expect(limitError.error).toBeDefined();
        expect(featureError.error).toBeDefined();
        expect(limitError.error.length).toBeGreaterThan(0);
        expect(featureError.error.length).toBeGreaterThan(0);
    });

    it("les erreurs sont distinguables par leur propriété", () => {
        const limitError = createLimitError("maxClients");
        const featureError = createFeatureError("aiChatbot");

        // Limite a limitReached, Feature a featureUnavailable
        expect(limitError.limitReached).toBe(true);
        expect((limitError as Record<string, unknown>).featureUnavailable).toBeUndefined();

        expect(featureError.featureUnavailable).toBe(true);
        expect((featureError as Record<string, unknown>).limitReached).toBeUndefined();
    });
});
