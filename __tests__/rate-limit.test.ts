// ==============================================
// TESTS - Rate Limit (Fonctions pures)
// ==============================================
// Ces tests vérifient la logique de sélection des rate limiters.
// Note: Les fonctions async utilisant Redis nécessitent des mocks.

import { describe, it, expect } from "vitest";
import { getRateLimitForPlan } from "@/lib/chatbot/security/rate-limit";

// ==============================================
// Tests de getRateLimitForPlan
// ==============================================
describe("getRateLimitForPlan", () => {
    it("retourne 0 pour le plan FREE (pas d'accès)", () => {
        expect(getRateLimitForPlan("FREE")).toBe(0);
    });

    it("retourne 5 pour le plan STARTER", () => {
        expect(getRateLimitForPlan("STARTER")).toBe(5);
    });

    it("retourne 20 pour le plan PRO", () => {
        expect(getRateLimitForPlan("PRO")).toBe(20);
    });

    it("retourne 50 pour le plan ENTERPRISE", () => {
        expect(getRateLimitForPlan("ENTERPRISE")).toBe(50);
    });

    it("retourne 5 (fallback STARTER) pour un plan inconnu", () => {
        // @ts-expect-error Testing unknown plan
        expect(getRateLimitForPlan("UNKNOWN")).toBe(5);
    });

    describe("hiérarchie des limites", () => {
        it("FREE < STARTER < PRO < ENTERPRISE", () => {
            const free = getRateLimitForPlan("FREE");
            const starter = getRateLimitForPlan("STARTER");
            const pro = getRateLimitForPlan("PRO");
            const enterprise = getRateLimitForPlan("ENTERPRISE");

            expect(free).toBeLessThan(starter);
            expect(starter).toBeLessThan(pro);
            expect(pro).toBeLessThan(enterprise);
        });
    });
});
