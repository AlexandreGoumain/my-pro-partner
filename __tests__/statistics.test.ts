// ==============================================
// TESTS - Statistics (Calculs KPIs)
// ==============================================
// Ces tests vérifient les fonctions de calcul statistique
// utilisées dans les dashboards et analytics.

import { describe, it, expect } from "vitest";
import {
    calculatePercentage,
    calculatePercentageValue,
    calculateGrowthRate,
    calculateDifference,
    aggregateClientsByCity,
    getTopCities,
    filterClients,
    countClients,
} from "@/lib/utils/statistics";

// Type Client simplifié pour les tests
type TestClient = {
    id: string;
    nom: string;
    ville?: string | null;
    points_solde?: number;
};

// ==============================================
// Données de test
// ==============================================
const mockClients: TestClient[] = [
    { id: "1", nom: "Dupont", ville: "Paris", points_solde: 100 },
    { id: "2", nom: "Martin", ville: "Paris", points_solde: 50 },
    { id: "3", nom: "Bernard", ville: "Lyon", points_solde: 200 },
    { id: "4", nom: "Durand", ville: "Lyon", points_solde: 0 },
    { id: "5", nom: "Petit", ville: "Marseille", points_solde: 150 },
    { id: "6", nom: "Robert", ville: null, points_solde: 75 },
];

// ==============================================
// Tests de calculatePercentage
// ==============================================
describe("calculatePercentage", () => {
    it("calcule un pourcentage simple", () => {
        expect(calculatePercentage(25, 100)).toBe("25%");
    });

    it("calcule un pourcentage avec décimales", () => {
        expect(calculatePercentage(1, 3, 2)).toBe("33.33%");
    });

    it("retourne '0%' si total = 0", () => {
        expect(calculatePercentage(50, 0)).toBe("0%");
    });

    it("gère les valeurs supérieures à 100%", () => {
        expect(calculatePercentage(150, 100)).toBe("150%");
    });

    it("arrondit sans décimales par défaut", () => {
        expect(calculatePercentage(1, 3)).toBe("33%");
    });

    it("gère une précision de 1 décimale", () => {
        expect(calculatePercentage(1, 3, 1)).toBe("33.3%");
    });
});

// ==============================================
// Tests de calculatePercentageValue
// ==============================================
describe("calculatePercentageValue", () => {
    it("retourne un nombre (pas une string)", () => {
        const result = calculatePercentageValue(25, 100);
        expect(typeof result).toBe("number");
    });

    it("calcule correctement 25/100", () => {
        expect(calculatePercentageValue(25, 100)).toBe(25);
    });

    it("calcule correctement 1/3", () => {
        expect(calculatePercentageValue(1, 3)).toBeCloseTo(33.33, 1);
    });

    it("retourne 0 si total = 0", () => {
        expect(calculatePercentageValue(50, 0)).toBe(0);
    });

    it("gère les valeurs > 100%", () => {
        expect(calculatePercentageValue(200, 100)).toBe(200);
    });
});

// ==============================================
// Tests de calculateGrowthRate
// ==============================================
describe("calculateGrowthRate", () => {
    it("calcule une croissance positive", () => {
        // De 100 à 150 = +50%
        expect(calculateGrowthRate(150, 100)).toBe(50);
    });

    it("calcule une croissance négative", () => {
        // De 100 à 75 = -25%
        expect(calculateGrowthRate(75, 100)).toBe(-25);
    });

    it("calcule une croissance de 0%", () => {
        expect(calculateGrowthRate(100, 100)).toBe(0);
    });

    it("retourne 100% si previous = 0 et current > 0", () => {
        expect(calculateGrowthRate(50, 0)).toBe(100);
    });

    it("retourne 0% si previous = 0 et current = 0", () => {
        expect(calculateGrowthRate(0, 0)).toBe(0);
    });

    it("calcule une croissance > 100%", () => {
        // De 50 à 150 = +200%
        expect(calculateGrowthRate(150, 50)).toBe(200);
    });

    it("calcule une décroissance totale (-100%)", () => {
        expect(calculateGrowthRate(0, 100)).toBe(-100);
    });
});

// ==============================================
// Tests de calculateDifference
// ==============================================
describe("calculateDifference", () => {
    it("calcule une différence positive", () => {
        expect(calculateDifference(150, 100)).toBe(50);
    });

    it("calcule une différence négative", () => {
        expect(calculateDifference(75, 100)).toBe(-25);
    });

    it("calcule une différence de 0", () => {
        expect(calculateDifference(100, 100)).toBe(0);
    });

    it("fonctionne avec des nombres décimaux", () => {
        expect(calculateDifference(10.5, 5.5)).toBe(5);
    });
});

// ==============================================
// Tests de aggregateClientsByCity
// ==============================================
describe("aggregateClientsByCity", () => {
    it("retourne une Map", () => {
        const result = aggregateClientsByCity(mockClients as never[]);
        expect(result).toBeInstanceOf(Map);
    });

    it("compte correctement les clients par ville", () => {
        const result = aggregateClientsByCity(mockClients as never[]);
        expect(result.get("Paris")).toBe(2);
        expect(result.get("Lyon")).toBe(2);
        expect(result.get("Marseille")).toBe(1);
    });

    it("ignore les clients sans ville", () => {
        const result = aggregateClientsByCity(mockClients as never[]);
        expect(result.has("")).toBe(false);
        expect(result.size).toBe(3); // Paris, Lyon, Marseille
    });

    it("retourne une Map vide si pas de clients", () => {
        const result = aggregateClientsByCity([]);
        expect(result.size).toBe(0);
    });
});

// ==============================================
// Tests de getTopCities
// ==============================================
describe("getTopCities", () => {
    it("retourne les villes triées par nombre de clients", () => {
        const result = getTopCities(mockClients as never[]);
        // Paris et Lyon ont 2 clients chacun, Marseille en a 1
        expect(result[0][1]).toBe(2);
        expect(result[2][1]).toBe(1);
    });

    it("retourne un tableau de tuples [ville, count]", () => {
        const result = getTopCities(mockClients as never[]);
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toHaveLength(2);
        expect(typeof result[0][0]).toBe("string");
        expect(typeof result[0][1]).toBe("number");
    });

    it("respecte la limite par défaut (5)", () => {
        const result = getTopCities(mockClients as never[]);
        expect(result.length).toBeLessThanOrEqual(5);
    });

    it("respecte une limite personnalisée", () => {
        const result = getTopCities(mockClients as never[], 2);
        expect(result).toHaveLength(2);
    });

    it("retourne toutes les villes si moins que la limite", () => {
        const result = getTopCities(mockClients as never[], 10);
        expect(result).toHaveLength(3);
    });
});

// ==============================================
// Tests de filterClients
// ==============================================
describe("filterClients", () => {
    it("filtre les clients selon un prédicat", () => {
        const result = filterClients(
            mockClients as never[],
            (c) => (c as TestClient).ville === "Paris"
        );
        expect(result).toHaveLength(2);
    });

    it("retourne un tableau vide si aucun ne correspond", () => {
        const result = filterClients(
            mockClients as never[],
            (c) => (c as TestClient).ville === "Bordeaux"
        );
        expect(result).toHaveLength(0);
    });

    it("retourne tous si tous correspondent", () => {
        const result = filterClients(mockClients as never[], () => true);
        expect(result).toHaveLength(6);
    });

    it("peut filtrer sur plusieurs critères", () => {
        const result = filterClients(
            mockClients as never[],
            (c) => (c as TestClient).ville === "Paris" && ((c as TestClient).points_solde ?? 0) > 50
        );
        expect(result).toHaveLength(1);
        expect((result[0] as TestClient).nom).toBe("Dupont");
    });
});

// ==============================================
// Tests de countClients
// ==============================================
describe("countClients", () => {
    it("compte les clients selon un prédicat", () => {
        const count = countClients(
            mockClients as never[],
            (c) => (c as TestClient).ville === "Paris"
        );
        expect(count).toBe(2);
    });

    it("retourne 0 si aucun ne correspond", () => {
        const count = countClients(
            mockClients as never[],
            (c) => (c as TestClient).ville === "Bordeaux"
        );
        expect(count).toBe(0);
    });

    it("compte tous si tous correspondent", () => {
        const count = countClients(mockClients as never[], () => true);
        expect(count).toBe(6);
    });

    it("compte les clients avec points > 0", () => {
        const count = countClients(
            mockClients as never[],
            (c) => ((c as TestClient).points_solde ?? 0) > 0
        );
        expect(count).toBe(5); // Tous sauf Durand (0 points)
    });

    it("compte les clients VIP (points > 100)", () => {
        const count = countClients(
            mockClients as never[],
            (c) => ((c as TestClient).points_solde ?? 0) > 100
        );
        expect(count).toBe(2); // Bernard (200) et Petit (150)
    });
});
