import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../lib/prisma";

async function migrateExistingUsers() {
    console.log("🔄 Migration des utilisateurs existants vers multi-tenant...\n");

    try {
        // 1. Vérifier s'il y a des users sans entrepriseId (SQL brut car le champ n'est pas nullable dans Prisma)
        const usersWithoutCompany: any[] = await prisma.$queryRaw`
            SELECT * FROM "User" WHERE "entrepriseId" IS NULL
        `;

        if (usersWithoutCompany.length === 0) {
            console.log("✅ Tous les utilisateurs ont déjà une entreprise !");
            return;
        }

        console.log(`📝 Trouvé ${usersWithoutCompany.length} utilisateur(s) sans entreprise\n`);

        // 2. Créer une entreprise par défaut
        console.log("🏢 Création de l'entreprise par défaut...");
        const defaultEntreprise = await prisma.entreprise.create({
            data: {
                nom: "Entreprise Principale",
                email: usersWithoutCompany[0].email,
                plan: "PREMIUM",
                abonnementActif: true,
            },
        });
        console.log(`✅ Entreprise créée : ${defaultEntreprise.nom} (ID: ${defaultEntreprise.id})\n`);

        // 3. Créer les paramètres par défaut
        console.log("⚙️ Création des paramètres...");
        await prisma.parametresEntreprise.create({
            data: {
                entrepriseId: defaultEntreprise.id,
                nom_entreprise: "Entreprise Principale",
            },
        });
        console.log("✅ Paramètres créés\n");

        // 4. Lier tous les users à cette entreprise
        console.log("👥 Migration des utilisateurs...");
        for (const user of usersWithoutCompany) {
            await prisma.user.update({
                where: { id: user.id },
                data: { entrepriseId: defaultEntreprise.id },
            });
            console.log(`  ✅ ${user.email} → Entreprise ${defaultEntreprise.nom}`);
        }

        console.log(`\n✅ ${usersWithoutCompany.length} utilisateur(s) migré(s) avec succès !`);

        // 5. Migrer toutes les données existantes vers cette entreprise
        console.log("\n📦 Migration des données existantes...\n");

        const [categories, articles, clients, documents, mouvements] = await Promise.all([
            prisma.categorie.updateMany({
                where: { entrepriseId: null },
                data: { entrepriseId: defaultEntreprise.id },
            }),
            prisma.article.updateMany({
                where: { entrepriseId: null },
                data: { entrepriseId: defaultEntreprise.id },
            }),
            prisma.client.updateMany({
                where: { entrepriseId: null },
                data: { entrepriseId: defaultEntreprise.id },
            }),
            prisma.document.updateMany({
                where: { entrepriseId: null },
                data: { entrepriseId: defaultEntreprise.id },
            }),
            prisma.mouvementStock.updateMany({
                where: { entrepriseId: null },
                data: { entrepriseId: defaultEntreprise.id },
            }),
        ]);

        console.log(`  ✅ ${categories.count} catégorie(s) migrée(s)`);
        console.log(`  ✅ ${articles.count} article(s) migré(s)`);
        console.log(`  ✅ ${clients.count} client(s) migré(s)`);
        console.log(`  ✅ ${documents.count} document(s) migré(s)`);
        console.log(`  ✅ ${mouvements.count} mouvement(s) de stock migré(s)`);

        console.log("\n🎉 Migration terminée avec succès !");
        console.log(`\n📊 Résumé :`);
        console.log(`   - Entreprise : ${defaultEntreprise.nom}`);
        console.log(`   - ID : ${defaultEntreprise.id}`);
        console.log(`   - Utilisateurs : ${usersWithoutCompany.length}`);
        console.log(`   - Plan : ${defaultEntreprise.plan}`);
        console.log(`   - Statut : ${defaultEntreprise.abonnementActif ? "Actif" : "Inactif"}`);
    } catch (error) {
        console.error("\n❌ Erreur lors de la migration:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

migrateExistingUsers();
