/**
 * Script pour vider toutes les tables de la base de données
 *
 * Usage: npx tsx scripts/clear-database.ts
 *
 * ATTENTION: Ce script supprime TOUTES les données de TOUTES les tables.
 * Utilisez avec précaution !
 */

import "dotenv/config";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("🗑️  Début du vidage de la base de données...\n");

  try {
    // Désactiver temporairement les contraintes de clés étrangères
    console.log("⚙️  Configuration de la transaction...");

    await prisma.$transaction(async (tx) => {
      // 1. Messages (dépend de Conversation)
      console.log("📧 Suppression des messages...");
      const messages = await tx.message.deleteMany({});
      console.log(`   ✓ ${messages.count} messages supprimés`);

      // 2. Executions d'automations (dépend de Automation)
      console.log("🤖 Suppression des exécutions d'automations...");
      const executions = await tx.automationExecution.deleteMany({});
      console.log(`   ✓ ${executions.count} exécutions supprimées`);

      // 3. Lignes de document
      console.log("📄 Suppression des lignes de documents...");
      const lignes = await tx.ligneDocument.deleteMany({});
      console.log(`   ✓ ${lignes.count} lignes supprimées`);

      // 4. Paiements
      console.log("💳 Suppression des paiements...");
      const paiements = await tx.paiement.deleteMany({});
      console.log(`   ✓ ${paiements.count} paiements supprimés`);

      // 5. Transactions bancaires
      console.log("🏦 Suppression des transactions bancaires...");
      const bankTransactions = await tx.bankTransaction.deleteMany({});
      console.log(`   ✓ ${bankTransactions.count} transactions bancaires supprimées`);

      // 6. Documents
      console.log("📋 Suppression des documents...");
      const documents = await tx.document.deleteMany({});
      console.log(`   ✓ ${documents.count} documents supprimés`);

      // 7. Items de transfert de stock
      console.log("📦 Suppression des items de transfert...");
      const transferItems = await tx.stockTransferItem.deleteMany({});
      console.log(`   ✓ ${transferItems.count} items de transfert supprimés`);

      // 8. Transferts de stock
      console.log("🚚 Suppression des transferts de stock...");
      const transfers = await tx.stockTransfer.deleteMany({});
      console.log(`   ✓ ${transfers.count} transferts supprimés`);

      // 9. Stock par magasin
      console.log("📊 Suppression du stock par magasin...");
      const storeStock = await tx.storeStockItem.deleteMany({});
      console.log(`   ✓ ${storeStock.count} stocks magasins supprimés`);

      // 10. Mouvements de stock
      console.log("📈 Suppression des mouvements de stock...");
      const mouvements = await tx.mouvementStock.deleteMany({});
      console.log(`   ✓ ${mouvements.count} mouvements supprimés`);

      // 11. Sessions de caisse
      console.log("💰 Suppression des sessions de caisse...");
      const sessions = await tx.registerSession.deleteMany({});
      console.log(`   ✓ ${sessions.count} sessions supprimées`);

      // 12. Caisses
      console.log("🛒 Suppression des caisses...");
      const registers = await tx.register.deleteMany({});
      console.log(`   ✓ ${registers.count} caisses supprimées`);

      // 13. Notifications clients
      console.log("🔔 Suppression des notifications clients...");
      const notifications = await tx.clientNotification.deleteMany({});
      console.log(`   ✓ ${notifications.count} notifications supprimées`);

      // 14. Mouvements de points
      console.log("⭐ Suppression des mouvements de points...");
      const mouvementsPoints = await tx.mouvementPoints.deleteMany({});
      console.log(`   ✓ ${mouvementsPoints.count} mouvements de points supprimés`);

      // 15. Activités utilisateur
      console.log("📝 Suppression des activités utilisateur...");
      const activities = await tx.userActivity.deleteMany({});
      console.log(`   ✓ ${activities.count} activités supprimées`);

      // 16. Entrées de temps
      console.log("⏰ Suppression des entrées de temps...");
      const timeEntries = await tx.timeEntry.deleteMany({});
      console.log(`   ✓ ${timeEntries.count} entrées de temps supprimées`);

      // 17. Horaires utilisateur
      console.log("📅 Suppression des horaires...");
      const schedules = await tx.userSchedule.deleteMany({});
      console.log(`   ✓ ${schedules.count} horaires supprimés`);

      // 18. Permissions utilisateur
      console.log("🔐 Suppression des permissions...");
      const permissions = await tx.userPermissions.deleteMany({});
      console.log(`   ✓ ${permissions.count} permissions supprimées`);

      // 19. Champs personnalisés
      console.log("🎨 Suppression des champs personnalisés...");
      const champsCustom = await tx.champPersonnalise.deleteMany({});
      console.log(`   ✓ ${champsCustom.count} champs personnalisés supprimés`);

      // 20. Articles
      console.log("🏷️  Suppression des articles...");
      const articles = await tx.article.deleteMany({});
      console.log(`   ✓ ${articles.count} articles supprimés`);

      // 21. Catégories (attention aux relations parent-enfant)
      console.log("📁 Suppression des catégories...");
      const categories = await tx.categorie.deleteMany({});
      console.log(`   ✓ ${categories.count} catégories supprimées`);

      // 22. Conversations
      console.log("💬 Suppression des conversations...");
      const conversations = await tx.conversation.deleteMany({});
      console.log(`   ✓ ${conversations.count} conversations supprimées`);

      // 23. Campagnes
      console.log("📢 Suppression des campagnes...");
      const campaigns = await tx.campaign.deleteMany({});
      console.log(`   ✓ ${campaigns.count} campagnes supprimées`);

      // 24. Automations
      console.log("⚡ Suppression des automations...");
      const automations = await tx.automation.deleteMany({});
      console.log(`   ✓ ${automations.count} automations supprimées`);

      // 25. Segments
      console.log("🎯 Suppression des segments...");
      const segments = await tx.segment.deleteMany({});
      console.log(`   ✓ ${segments.count} segments supprimés`);

      // 26. Clients
      console.log("👥 Suppression des clients...");
      const clients = await tx.client.deleteMany({});
      console.log(`   ✓ ${clients.count} clients supprimés`);

      // 27. Niveaux de fidélité
      console.log("🏆 Suppression des niveaux de fidélité...");
      const niveaux = await tx.niveauFidelite.deleteMany({});
      console.log(`   ✓ ${niveaux.count} niveaux supprimés`);

      // 28. Séries de documents
      console.log("🔢 Suppression des séries de documents...");
      const series = await tx.serieDocument.deleteMany({});
      console.log(`   ✓ ${series.count} séries supprimées`);

      // 29. Utilisateurs
      console.log("👤 Suppression des utilisateurs...");
      const users = await tx.user.deleteMany({});
      console.log(`   ✓ ${users.count} utilisateurs supprimés`);

      // 30. Magasins
      console.log("🏪 Suppression des magasins...");
      const stores = await tx.store.deleteMany({});
      console.log(`   ✓ ${stores.count} magasins supprimés`);

      // 31. Terminaux
      console.log("🖥️  Suppression des terminaux...");
      const terminals = await tx.terminal.deleteMany({});
      console.log(`   ✓ ${terminals.count} terminaux supprimés`);

      // 32. Liens de paiement
      console.log("🔗 Suppression des liens de paiement...");
      const paymentLinks = await tx.paymentLink.deleteMany({});
      console.log(`   ✓ ${paymentLinks.count} liens de paiement supprimés`);

      // 33. Compteurs d'usage
      console.log("📊 Suppression des compteurs d'usage...");
      const usageCounters = await tx.usageCounter.deleteMany({});
      console.log(`   ✓ ${usageCounters.count} compteurs supprimés`);

      // 34. Abonnements
      console.log("💎 Suppression des abonnements...");
      const subscriptions = await tx.subscription.deleteMany({});
      console.log(`   ✓ ${subscriptions.count} abonnements supprimés`);

      // 35. Paramètres entreprise
      console.log("⚙️  Suppression des paramètres...");
      const parametres = await tx.parametresEntreprise.deleteMany({});
      console.log(`   ✓ ${parametres.count} paramètres supprimés`);

      // 36. Tokens
      console.log("🔑 Suppression des tokens...");
      const passwordTokens = await tx.passwordResetToken.deleteMany({});
      console.log(`   ✓ ${passwordTokens.count} tokens de réinitialisation supprimés`);
      const invitationTokens = await tx.invitationToken.deleteMany({});
      console.log(`   ✓ ${invitationTokens.count} tokens d'invitation supprimés`);

      // 37. Entreprises (la racine)
      console.log("🏢 Suppression des entreprises...");
      const entreprises = await tx.entreprise.deleteMany({});
      console.log(`   ✓ ${entreprises.count} entreprises supprimées`);
    });

    console.log("\n✅ Toutes les tables ont été vidées avec succès !");
  } catch (error) {
    console.error("\n❌ Erreur lors du vidage de la base de données:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("\n🔌 Déconnexion de la base de données");
  }
}

// Confirmation avant exécution
console.log("⚠️  ATTENTION: Ce script va SUPPRIMER TOUTES LES DONNÉES de la base de données !");
console.log("⚠️  Cette action est IRRÉVERSIBLE !");
console.log("\nAppuyez sur Ctrl+C pour annuler, ou attendez 5 secondes pour continuer...\n");

setTimeout(() => {
  clearDatabase();
}, 5000);
