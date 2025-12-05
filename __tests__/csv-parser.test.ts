// ==============================================
// TESTS - CSV Parser (Import/Export CSV)
// ==============================================
// Ces tests vérifient le parsing et la génération de fichiers CSV.

import { describe, it, expect } from "vitest";
import { parseCSV, objectsToCSV } from "@/lib/utils/csv-parser";

// ==============================================
// Tests de parseCSV
// ==============================================
describe("parseCSV", () => {
    describe("parsing basique", () => {
        it("parse un CSV simple", () => {
            const csv = `nom,email,ville
Dupont,jean@example.com,Paris
Martin,marie@example.com,Lyon`;

            const result = parseCSV(csv);

            expect(result.headers).toEqual(["nom", "email", "ville"]);
            expect(result.rows).toHaveLength(2);
            expect(result.errors).toHaveLength(0);
        });

        it("extrait les valeurs correctement", () => {
            const csv = `nom,email
Dupont,jean@example.com`;

            const result = parseCSV(csv);

            expect(result.rows[0].nom).toBe("Dupont");
            expect(result.rows[0].email).toBe("jean@example.com");
        });

        it("gère les retours à la ligne Windows (CRLF)", () => {
            const csv = "nom,email\r\nDupont,test@test.com\r\nMartin,m@m.com";

            const result = parseCSV(csv);

            expect(result.rows).toHaveLength(2);
        });

        it("gère les retours à la ligne Unix (LF)", () => {
            const csv = "nom,email\nDupont,test@test.com\nMartin,m@m.com";

            const result = parseCSV(csv);

            expect(result.rows).toHaveLength(2);
        });
    });

    describe("gestion des guillemets", () => {
        it("parse les champs entre guillemets", () => {
            const csv = `nom,adresse
Dupont,"123, rue de Paris"`;

            const result = parseCSV(csv);

            expect(result.rows[0].adresse).toBe("123, rue de Paris");
        });

        it("gère les guillemets échappés (\"\")", () => {
            const csv = `nom,description
Dupont,"Il a dit ""bonjour"""`;

            const result = parseCSV(csv);

            expect(result.rows[0].description).toBe('Il a dit "bonjour"');
        });

        it("gère les virgules dans les champs entre guillemets", () => {
            const csv = `nom,adresse
Dupont,"Paris, France"`;

            const result = parseCSV(csv);

            expect(result.rows[0].adresse).toBe("Paris, France");
        });
    });

    describe("gestion des erreurs", () => {
        it("retourne une erreur pour un fichier vide", () => {
            const result = parseCSV("");

            expect(result.rows).toHaveLength(0);
            expect(result.errors).toContain("Le fichier CSV est vide");
        });

        it("retourne une erreur pour un fichier avec seulement des espaces", () => {
            const result = parseCSV("   \n   \n   ");

            expect(result.errors).toContain("Le fichier CSV est vide");
        });
    });

    describe("gestion des valeurs manquantes", () => {
        it("retourne null pour les colonnes manquantes", () => {
            const csv = `nom,email,ville
Dupont,jean@example.com`;

            const result = parseCSV(csv);

            expect(result.rows[0].ville).toBeNull();
        });

        it("ignore les lignes vides", () => {
            const csv = `nom,email
Dupont,test@test.com

Martin,m@m.com
`;

            const result = parseCSV(csv);

            expect(result.rows).toHaveLength(2);
        });
    });

    describe("trim des valeurs", () => {
        it("trim les headers", () => {
            const csv = ` nom , email
Dupont,test@test.com`;

            const result = parseCSV(csv);

            expect(result.headers).toContain("nom");
            expect(result.headers).toContain("email");
        });

        it("trim les valeurs", () => {
            const csv = `nom,email
 Dupont , test@test.com `;

            const result = parseCSV(csv);

            expect(result.rows[0].nom).toBe("Dupont");
            expect(result.rows[0].email).toBe("test@test.com");
        });
    });
});

// ==============================================
// Tests de objectsToCSV
// ==============================================
describe("objectsToCSV", () => {
    describe("génération basique", () => {
        it("génère un CSV à partir d'objets", () => {
            const objects = [
                { nom: "Dupont", email: "jean@example.com" },
                { nom: "Martin", email: "marie@example.com" },
            ];

            const result = objectsToCSV(objects);

            expect(result).toContain("nom,email");
            expect(result).toContain("Dupont,jean@example.com");
            expect(result).toContain("Martin,marie@example.com");
        });

        it("retourne une chaîne vide pour un tableau vide", () => {
            const result = objectsToCSV([]);
            expect(result).toBe("");
        });

        it("utilise les clés du premier objet comme headers", () => {
            const objects = [{ a: 1, b: 2 }];
            const result = objectsToCSV(objects);

            expect(result.startsWith("a,b")).toBe(true);
        });
    });

    describe("headers personnalisés", () => {
        it("utilise les headers fournis", () => {
            const objects = [{ nom: "Dupont", email: "test@test.com", age: 30 }];
            const result = objectsToCSV(objects, ["nom", "email"]);

            expect(result).toContain("nom,email");
            expect(result).not.toContain("age");
        });
    });

    describe("échappement des caractères spéciaux", () => {
        it("échappe les virgules", () => {
            const objects = [{ adresse: "Paris, France" }];
            const result = objectsToCSV(objects);

            expect(result).toContain('"Paris, France"');
        });

        it("échappe les guillemets", () => {
            const objects = [{ description: 'Il dit "bonjour"' }];
            const result = objectsToCSV(objects);

            expect(result).toContain('"Il dit ""bonjour"""');
        });

        it("échappe les retours à la ligne", () => {
            const objects = [{ notes: "Ligne 1\nLigne 2" }];
            const result = objectsToCSV(objects);

            expect(result).toContain('"Ligne 1\nLigne 2"');
        });
    });

    describe("gestion des valeurs nulles", () => {
        it("convertit null en chaîne vide", () => {
            const objects = [{ nom: "Dupont", email: null }];
            const result = objectsToCSV(objects);

            expect(result).toBe("nom,email\nDupont,");
        });

        it("convertit undefined en chaîne vide", () => {
            const objects = [{ nom: "Dupont", email: undefined }];
            const result = objectsToCSV(objects);

            expect(result).toBe("nom,email\nDupont,");
        });
    });

    describe("types de données", () => {
        it("convertit les nombres en chaînes", () => {
            const objects = [{ nom: "Dupont", age: 30 }];
            const result = objectsToCSV(objects);

            expect(result).toContain("30");
        });

        it("convertit les booléens en chaînes", () => {
            const objects = [{ nom: "Dupont", actif: true }];
            const result = objectsToCSV(objects);

            expect(result).toContain("true");
        });
    });
});

// ==============================================
// Tests d'intégration (parse puis export)
// ==============================================
describe("CSV round-trip", () => {
    it("parse et re-génère un CSV identique (données simples)", () => {
        const original = `nom,email
Dupont,jean@example.com
Martin,marie@example.com`;

        const parsed = parseCSV(original);
        const regenerated = objectsToCSV(parsed.rows, parsed.headers);

        expect(regenerated).toBe(original);
    });
});
