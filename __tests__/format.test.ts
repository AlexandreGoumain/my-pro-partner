// ==============================================
// TESTS UNITAIRES - lib/utils/format.ts
// ==============================================
// Ce fichier montre comment écrire des tests pour des fonctions utilitaires.
// Les tests unitaires vérifient qu'une fonction renvoie le bon résultat.

import { describe, it, expect } from "vitest";
import {
    formatCurrency,
    getPriceWithTax,
    formatQuantity,
    getStockStatus,
    getStockStatusText,
    formatPercentage,
    parseFormNumber,
    parseFormInteger,
    pluralize,
    pluralSuffix,
    formatDuree,
    formatDureeDecimal,
} from "@/lib/utils/format";

// ==============================================
// describe() = Groupe de tests pour une fonction
// ==============================================
describe("formatCurrency", () => {
    // it() = Un test individuel
    // Le premier argument décrit ce que le test vérifie
    it("formate un nombre en euros", () => {
        // expect() = Vérifie qu'une valeur est correcte
        // toContain() = Vérifie que la chaîne contient le texte
        const result = formatCurrency(1234.56);
        expect(result).toContain("1");
        expect(result).toContain("234");
        expect(result).toContain("56");
        expect(result).toContain("€");
    });

    it("accepte un string et le convertit en nombre", () => {
        const result = formatCurrency("99.99");
        expect(result).toContain("99");
        expect(result).toContain("€");
    });

    it("gère zéro correctement", () => {
        const result = formatCurrency(0);
        expect(result).toContain("0");
        expect(result).toContain("€");
    });
});

describe("getPriceWithTax", () => {
    it("calcule le prix TTC avec TVA 20%", () => {
        // toBe() = Vérifie une égalité exacte
        expect(getPriceWithTax(100, 20)).toBe(120);
    });

    it("calcule le prix TTC avec TVA 10%", () => {
        // toBeCloseTo() pour éviter les erreurs de précision des floats
        expect(getPriceWithTax(100, 10)).toBeCloseTo(110);
    });

    it("retourne le prix HT si TVA = 0%", () => {
        expect(getPriceWithTax(100, 0)).toBe(100);
    });

    it("gère les décimales", () => {
        // toBeCloseTo() = Pour comparer des nombres à virgule (évite les erreurs de précision)
        expect(getPriceWithTax(33.33, 20)).toBeCloseTo(39.996);
    });
});

describe("formatQuantity", () => {
    it("formate la quantité avec unité", () => {
        expect(formatQuantity(5, "kg")).toBe("5 kg");
    });

    it("formate la quantité sans unité", () => {
        expect(formatQuantity(10)).toBe("10");
    });

    it("gère l'unité null", () => {
        expect(formatQuantity(10, null)).toBe("10");
    });
});

describe("getStockStatus", () => {
    it("retourne 'destructive' quand stock = 0", () => {
        expect(getStockStatus(0, 5)).toBe("destructive");
    });

    it("retourne 'warning' quand stock <= stockMin", () => {
        expect(getStockStatus(3, 5)).toBe("warning");
        expect(getStockStatus(5, 5)).toBe("warning");
    });

    it("retourne 'default' quand stock > stockMin", () => {
        expect(getStockStatus(10, 5)).toBe("default");
    });
});

describe("getStockStatusText", () => {
    it("retourne 'Rupture' quand stock = 0", () => {
        expect(getStockStatusText(0, 5)).toBe("Rupture");
    });

    it("retourne 'Stock faible' quand stock <= stockMin", () => {
        expect(getStockStatusText(3, 5)).toBe("Stock faible");
    });

    it("retourne 'En stock' quand stock > stockMin", () => {
        expect(getStockStatusText(10, 5)).toBe("En stock");
    });
});

describe("formatPercentage", () => {
    it("ajoute le symbole %", () => {
        expect(formatPercentage(75)).toBe("75%");
    });

    it("gère zéro", () => {
        expect(formatPercentage(0)).toBe("0%");
    });
});

describe("parseFormNumber", () => {
    it("parse un string en nombre", () => {
        expect(parseFormNumber("123.45")).toBe(123.45);
    });

    it("retourne la valeur par défaut si string vide", () => {
        expect(parseFormNumber("")).toBe(0);
    });

    it("retourne la valeur par défaut si NaN", () => {
        expect(parseFormNumber("abc")).toBe(0);
    });

    it("utilise une valeur par défaut personnalisée", () => {
        expect(parseFormNumber("", 10)).toBe(10);
    });
});

describe("parseFormInteger", () => {
    it("parse un string en entier", () => {
        expect(parseFormInteger("42")).toBe(42);
    });

    it("tronque les décimales", () => {
        expect(parseFormInteger("42.99")).toBe(42);
    });

    it("retourne la valeur par défaut si NaN", () => {
        expect(parseFormInteger("abc", 5)).toBe(5);
    });
});

describe("pluralize", () => {
    it("retourne le singulier si count <= 1", () => {
        expect(pluralize(0, "client")).toBe("client");
        expect(pluralize(1, "client")).toBe("client");
    });

    it("retourne le pluriel par défaut (+ s) si count > 1", () => {
        expect(pluralize(2, "client")).toBe("clients");
    });

    it("utilise le pluriel personnalisé si fourni", () => {
        expect(pluralize(2, "animal", "animaux")).toBe("animaux");
    });
});

describe("pluralSuffix", () => {
    it("retourne 's' si count > 1", () => {
        expect(pluralSuffix(2)).toBe("s");
        expect(pluralSuffix(100)).toBe("s");
    });

    it("retourne '' si count <= 1", () => {
        expect(pluralSuffix(0)).toBe("");
        expect(pluralSuffix(1)).toBe("");
    });
});

describe("formatDuree", () => {
    it("formate les minutes seules", () => {
        expect(formatDuree(45)).toBe("45min");
    });

    it("formate les heures seules", () => {
        expect(formatDuree(120)).toBe("2h");
    });

    it("formate heures et minutes", () => {
        expect(formatDuree(150)).toBe("2h30");
    });

    it("pad les minutes avec un zéro si < 10", () => {
        expect(formatDuree(65)).toBe("1h05");
    });
});

describe("formatDureeDecimal", () => {
    it("formate en heures décimales", () => {
        expect(formatDureeDecimal(90)).toBe("1.5h");
    });

    it("formate avec une décimale", () => {
        expect(formatDureeDecimal(100)).toBe("1.7h");
    });
});
