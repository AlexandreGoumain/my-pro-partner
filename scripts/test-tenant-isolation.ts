import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

interface TestResult {
    test: string;
    passed: boolean;
    message: string;
}

const results: TestResult[] = [];

function logTest(test: string, passed: boolean, message: string) {
    results.push({ test, passed, message });
    const emoji = passed ? "✅" : "❌";
    console.log(`${emoji} ${test}: ${message}`);
}

async function testTenantIsolation() {
    console.log("\n🧪 ==== TEST D'ISOLATION MULTI-TENANT ====\n");

    let entrepriseA: any;
    let entrepriseB: any;
    let userA: any;
    let userB: any;
    let articleA: any;
    let categorieA: any;

    try {
        console.log("📝 Étape 1: Création de 2 entreprises de test\n");

        entrepriseA = await prisma.entreprise.create({
            data: {
                nom: "TEST Entreprise A (Plombier)",
                email: "testA@isolation.test",
                plan: "FREE",
                abonnementActif: true,
            },
        });
        logTest(
            "Création Entreprise A",
            true,
            `ID: ${entrepriseA.id.substring(0, 8)}...`
        );

        entrepriseB = await prisma.entreprise.create({
            data: {
                nom: "TEST Entreprise B (Électricien)",
                email: "testB@isolation.test",
                plan: "FREE",
                abonnementActif: true,
            },
        });
        logTest(
            "Création Entreprise B",
            true,
            `ID: ${entrepriseB.id.substring(0, 8)}...`
        );

        console.log("\n📝 Étape 2: Création des utilisateurs\n");

        const hashedPassword = await bcrypt.hash("TestPassword123!", 10);

        userA = await prisma.user.create({
            data: {
                email: "userA@isolation.test",
                password: hashedPassword,
                name: "User A",
                role: "admin",
                entrepriseId: entrepriseA.id,
            },
        });
        logTest("Création User A", true, `Email: ${userA.email}`);

        userB = await prisma.user.create({
            data: {
                email: "userB@isolation.test",
                password: hashedPassword,
                name: "User B",
                role: "admin",
                entrepriseId: entrepriseB.id,
            },
        });
        logTest("Création User B", true, `Email: ${userB.email}`);

        console.log("\n📝 Étape 3: Création de données pour Entreprise A\n");

        categorieA = await prisma.categorie.create({
            data: {
                nom: "Plomberie",
                description: "Articles de plomberie",
                ordre: 1,
                entrepriseId: entrepriseA.id,
            },
        });
        logTest("Création Catégorie A", true, `Nom: ${categorieA.nom}`);

        articleA = await prisma.article.create({
            data: {
                reference: "PLOMB-001",
                nom: "Robinet cuisine",
                prix_ht: 59.99,
                type: "PRODUIT",
                entrepriseId: entrepriseA.id,
                categorieId: categorieA.id,
            },
        });
        logTest(
            "Création Article A",
            true,
            `Ref: ${articleA.reference}, Prix: ${articleA.prix_ht}€`
        );

        console.log("\n📝 Étape 4: Création de données pour Entreprise B\n");

        const categorieB = await prisma.categorie.create({
            data: {
                nom: "Électricité",
                description: "Matériel électrique",
                ordre: 1,
                entrepriseId: entrepriseB.id,
            },
        });
        logTest("Création Catégorie B", true, `Nom: ${categorieB.nom}`);

        const articleB = await prisma.article.create({
            data: {
                reference: "PLOMB-001",
                nom: "Interrupteur",
                prix_ht: 12.50,
                type: "PRODUIT",
                entrepriseId: entrepriseB.id,
                categorieId: categorieB.id,
            },
        });
        logTest(
            "Création Article B (même référence!)",
            true,
            `Ref: ${articleB.reference}, Prix: ${articleB.prix_ht}€`
        );

        console.log("\n🔒 Étape 5: Tests d'isolation\n");

        const articlesA = await prisma.article.findMany({
            where: { entrepriseId: entrepriseA.id },
        });
        logTest(
            "Articles Entreprise A",
            articlesA.length === 1 && articlesA[0].id === articleA.id,
            `${articlesA.length} article trouvé (attendu: 1)`
        );

        const articlesB = await prisma.article.findMany({
            where: { entrepriseId: entrepriseB.id },
        });
        logTest(
            "Articles Entreprise B",
            articlesB.length === 1 && articlesB[0].id !== articleA.id,
            `${articlesB.length} article trouvé (attendu: 1)`
        );

        const categoriesA = await prisma.categorie.findMany({
            where: { entrepriseId: entrepriseA.id },
        });
        logTest(
            "Catégories Entreprise A",
            categoriesA.length === 1,
            `${categoriesA.length} catégorie (attendu: 1)`
        );

        const categoriesB = await prisma.categorie.findMany({
            where: { entrepriseId: entrepriseB.id },
        });
        logTest(
            "Catégories Entreprise B",
            categoriesB.length === 1,
            `${categoriesB.length} catégorie (attendu: 1)`
        );

        console.log("\n🔐 Étape 6: Test de contrainte unique par entreprise\n");

        try {
            await prisma.article.findUnique({
                where: {
                    entrepriseId_reference: {
                        entrepriseId: entrepriseA.id,
                        reference: "PLOMB-001",
                    },
                },
            });
            logTest(
                "Contrainte unique (Entreprise A)",
                true,
                "Trouvé PLOMB-001 pour Entreprise A"
            );
        } catch (error) {
            logTest(
                "Contrainte unique (Entreprise A)",
                false,
                `Erreur: ${error}`
            );
        }

        try {
            await prisma.article.findUnique({
                where: {
                    entrepriseId_reference: {
                        entrepriseId: entrepriseB.id,
                        reference: "PLOMB-001",
                    },
                },
            });
            logTest(
                "Contrainte unique (Entreprise B)",
                true,
                "Trouvé PLOMB-001 pour Entreprise B"
            );
        } catch (error) {
            logTest(
                "Contrainte unique (Entreprise B)",
                false,
                `Erreur: ${error}`
            );
        }

        console.log("\n🧹 Étape 7: Nettoyage (suppression cascade)\n");

        await prisma.article.deleteMany({
            where: {
                OR: [
                    { entrepriseId: entrepriseA.id },
                    { entrepriseId: entrepriseB.id },
                ],
            },
        });
        logTest("Suppression des articles", true, "Articles supprimés");

        await prisma.categorie.deleteMany({
            where: {
                OR: [
                    { entrepriseId: entrepriseA.id },
                    { entrepriseId: entrepriseB.id },
                ],
            },
        });
        logTest("Suppression des catégories", true, "Catégories supprimées");

        await prisma.user.deleteMany({
            where: {
                OR: [
                    { entrepriseId: entrepriseA.id },
                    { entrepriseId: entrepriseB.id },
                ],
            },
        });
        logTest("Suppression des users", true, "Users supprimés");

        await prisma.entreprise.deleteMany({
            where: {
                id: { in: [entrepriseA.id, entrepriseB.id] },
            },
        });
        logTest("Suppression des entreprises", true, "Entreprises supprimées");

        console.log("\n📊 ==== RÉSULTAT DES TESTS ====\n");

        const passed = results.filter((r) => r.passed).length;
        const failed = results.filter((r) => !r.passed).length;
        const total = results.length;

        console.log(`✅ Tests réussis: ${passed}/${total}`);
        console.log(`❌ Tests échoués: ${failed}/${total}`);

        if (failed === 0) {
            console.log("\n🎉 TOUS LES TESTS SONT PASSÉS !");
            console.log("✅ L'isolation multi-tenant fonctionne correctement\n");
        } else {
            console.log("\n⚠️  CERTAINS TESTS ONT ÉCHOUÉ");
            console.log("❌ Vérifier la configuration multi-tenant\n");
            process.exit(1);
        }
    } catch (error) {
        console.error("\n❌ ERREUR CRITIQUE:", error);

        console.log("\n🧹 Tentative de nettoyage en cas d'erreur...\n");
        try {
            if (entrepriseA) {
                await prisma.entreprise.delete({
                    where: { id: entrepriseA.id },
                });
            }
            if (entrepriseB) {
                await prisma.entreprise.delete({
                    where: { id: entrepriseB.id },
                });
            }
        } catch (cleanupError) {
            console.error("Erreur lors du nettoyage:", cleanupError);
        }

        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testTenantIsolation();
