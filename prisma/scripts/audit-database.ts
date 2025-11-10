import { config } from "dotenv";
import { resolve } from "path";

// Charger les variables d'environnement depuis .env.local
config({ path: resolve(__dirname, "../../.env.local") });

import { prisma } from "../../lib/prisma";

/**
 * Script d'audit complet de la base de données
 *
 * Vérifie :
 * - La cohérence des relations
 * - Les données orphelines
 * - Les incohérences de statut
 * - Les suggestions d'optimisation
 *
 * Usage: npm run audit:db
 */
async function main() {
  console.log("🔍 Starting database audit...\n");

  const issues: string[] = [];
  const warnings: string[] = [];
  const optimizations: string[] = [];

  try {
    // ============================================
    // 1. AUDIT DES SUBSCRIPTIONS
    // ============================================
    console.log("📊 Auditing subscriptions...");

    const subscriptions = await prisma.subscription.findMany({
      include: {
        entreprise: true,
      },
    });

    for (const sub of subscriptions) {
      // Vérifier cohérence plan entreprise vs subscription
      if (sub.entreprise.plan !== sub.plan) {
        issues.push(
          `❌ Plan mismatch: Entreprise ${sub.entreprise.nom} has plan="${sub.entreprise.plan}" but subscription has plan="${sub.plan}"`
        );
      }

      // Vérifier si la subscription est expirée mais toujours active
      if (sub.status === "ACTIVE" && sub.currentPeriodEnd < new Date()) {
        warnings.push(
          `⚠️  Subscription ${sub.id} is ACTIVE but expired on ${sub.currentPeriodEnd.toISOString()}`
        );
      }

      // Vérifier si cancelAtPeriodEnd est true mais la période est passée
      if (sub.cancelAtPeriodEnd && sub.currentPeriodEnd < new Date()) {
        warnings.push(
          `⚠️  Subscription ${sub.id} should be canceled (period ended on ${sub.currentPeriodEnd.toISOString()})`
        );
      }
    }

    console.log(`   ✓ Found ${subscriptions.length} subscription(s)\n`);

    // ============================================
    // 2. AUDIT DES ENTREPRISES
    // ============================================
    console.log("📊 Auditing entreprises...");

    const entreprises = await prisma.entreprise.findMany({
      include: {
        subscription: true,
        users: true,
      },
    });

    for (const entreprise of entreprises) {
      // Vérifier si entreprise a un plan payant mais pas de subscription
      if (entreprise.plan !== "FREE" && !entreprise.subscription) {
        issues.push(
          `❌ Entreprise ${entreprise.nom} has plan="${entreprise.plan}" but no subscription record`
        );
      }

      // Vérifier si entreprise FREE a une subscription
      if (entreprise.plan === "FREE" && entreprise.subscription) {
        issues.push(
          `❌ Entreprise ${entreprise.nom} is FREE but has a subscription record`
        );
      }

      // Vérifier si entreprise n'a pas d'utilisateurs
      if (entreprise.users.length === 0) {
        warnings.push(
          `⚠️  Entreprise ${entreprise.nom} has no users (orphaned?)`
        );
      }
    }

    console.log(`   ✓ Found ${entreprises.length} entreprise(s)\n`);

    // ============================================
    // 3. AUDIT DES USERS
    // ============================================
    console.log("📊 Auditing users...");

    const users = await prisma.user.findMany({
      include: {
        entreprise: true,
      },
    });

    for (const user of users) {
      // Vérifier si user n'a pas d'entreprise
      if (!user.entreprise) {
        issues.push(
          `❌ User ${user.email} has no entreprise (orphaned)`
        );
      }
    }

    console.log(`   ✓ Found ${users.length} user(s)\n`);

    // ============================================
    // 4. AUDIT DES CLIENTS
    // ============================================
    console.log("📊 Auditing clients...");

    const clients = await prisma.client.findMany({
      include: {
        entreprise: true,
      },
    });

    const orphanedClients = clients.filter(c => !c.entreprise);
    if (orphanedClients.length > 0) {
      issues.push(
        `❌ Found ${orphanedClients.length} orphaned client(s) without entreprise`
      );
    }

    console.log(`   ✓ Found ${clients.length} client(s)\n`);

    // ============================================
    // 5. AUDIT DES DOCUMENTS
    // ============================================
    console.log("📊 Auditing documents...");

    const documents = await prisma.document.findMany({
      include: {
        client: true,
        entreprise: true,
      },
    });

    for (const doc of documents) {
      // Vérifier si document a un client mais pas d'entreprise
      if (doc.client && !doc.entreprise) {
        issues.push(
          `❌ Document ${doc.numero} has client but no entreprise`
        );
      }

      // Vérifier si document est en brouillon depuis trop longtemps
      const daysSinceCreation = Math.floor(
        (Date.now() - doc.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (doc.statut === "BROUILLON" && daysSinceCreation > 30) {
        warnings.push(
          `⚠️  Document ${doc.numero} is in draft for ${daysSinceCreation} days`
        );
      }
    }

    console.log(`   ✓ Found ${documents.length} document(s)\n`);

    // ============================================
    // 6. SUGGESTIONS D'OPTIMISATION
    // ============================================
    console.log("📊 Checking optimizations...\n");

    // Vérifier les index manquants
    optimizations.push(
      "💡 Consider adding index on Client.email for faster lookups"
    );
    optimizations.push(
      "💡 Consider adding composite index on (Document.entrepriseId, Document.statut)"
    );
    optimizations.push(
      "💡 Consider adding index on Subscription.stripeSubscriptionId"
    );

    // Vérifier les relations
    if (subscriptions.length > 0 && subscriptions.length > entreprises.length * 0.8) {
      warnings.push(
        `⚠️  High subscription/entreprise ratio (${subscriptions.length}/${entreprises.length}). Consider cleaning old subscriptions.`
      );
    }

    // ============================================
    // 7. AFFICHAGE DU RAPPORT
    // ============================================
    console.log("\n" + "=".repeat(60));
    console.log("📋 AUDIT REPORT");
    console.log("=".repeat(60) + "\n");

    if (issues.length === 0 && warnings.length === 0) {
      console.log("✅ NO ISSUES FOUND! Database is consistent.\n");
    } else {
      if (issues.length > 0) {
        console.log("❌ CRITICAL ISSUES:");
        issues.forEach(issue => console.log(`   ${issue}`));
        console.log();
      }

      if (warnings.length > 0) {
        console.log("⚠️  WARNINGS:");
        warnings.forEach(warning => console.log(`   ${warning}`));
        console.log();
      }
    }

    if (optimizations.length > 0) {
      console.log("💡 OPTIMIZATION SUGGESTIONS:");
      optimizations.forEach(opt => console.log(`   ${opt}`));
      console.log();
    }

    // Stats finales
    console.log("📊 DATABASE STATS:");
    console.log(`   - Entreprises: ${entreprises.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Subscriptions: ${subscriptions.length}`);
    console.log(`   - Clients: ${clients.length}`);
    console.log(`   - Documents: ${documents.length}`);
    console.log();

    console.log("✅ Audit completed!");

    // Exit code selon les problèmes
    if (issues.length > 0) {
      console.log("\n⚠️  Critical issues found. Run fixes if needed.");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error during audit:", error);
    process.exit(1);
  }
}

main();
