// ==============================================
// TESTS - Payment Utils (Calculs paiements)
// ==============================================
// Ces tests vérifient les fonctions de calcul de paiements
// utilisées pour les factures et la gestion de trésorerie.

import { describe, it, expect } from "vitest";
import {
    eurosToCents,
    centsToEuros,
    formatCurrency,
    calculatePaymentSummary,
    isFullyPaid,
    calculateRemainingAmount,
    validatePaymentAmount,
    toNumber,
    truncateId,
} from "@/lib/utils/payment-utils";

// ==============================================
// Tests de eurosToCents
// ==============================================
describe("eurosToCents", () => {
    it("convertit les euros en centimes", () => {
        expect(eurosToCents(10)).toBe(1000);
        expect(eurosToCents(1)).toBe(100);
        expect(eurosToCents(0.5)).toBe(50);
    });

    it("arrondit correctement les centimes", () => {
        // 10.999€ → 1100 centimes (arrondi)
        expect(eurosToCents(10.999)).toBe(1100);
        expect(eurosToCents(10.994)).toBe(1099);
    });

    it("gère zéro", () => {
        expect(eurosToCents(0)).toBe(0);
    });

    it("gère les petits montants", () => {
        expect(eurosToCents(0.01)).toBe(1);
        expect(eurosToCents(0.99)).toBe(99);
    });
});

// ==============================================
// Tests de centsToEuros
// ==============================================
describe("centsToEuros", () => {
    it("convertit les centimes en euros", () => {
        expect(centsToEuros(1000)).toBe(10);
        expect(centsToEuros(100)).toBe(1);
        expect(centsToEuros(50)).toBe(0.5);
    });

    it("gère zéro", () => {
        expect(centsToEuros(0)).toBe(0);
    });

    it("gère les petits montants", () => {
        expect(centsToEuros(1)).toBe(0.01);
        expect(centsToEuros(99)).toBe(0.99);
    });
});

// ==============================================
// Tests de formatCurrency
// ==============================================
describe("formatCurrency", () => {
    it("formate en euros par défaut", () => {
        const result = formatCurrency(1234.56);
        expect(result).toContain("1");
        expect(result).toContain("234");
        expect(result).toContain("€");
    });

    it("formate zéro", () => {
        const result = formatCurrency(0);
        expect(result).toContain("0");
        expect(result).toContain("€");
    });

    it("accepte une devise personnalisée", () => {
        const result = formatCurrency(100, "USD");
        expect(result).toContain("$");
    });
});

// ==============================================
// Tests de calculatePaymentSummary
// ==============================================
describe("calculatePaymentSummary", () => {
    const mockPayments = [
        { montant: 100, date_paiement: new Date("2025-01-15") },
        { montant: 50, date_paiement: new Date("2025-01-10") },
        { montant: 25, date_paiement: new Date("2025-01-20") },
    ];

    it("calcule le total payé", () => {
        const result = calculatePaymentSummary(mockPayments as never[], 200);
        expect(result.totalPaid).toBe(175);
    });

    it("calcule le reste à payer", () => {
        const result = calculatePaymentSummary(mockPayments as never[], 200);
        expect(result.remainingAmount).toBe(25);
    });

    it("compte le nombre de paiements", () => {
        const result = calculatePaymentSummary(mockPayments as never[], 200);
        expect(result.paymentCount).toBe(3);
    });

    it("retourne la date du dernier paiement", () => {
        const result = calculatePaymentSummary(mockPayments as never[], 200);
        expect(result.lastPaymentDate).toEqual(new Date("2025-01-20"));
    });

    it("gère un tableau de paiements vide", () => {
        const result = calculatePaymentSummary([], 100);

        expect(result.totalPaid).toBe(0);
        expect(result.remainingAmount).toBe(100);
        expect(result.paymentCount).toBe(0);
        expect(result.lastPaymentDate).toBeNull();
    });

    it("arrondit les montants à 2 décimales", () => {
        const payments = [{ montant: 33.333, date_paiement: new Date() }];
        const result = calculatePaymentSummary(payments as never[], 100);

        expect(result.totalPaid).toBe(33.33);
        expect(result.remainingAmount).toBe(66.67);
    });
});

// ==============================================
// Tests de isFullyPaid
// ==============================================
describe("isFullyPaid", () => {
    it("retourne true si payé en totalité", () => {
        expect(isFullyPaid(100, 100)).toBe(true);
    });

    it("retourne true si surpayé", () => {
        expect(isFullyPaid(100, 150)).toBe(true);
    });

    it("retourne false si paiement partiel", () => {
        expect(isFullyPaid(100, 50)).toBe(false);
    });

    it("retourne false si aucun paiement", () => {
        expect(isFullyPaid(100, 0)).toBe(false);
    });
});

// ==============================================
// Tests de calculateRemainingAmount
// ==============================================
describe("calculateRemainingAmount", () => {
    it("calcule le reste à payer", () => {
        expect(calculateRemainingAmount(100, 60)).toBe(40);
    });

    it("retourne 0 si payé en totalité", () => {
        expect(calculateRemainingAmount(100, 100)).toBe(0);
    });

    it("retourne 0 si surpayé (pas négatif)", () => {
        expect(calculateRemainingAmount(100, 150)).toBe(0);
    });

    it("arrondit à 2 décimales", () => {
        expect(calculateRemainingAmount(100, 33.333)).toBe(66.67);
    });
});

// ==============================================
// Tests de validatePaymentAmount
// ==============================================
describe("validatePaymentAmount", () => {
    it("valide un montant correct", () => {
        const result = validatePaymentAmount(50, 100);
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    it("valide le montant exact du reste", () => {
        const result = validatePaymentAmount(100, 100);
        expect(result.valid).toBe(true);
    });

    it("rejette un montant de 0", () => {
        const result = validatePaymentAmount(0, 100);
        expect(result.valid).toBe(false);
        expect(result.error).toContain("supérieur à zéro");
    });

    it("rejette un montant négatif", () => {
        const result = validatePaymentAmount(-10, 100);
        expect(result.valid).toBe(false);
        expect(result.error).toContain("supérieur à zéro");
    });

    it("rejette un montant supérieur au reste", () => {
        const result = validatePaymentAmount(150, 100);
        expect(result.valid).toBe(false);
        expect(result.error).toContain("dépasser");
    });
});

// ==============================================
// Tests de toNumber
// ==============================================
describe("toNumber", () => {
    it("convertit un nombre", () => {
        expect(toNumber(42)).toBe(42);
    });

    it("convertit une chaîne numérique", () => {
        expect(toNumber("42")).toBe(42);
        expect(toNumber("3.14")).toBe(3.14);
    });

    it("retourne la valeur par défaut pour null", () => {
        expect(toNumber(null)).toBe(0);
        expect(toNumber(null, 10)).toBe(10);
    });

    it("retourne la valeur par défaut pour undefined", () => {
        expect(toNumber(undefined)).toBe(0);
        expect(toNumber(undefined, 5)).toBe(5);
    });

    it("retourne la valeur par défaut pour NaN", () => {
        expect(toNumber("abc")).toBe(0);
        expect(toNumber("abc", 99)).toBe(99);
    });

    it("gère les objets avec toString numérique", () => {
        const decimalLike = { toString: () => "123.45" };
        expect(toNumber(decimalLike)).toBe(123.45);
    });
});

// ==============================================
// Tests de truncateId
// ==============================================
describe("truncateId", () => {
    it("tronque un ID long", () => {
        const longId = "cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";
        const result = truncateId(longId, 20);

        expect(result).toBe("cs_test_a1b2c3d4e5f6...");
        expect(result.length).toBe(23); // 20 + "..."
    });

    it("ne tronque pas un ID court", () => {
        const shortId = "abc123";
        expect(truncateId(shortId, 20)).toBe("abc123");
    });

    it("ne tronque pas un ID de longueur exacte", () => {
        const exactId = "12345678901234567890";
        expect(truncateId(exactId, 20)).toBe(exactId);
    });

    it("utilise 20 comme longueur par défaut", () => {
        const longId = "a".repeat(30);
        const result = truncateId(longId);

        expect(result).toBe("a".repeat(20) + "...");
    });

    it("gère une chaîne vide", () => {
        expect(truncateId("")).toBe("");
    });

    it("gère null/undefined", () => {
        expect(truncateId(null as unknown as string)).toBeFalsy();
        expect(truncateId(undefined as unknown as string)).toBeFalsy();
    });
});
