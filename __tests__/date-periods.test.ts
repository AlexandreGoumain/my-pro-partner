// ==============================================
// TESTS - Date Periods (Calculs de périodes)
// ==============================================
// Ces tests vérifient les fonctions de calcul de périodes
// utilisées dans les dashboards et analytics.

import { describe, it, expect } from "vitest";
import {
    calculatePeriodDates,
    calculateCustomPeriodDates,
    getPeriodLabel,
    getDaysAgo,
    isDateInPeriod,
    calculatePercentageChange,
} from "@/lib/utils/date-periods";

// ==============================================
// Date de référence fixe pour les tests
// ==============================================
const referenceDate = new Date("2025-06-15T12:00:00.000Z");
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// ==============================================
// Tests de calculatePeriodDates
// ==============================================
describe("calculatePeriodDates", () => {
    it("calcule correctement la période 7d", () => {
        const result = calculatePeriodDates("7d", referenceDate);

        expect(result.endDate.getTime()).toBe(referenceDate.getTime());
        expect(result.startDate.getTime()).toBe(referenceDate.getTime() - 7 * MS_PER_DAY);
    });

    it("calcule correctement la période 30d", () => {
        const result = calculatePeriodDates("30d", referenceDate);

        expect(result.endDate.getTime()).toBe(referenceDate.getTime());
        expect(result.startDate.getTime()).toBe(referenceDate.getTime() - 30 * MS_PER_DAY);
    });

    it("calcule correctement la période 90d", () => {
        const result = calculatePeriodDates("90d", referenceDate);

        expect(result.endDate.getTime()).toBe(referenceDate.getTime());
        expect(result.startDate.getTime()).toBe(referenceDate.getTime() - 90 * MS_PER_DAY);
    });

    it("calcule correctement la période 12m (365 jours)", () => {
        const result = calculatePeriodDates("12m", referenceDate);

        expect(result.endDate.getTime()).toBe(referenceDate.getTime());
        expect(result.startDate.getTime()).toBe(referenceDate.getTime() - 365 * MS_PER_DAY);
    });

    it("calcule la période précédente pour comparaison", () => {
        const result = calculatePeriodDates("30d", referenceDate);

        // previousEndDate = startDate de la période actuelle
        expect(result.previousEndDate.getTime()).toBe(result.startDate.getTime());

        // previousStartDate = 60 jours avant (2x 30 jours)
        expect(result.previousStartDate.getTime()).toBe(
            referenceDate.getTime() - 60 * MS_PER_DAY
        );
    });

    it("utilise la date actuelle par défaut", () => {
        const now = new Date();
        const result = calculatePeriodDates("7d");

        // Tolérance de 1 seconde pour l'exécution
        expect(Math.abs(result.endDate.getTime() - now.getTime())).toBeLessThan(1000);
    });
});

// ==============================================
// Tests de calculateCustomPeriodDates
// ==============================================
describe("calculateCustomPeriodDates", () => {
    it("utilise les dates fournies", () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-01-31");

        const result = calculateCustomPeriodDates(startDate, endDate);

        expect(result.startDate.getTime()).toBe(startDate.getTime());
        expect(result.endDate.getTime()).toBe(endDate.getTime());
    });

    it("calcule la période précédente de même durée", () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-01-31");
        const periodDuration = endDate.getTime() - startDate.getTime();

        const result = calculateCustomPeriodDates(startDate, endDate);

        expect(result.previousEndDate.getTime()).toBe(startDate.getTime());
        expect(result.previousStartDate.getTime()).toBe(
            startDate.getTime() - periodDuration
        );
    });
});

// ==============================================
// Tests de getPeriodLabel
// ==============================================
describe("getPeriodLabel", () => {
    it("retourne le bon label pour 7d", () => {
        expect(getPeriodLabel("7d")).toBe("7 derniers jours");
    });

    it("retourne le bon label pour 30d", () => {
        expect(getPeriodLabel("30d")).toBe("30 derniers jours");
    });

    it("retourne le bon label pour 90d", () => {
        expect(getPeriodLabel("90d")).toBe("90 derniers jours");
    });

    it("retourne le bon label pour 12m", () => {
        expect(getPeriodLabel("12m")).toBe("12 derniers mois");
    });

    it("retourne le bon label pour custom", () => {
        expect(getPeriodLabel("custom")).toBe("Période personnalisée");
    });
});

// ==============================================
// Tests de getDaysAgo
// ==============================================
describe("getDaysAgo", () => {
    it("calcule la date 7 jours avant", () => {
        const result = getDaysAgo(7, referenceDate);
        expect(result.getTime()).toBe(referenceDate.getTime() - 7 * MS_PER_DAY);
    });

    it("calcule la date 30 jours avant", () => {
        const result = getDaysAgo(30, referenceDate);
        expect(result.getTime()).toBe(referenceDate.getTime() - 30 * MS_PER_DAY);
    });

    it("retourne la même date pour 0 jours", () => {
        const result = getDaysAgo(0, referenceDate);
        expect(result.getTime()).toBe(referenceDate.getTime());
    });

    it("utilise la date actuelle par défaut", () => {
        const now = new Date();
        const result = getDaysAgo(1);

        const expectedMs = now.getTime() - MS_PER_DAY;
        expect(Math.abs(result.getTime() - expectedMs)).toBeLessThan(1000);
    });
});

// ==============================================
// Tests de isDateInPeriod
// ==============================================
describe("isDateInPeriod", () => {
    it("retourne true si la date est dans la période", () => {
        const dateInPeriod = new Date(referenceDate.getTime() - 5 * MS_PER_DAY);
        expect(isDateInPeriod(dateInPeriod, "7d", referenceDate)).toBe(true);
    });

    it("retourne false si la date est avant la période", () => {
        const dateBeforePeriod = new Date(referenceDate.getTime() - 10 * MS_PER_DAY);
        expect(isDateInPeriod(dateBeforePeriod, "7d", referenceDate)).toBe(false);
    });

    it("retourne true pour la date de début exacte", () => {
        const startDate = new Date(referenceDate.getTime() - 7 * MS_PER_DAY);
        expect(isDateInPeriod(startDate, "7d", referenceDate)).toBe(true);
    });

    it("retourne true pour la date de fin exacte", () => {
        expect(isDateInPeriod(referenceDate, "7d", referenceDate)).toBe(true);
    });

    it("fonctionne avec différentes périodes", () => {
        const date15DaysAgo = new Date(referenceDate.getTime() - 15 * MS_PER_DAY);

        expect(isDateInPeriod(date15DaysAgo, "7d", referenceDate)).toBe(false);
        expect(isDateInPeriod(date15DaysAgo, "30d", referenceDate)).toBe(true);
    });
});

// ==============================================
// Tests de calculatePercentageChange
// ==============================================
describe("calculatePercentageChange", () => {
    it("calcule une augmentation de 50%", () => {
        expect(calculatePercentageChange(150, 100)).toBe(50);
    });

    it("calcule une diminution de 25%", () => {
        expect(calculatePercentageChange(75, 100)).toBe(-25);
    });

    it("calcule 0% si pas de changement", () => {
        expect(calculatePercentageChange(100, 100)).toBe(0);
    });

    it("retourne 100% si previous = 0 et current > 0", () => {
        expect(calculatePercentageChange(50, 0)).toBe(100);
    });

    it("retourne 0% si previous = 0 et current = 0", () => {
        expect(calculatePercentageChange(0, 0)).toBe(0);
    });

    it("calcule un doublement (+100%)", () => {
        expect(calculatePercentageChange(200, 100)).toBe(100);
    });

    it("calcule une baisse totale (-100%)", () => {
        expect(calculatePercentageChange(0, 100)).toBe(-100);
    });
});
