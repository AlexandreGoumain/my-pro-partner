// ==============================================
// TESTS - Segment Filters (Filtrage clients)
// ==============================================
// Ces tests vérifient la logique de filtrage des clients
// pour les segments prédéfinis et personnalisés.

import { describe, it, expect } from "vitest";
import { applySegmentCriteria, type ClientLike } from "@/lib/utils/segment-filters";

// ==============================================
// Données de test
// ==============================================
const mockClients: ClientLike[] = [
    {
        nom: "Dupont",
        prenom: "Jean",
        email: "jean@example.com",
        telephone: "0612345678",
        ville: "Paris",
        codePostal: "75001",
        points_solde: 150,
        createdAt: new Date(), // Récent
        updatedAt: new Date(),
    },
    {
        nom: "Martin",
        prenom: "Marie",
        email: "marie@example.com",
        telephone: null,
        ville: "Lyon",
        codePostal: "69001",
        points_solde: 50,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 jours
        updatedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), // Inactif (100 jours)
    },
    {
        nom: "Bernard",
        prenom: "Pierre",
        email: null,
        telephone: "0698765432",
        ville: "Paris",
        codePostal: "75002",
        points_solde: 0,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
    },
    {
        nom: "Durand",
        prenom: "Sophie",
        email: "",
        telephone: "",
        ville: null,
        codePostal: null,
        points_solde: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// ==============================================
// Tests des segments prédéfinis
// ==============================================
describe("applySegmentCriteria - Segments prédéfinis", () => {
    it("'all' retourne tous les clients", () => {
        const result = applySegmentCriteria(mockClients, { type: "all" });
        expect(result).toHaveLength(4);
    });

    it("'with-email' filtre les clients avec email", () => {
        const result = applySegmentCriteria(mockClients, { type: "with-email" });
        expect(result).toHaveLength(2);
        expect(result.every((c) => c.email && c.email.trim() !== "")).toBe(true);
    });

    it("'with-phone' filtre les clients avec téléphone", () => {
        const result = applySegmentCriteria(mockClients, { type: "with-phone" });
        expect(result).toHaveLength(2);
        expect(result.every((c) => c.telephone && c.telephone.trim() !== "")).toBe(true);
    });

    it("'by-city' filtre les clients avec ville", () => {
        const result = applySegmentCriteria(mockClients, { type: "by-city" });
        expect(result).toHaveLength(3);
        expect(result.every((c) => c.ville && c.ville.trim() !== "")).toBe(true);
    });

    it("'with-loyalty' filtre les clients avec points > 0", () => {
        const result = applySegmentCriteria(mockClients, { type: "with-loyalty" });
        expect(result).toHaveLength(3);
        expect(result.every((c) => (c.points_solde ?? 0) > 0)).toBe(true);
    });

    it("'vip' filtre les clients avec points > 100", () => {
        const result = applySegmentCriteria(mockClients, { type: "vip" });
        expect(result).toHaveLength(2);
        expect(result.every((c) => (c.points_solde ?? 0) > 100)).toBe(true);
    });

    it("'recent' filtre les clients créés < 30 jours", () => {
        const result = applySegmentCriteria(mockClients, { type: "recent" });
        expect(result).toHaveLength(2); // Dupont et Durand
    });

    it("'inactive' filtre les clients inactifs > 90 jours", () => {
        const result = applySegmentCriteria(mockClients, { type: "inactive" });
        expect(result).toHaveLength(1); // Martin
        expect(result[0].nom).toBe("Martin");
    });
});

// ==============================================
// Tests des opérateurs de critères
// ==============================================
describe("applySegmentCriteria - Opérateurs", () => {
    describe("Opérateurs de comparaison", () => {
        it("'eq' (égal)", () => {
            const result = applySegmentCriteria(mockClients, {
                conditions: [{ field: "ville", operator: "eq", value: "Paris" }],
            });
            expect(result).toHaveLength(2);
        });

        it("'ne' (différent)", () => {
            const result = applySegmentCriteria(mockClients, {
                conditions: [{ field: "ville", operator: "ne", value: "Paris" }],
            });
            expect(result).toHaveLength(2);
        });

        it("'gt' (supérieur)", () => {
            const result = applySegmentCriteria(mockClients, {
                conditions: [{ field: "points_solde", operator: "gt", value: 100 }],
            });
            expect(result).toHaveLength(2);
        });

        it("'gte' (supérieur ou égal)", () => {
            const result = applySegmentCriteria(mockClients, {
                conditions: [{ field: "points_solde", operator: "gte", value: 50 }],
            });
            expect(result).toHaveLength(3);
        });

        it("'lt' (inférieur)", () => {
            const result = applySegmentCriteria(mockClients, {
                conditions: [{ field: "points_solde", operator: "lt", value: 100 }],
            });
            expect(result).toHaveLength(2);
        });

        it("'lte' (inférieur ou égal)", () => {
            const result = applySegmentCriteria(mockClients, {
                conditions: [{ field: "points_solde", operator: "lte", value: 50 }],
            });
            expect(result).toHaveLength(2);
        });
    });

    describe("Opérateurs de chaîne", () => {
        it("'contains' (contient)", () => {
            const result = applySegmentCriteria(mockClients, {
                conditions: [{ field: "email", operator: "contains", value: "example" }],
            });
            expect(result).toHaveLength(2);
        });

        it("'startsWith' (commence par)", () => {
            const result = applySegmentCriteria(mockClients, {
                conditions: [{ field: "nom", operator: "startsWith", value: "Du" }],
            });
            expect(result).toHaveLength(2); // Dupont et Durand
        });

        it("'endsWith' (finit par)", () => {
            const result = applySegmentCriteria(mockClients, {
                conditions: [{ field: "email", operator: "endsWith", value: ".com" }],
            });
            expect(result).toHaveLength(2);
        });

        it("'contains' est case-insensitive", () => {
            const result = applySegmentCriteria(mockClients, {
                conditions: [{ field: "email", operator: "contains", value: "EXAMPLE" }],
            });
            expect(result).toHaveLength(2);
        });
    });

    describe("Opérateurs d'existence", () => {
        it("'exists' (existe et non vide)", () => {
            const result = applySegmentCriteria(mockClients, {
                conditions: [{ field: "email", operator: "exists", value: true }],
            });
            expect(result).toHaveLength(2);
        });

        it("'notExists' (n'existe pas ou vide)", () => {
            const result = applySegmentCriteria(mockClients, {
                conditions: [{ field: "email", operator: "notExists", value: true }],
            });
            expect(result).toHaveLength(2);
        });
    });

    describe("Opérateurs 'in' et 'notIn'", () => {
        it("'in' (dans la liste)", () => {
            const result = applySegmentCriteria(mockClients, {
                conditions: [{ field: "ville", operator: "in", value: ["Paris", "Marseille"] }],
            });
            expect(result).toHaveLength(2);
        });

        it("'notIn' (pas dans la liste)", () => {
            const result = applySegmentCriteria(mockClients, {
                conditions: [{ field: "ville", operator: "notIn", value: ["Paris"] }],
            });
            expect(result).toHaveLength(2); // Lyon et null
        });
    });
});

// ==============================================
// Tests de la logique AND/OR
// ==============================================
describe("applySegmentCriteria - Logique AND/OR", () => {
    it("AND (par défaut) - toutes les conditions doivent être vraies", () => {
        const result = applySegmentCriteria(mockClients, {
            conditions: [
                { field: "ville", operator: "eq", value: "Paris" },
                { field: "points_solde", operator: "gt", value: 100 },
            ],
            logic: "AND",
        });
        expect(result).toHaveLength(1);
        expect(result[0].nom).toBe("Dupont");
    });

    it("OR - au moins une condition doit être vraie", () => {
        const result = applySegmentCriteria(mockClients, {
            conditions: [
                { field: "ville", operator: "eq", value: "Paris" },
                { field: "ville", operator: "eq", value: "Lyon" },
            ],
            logic: "OR",
        });
        expect(result).toHaveLength(3);
    });

    it("AND sans logique explicite (défaut)", () => {
        const result = applySegmentCriteria(mockClients, {
            conditions: [
                { field: "ville", operator: "eq", value: "Paris" },
                { field: "points_solde", operator: "gt", value: 100 },
            ],
        });
        expect(result).toHaveLength(1);
    });
});

// ==============================================
// Tests des cas limites
// ==============================================
describe("applySegmentCriteria - Cas limites", () => {
    it("retourne un tableau vide si aucun client ne correspond", () => {
        const result = applySegmentCriteria(mockClients, {
            conditions: [{ field: "ville", operator: "eq", value: "Marseille" }],
        });
        expect(result).toHaveLength(0);
    });

    it("gère les valeurs null correctement", () => {
        const result = applySegmentCriteria(mockClients, {
            conditions: [{ field: "ville", operator: "notExists", value: true }],
        });
        expect(result.some((c) => c.ville === null)).toBe(true);
    });

    it("gère les comparaisons numériques avec types incorrects", () => {
        const result = applySegmentCriteria(mockClients, {
            conditions: [{ field: "nom", operator: "gt", value: 100 }],
        });
        expect(result).toHaveLength(0); // String n'est pas comparable avec >
    });
});
