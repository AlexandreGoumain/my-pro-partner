import { config } from "dotenv";
import { resolve } from "path";

// Charger les variables d'environnement depuis .env.local
config({ path: resolve(__dirname, "../../.env.local") });

import { prisma } from "../../lib/prisma";

/**
 * Script pour nettoyer complètement toutes les subscriptions
 * et remettre toutes les entreprises en FREE
 *
 * Usage: npx tsx prisma/scripts/reset-subscriptions.ts
 */
async function main() {
  console.log("🔧 Starting subscription reset...\n");

  try {
    // 1. Compter les subscriptions existantes
    const subCount = await prisma.subscription.count();
    console.log(`📊 Found ${subCount} subscription(s) to delete`);

    // 2. Supprimer toutes les subscriptions
    const deletedSubs = await prisma.subscription.deleteMany({});
    console.log(`✅ Deleted ${deletedSubs.count} subscription(s)\n`);

    // 3. Compter les entreprises avec des plans payants
    const paidEntreprises = await prisma.entreprise.count({
      where: {
        plan: {
          in: ["STARTER", "PRO", "ENTERPRISE"],
        },
      },
    });
    console.log(`📊 Found ${paidEntreprises} entreprise(s) with paid plans`);

    // 4. Remettre toutes les entreprises en FREE
    const updatedEntreprises = await prisma.entreprise.updateMany({
      where: {
        plan: { not: "FREE" },
      },
      data: {
        plan: "FREE",
      },
    });
    console.log(`✅ Reset ${updatedEntreprises.count} entreprise(s) to FREE\n`);

    // 5. Afficher un résumé
    const totalEntreprises = await prisma.entreprise.count();
    const freeEntreprises = await prisma.entreprise.count({
      where: { plan: "FREE" },
    });

    console.log("📊 Final state:");
    console.log(`   - Total entreprises: ${totalEntreprises}`);
    console.log(`   - FREE plan: ${freeEntreprises}`);
    console.log(`   - Paid plans: ${totalEntreprises - freeEntreprises}`);
    console.log(`   - Total subscriptions: 0`);

    console.log("\n✅ Subscription reset completed successfully!");
    console.log("ℹ️  All users are now on FREE plan and can subscribe again.");
  } catch (error) {
    console.error("❌ Error during reset:", error);
    process.exit(1);
  }
}

main();
