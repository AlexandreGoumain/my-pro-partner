// ==============================================
// TESTS - Security Validation Patterns
// ==============================================
// Ces tests vérifient que les patterns de validation de sécurité
// rejettent correctement les tentatives d'injection et acceptent
// les données légitimes.

import { describe, it, expect } from "vitest";
import {
    PHONE_REGEX,
    PHONE_FR_REGEX,
    POSTAL_CODE_FR_REGEX,
    POSTAL_CODE_FLEXIBLE_REGEX,
    ID_REGEX,
    SIRET_REGEX,
    SIREN_REGEX,
    phoneSchema,
    phoneFrSchema,
    postalCodeFrSchema,
    postalCodeSchema,
    idSchema,
    siretSchema,
    sirenSchema,
} from "@/lib/validation/patterns";

// ==============================================
// Tests de PHONE_REGEX (format international)
// ==============================================
describe("PHONE_REGEX - Format International", () => {
    describe("numéros valides", () => {
        it("accepte un numéro français avec 0", () => {
            expect(PHONE_REGEX.test("0612345678")).toBe(true);
        });

        it("accepte un numéro avec indicatif +33", () => {
            expect(PHONE_REGEX.test("+33612345678")).toBe(true);
        });

        it("accepte un numéro avec espaces", () => {
            expect(PHONE_REGEX.test("06 12 34 56 78")).toBe(true);
        });

        it("accepte un numéro avec tirets", () => {
            expect(PHONE_REGEX.test("06-12-34-56-78")).toBe(true);
        });

        it("accepte un numéro avec points", () => {
            expect(PHONE_REGEX.test("06.12.34.56.78")).toBe(true);
        });

        it("accepte un numéro avec parenthèses", () => {
            expect(PHONE_REGEX.test("(06) 12 34 56 78")).toBe(true);
        });
    });

    describe("tentatives d'injection - SÉCURITÉ", () => {
        it("rejette une URL déguisée en numéro", () => {
            expect(PHONE_REGEX.test("http://evil.com")).toBe(false);
        });

        it("rejette du JavaScript", () => {
            expect(PHONE_REGEX.test("javascript:alert(1)")).toBe(false);
        });

        it("rejette du HTML", () => {
            expect(PHONE_REGEX.test("<script>alert(1)</script>")).toBe(false);
        });

        it("rejette une injection SQL", () => {
            expect(PHONE_REGEX.test("'; DROP TABLE--")).toBe(false);
        });

        it("rejette un numéro trop long (>20 chars)", () => {
            expect(PHONE_REGEX.test("012345678901234567890")).toBe(false);
        });

        it("rejette un numéro trop court (<9 chars)", () => {
            expect(PHONE_REGEX.test("12345678")).toBe(false);
        });

        it("rejette des lettres", () => {
            expect(PHONE_REGEX.test("06ABCD5678")).toBe(false);
        });
    });
});

// ==============================================
// Tests de PHONE_FR_REGEX (format français strict)
// ==============================================
describe("PHONE_FR_REGEX - Format Français Strict", () => {
    describe("numéros valides", () => {
        it("accepte un mobile 06", () => {
            expect(PHONE_FR_REGEX.test("06 12 34 56 78")).toBe(true);
        });

        it("accepte un mobile 07", () => {
            expect(PHONE_FR_REGEX.test("07 12 34 56 78")).toBe(true);
        });

        it("accepte un fixe 01", () => {
            expect(PHONE_FR_REGEX.test("01 23 45 67 89")).toBe(true);
        });

        it("accepte avec +33", () => {
            expect(PHONE_FR_REGEX.test("+33 6 12 34 56 78")).toBe(true);
        });

        it("accepte avec 0033", () => {
            expect(PHONE_FR_REGEX.test("0033 6 12 34 56 78")).toBe(true);
        });

        it("accepte sans espaces", () => {
            expect(PHONE_FR_REGEX.test("0612345678")).toBe(true);
        });
    });

    describe("numéros invalides", () => {
        it("rejette un numéro étranger", () => {
            expect(PHONE_FR_REGEX.test("+1 555 123 4567")).toBe(false);
        });

        it("rejette un 00 au début", () => {
            expect(PHONE_FR_REGEX.test("00 12 34 56 78")).toBe(false);
        });
    });
});

// ==============================================
// Tests de POSTAL_CODE_FR_REGEX (code postal français)
// ==============================================
describe("POSTAL_CODE_FR_REGEX - Code Postal Français", () => {
    describe("codes valides", () => {
        it("accepte Paris 1er", () => {
            expect(POSTAL_CODE_FR_REGEX.test("75001")).toBe(true);
        });

        it("accepte Lyon", () => {
            expect(POSTAL_CODE_FR_REGEX.test("69000")).toBe(true);
        });

        it("accepte Marseille", () => {
            expect(POSTAL_CODE_FR_REGEX.test("13000")).toBe(true);
        });

        it("accepte un département 01", () => {
            expect(POSTAL_CODE_FR_REGEX.test("01000")).toBe(true);
        });

        it("accepte la Corse", () => {
            expect(POSTAL_CODE_FR_REGEX.test("20000")).toBe(true);
        });
    });

    describe("codes invalides - SÉCURITÉ", () => {
        it("rejette un code à 4 chiffres", () => {
            expect(POSTAL_CODE_FR_REGEX.test("7500")).toBe(false);
        });

        it("rejette un code à 6 chiffres", () => {
            expect(POSTAL_CODE_FR_REGEX.test("750001")).toBe(false);
        });

        it("rejette des lettres", () => {
            expect(POSTAL_CODE_FR_REGEX.test("75A01")).toBe(false);
        });

        it("rejette un code UK", () => {
            expect(POSTAL_CODE_FR_REGEX.test("SW1A 1AA")).toBe(false);
        });

        it("rejette une tentative d'injection", () => {
            expect(POSTAL_CODE_FR_REGEX.test("'; --")).toBe(false);
        });

        it("rejette une URL", () => {
            expect(POSTAL_CODE_FR_REGEX.test("http:")).toBe(false);
        });
    });
});

// ==============================================
// Tests de ID_REGEX (UUID/CUID)
// ==============================================
describe("ID_REGEX - UUID/CUID Validation", () => {
    describe("IDs valides", () => {
        it("accepte un UUID v4", () => {
            expect(ID_REGEX.test("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
        });

        it("accepte un UUID v1", () => {
            expect(ID_REGEX.test("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
        });

        it("accepte un CUID", () => {
            expect(ID_REGEX.test("cjld2cjxh0000qzrmn831i7rn")).toBe(true);
        });

        it("accepte un UUID en majuscules", () => {
            expect(ID_REGEX.test("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
        });
    });

    describe("IDs invalides - SÉCURITÉ", () => {
        it("rejette une chaîne vide", () => {
            expect(ID_REGEX.test("")).toBe(false);
        });

        it("rejette une injection SQL", () => {
            expect(ID_REGEX.test("1; DROP TABLE users--")).toBe(false);
        });

        it("rejette un path traversal", () => {
            expect(ID_REGEX.test("../../../etc/passwd")).toBe(false);
        });

        it("rejette un UUID mal formaté", () => {
            expect(ID_REGEX.test("550e8400-e29b-41d4-a716")).toBe(false);
        });

        it("rejette un numéro simple", () => {
            expect(ID_REGEX.test("12345")).toBe(false);
        });

        it("rejette null comme string", () => {
            expect(ID_REGEX.test("null")).toBe(false);
        });

        it("rejette undefined comme string", () => {
            expect(ID_REGEX.test("undefined")).toBe(false);
        });
    });
});

// ==============================================
// Tests de SIRET_REGEX
// ==============================================
describe("SIRET_REGEX - Numéro SIRET", () => {
    describe("SIRET valides", () => {
        it("accepte un SIRET de 14 chiffres", () => {
            expect(SIRET_REGEX.test("12345678901234")).toBe(true);
        });

        it("accepte un SIRET commençant par 0", () => {
            expect(SIRET_REGEX.test("01234567890123")).toBe(true);
        });
    });

    describe("SIRET invalides", () => {
        it("rejette 13 chiffres", () => {
            expect(SIRET_REGEX.test("1234567890123")).toBe(false);
        });

        it("rejette 15 chiffres", () => {
            expect(SIRET_REGEX.test("123456789012345")).toBe(false);
        });

        it("rejette les lettres", () => {
            expect(SIRET_REGEX.test("1234567890123A")).toBe(false);
        });

        it("rejette les espaces", () => {
            expect(SIRET_REGEX.test("123 456 789 012")).toBe(false);
        });
    });
});

// ==============================================
// Tests de SIREN_REGEX
// ==============================================
describe("SIREN_REGEX - Numéro SIREN", () => {
    describe("SIREN valides", () => {
        it("accepte un SIREN de 9 chiffres", () => {
            expect(SIREN_REGEX.test("123456789")).toBe(true);
        });
    });

    describe("SIREN invalides", () => {
        it("rejette 8 chiffres", () => {
            expect(SIREN_REGEX.test("12345678")).toBe(false);
        });

        it("rejette 10 chiffres", () => {
            expect(SIREN_REGEX.test("1234567890")).toBe(false);
        });
    });
});

// ==============================================
// Tests des Zod Schemas
// ==============================================
describe("Zod Schemas - phoneSchema", () => {
    it("accepte un numéro valide", () => {
        const result = phoneSchema.safeParse("06 12 34 56 78");
        expect(result.success).toBe(true);
    });

    it("accepte une chaîne vide (optionnel)", () => {
        const result = phoneSchema.safeParse("");
        expect(result.success).toBe(true);
    });

    it("accepte undefined", () => {
        const result = phoneSchema.safeParse(undefined);
        expect(result.success).toBe(true);
    });

    it("rejette une URL", () => {
        const result = phoneSchema.safeParse("https://evil.com");
        expect(result.success).toBe(false);
    });

    it("rejette du HTML", () => {
        const result = phoneSchema.safeParse("<img src=x onerror=alert(1)>");
        expect(result.success).toBe(false);
    });
});

describe("Zod Schemas - postalCodeFrSchema", () => {
    it("accepte un code postal français", () => {
        const result = postalCodeFrSchema.safeParse("75001");
        expect(result.success).toBe(true);
    });

    it("accepte une chaîne vide (optionnel)", () => {
        const result = postalCodeFrSchema.safeParse("");
        expect(result.success).toBe(true);
    });

    it("rejette un code invalide", () => {
        const result = postalCodeFrSchema.safeParse("ABCDE");
        expect(result.success).toBe(false);
    });
});

describe("Zod Schemas - idSchema", () => {
    it("accepte un UUID valide", () => {
        const result = idSchema.safeParse("550e8400-e29b-41d4-a716-446655440000");
        expect(result.success).toBe(true);
    });

    it("accepte un CUID valide", () => {
        const result = idSchema.safeParse("cjld2cjxh0000qzrmn831i7rn");
        expect(result.success).toBe(true);
    });

    it("rejette une chaîne vide", () => {
        const result = idSchema.safeParse("");
        expect(result.success).toBe(false);
    });

    it("rejette une injection SQL", () => {
        const result = idSchema.safeParse("' OR '1'='1");
        expect(result.success).toBe(false);
    });

    it("rejette un ID numérique simple", () => {
        const result = idSchema.safeParse("12345");
        expect(result.success).toBe(false);
    });
});

// ==============================================
// Tests de résistance aux attaques
// ==============================================
describe("Résistance aux attaques - Téléphone", () => {
    const attackVectors = [
        { name: "XSS via javascript:", input: "javascript:alert(document.cookie)" },
        { name: "XSS via data:", input: "data:text/html,<script>alert(1)</script>" },
        { name: "SQL Injection UNION", input: "' UNION SELECT * FROM users--" },
        { name: "SQL Injection OR", input: "' OR 1=1--" },
        { name: "Path Traversal", input: "../../etc/passwd" },
        { name: "Command Injection", input: "; rm -rf /" },
        { name: "LDAP Injection", input: "*)(objectClass=*" },
        { name: "XML Injection", input: "<?xml version='1.0'?>" },
        { name: "Template Injection", input: "{{constructor.constructor('return this')()}}" },
        { name: "Unicode bypass", input: "０６１２３４５６７８" }, // Full-width numbers
    ];

    attackVectors.forEach(({ name, input }) => {
        it(`rejette ${name}`, () => {
            expect(PHONE_REGEX.test(input)).toBe(false);
        });
    });
});

describe("Résistance aux attaques - Code Postal", () => {
    const attackVectors = [
        { name: "XSS", input: "<script>alert(1)</script>" },
        { name: "SQL Injection", input: "' OR '1'='1" },
        { name: "Null byte", input: "75001\x00malicious" },
        { name: "CRLF Injection", input: "75001\r\nSet-Cookie: evil" },
    ];

    attackVectors.forEach(({ name, input }) => {
        it(`rejette ${name}`, () => {
            expect(POSTAL_CODE_FR_REGEX.test(input)).toBe(false);
        });
    });
});

describe("Résistance aux attaques - ID", () => {
    const attackVectors = [
        { name: "SQL Injection", input: "1; DROP TABLE users--" },
        { name: "NoSQL Injection", input: '{"$gt": ""}' },
        { name: "Object Injection", input: "__proto__" },
        { name: "Prototype Pollution", input: "constructor.prototype" },
        { name: "Path Traversal", input: "../../../etc/passwd" },
    ];

    attackVectors.forEach(({ name, input }) => {
        it(`rejette ${name}`, () => {
            expect(ID_REGEX.test(input)).toBe(false);
        });
    });
});
