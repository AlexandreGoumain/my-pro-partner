import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";

// Charger les variables d'environnement
config({ path: resolve(__dirname, "../../.env.local") });

import { prisma } from "../../lib/prisma";

/**
 * Audit complet de la structure du schéma Prisma
 *
 * Vérifie :
 * - Utilité de chaque table
 * - Optimisation des index pour gros volumes
 * - Relations cohérentes
 * - Types de données appropriés
 * - Suggestions d'amélioration
 */

interface TableInfo {
  name: string;
  recordCount: number;
  hasIndex: boolean;
  relations: string[];
  issues: string[];
  optimizations: string[];
}

async function main() {
  console.log("🔍 AUDIT COMPLET DU SCHÉMA DE BASE DE DONNÉES");
  console.log("=".repeat(70) + "\n");

  const schemaPath = resolve(__dirname, "../schema.prisma");
  const schemaContent = readFileSync(schemaPath, "utf-8");

  // Extraire tous les modèles du schéma
  const modelRegex = /model\s+(\w+)\s*\{[\s\S]*?\n\}/g;
  const models = [...schemaContent.matchAll(modelRegex)];

  const tables: TableInfo[] = [];
  const criticalIssues: string[] = [];
  const warnings: string[] = [];

  // ============================================
  // 1. ANALYSER CHAQUE TABLE
  // ============================================
  console.log("📊 Analyse de chaque table...\n");

  for (const match of models) {
    const tableName = match[1];
    const tableContent = match[0];

    console.log(`\n📋 ${tableName}:`);

    const issues: string[] = [];
    const tableOptimizations: string[] = [];

    try {
      // Compter les enregistrements
      const count = await (prisma as Record<string, { count?: () => Promise<number> }>)[tableName.toLowerCase()]?.count?.() || 0;
      console.log(`   Records: ${count}`);

      // Vérifier les index
      const hasIndexes = tableContent.includes("@@index");
      const indexMatches = [...tableContent.matchAll(/@@index\(\[([\w,\s]+)\]\)/g)];
      console.log(`   Indexes: ${indexMatches.length}`);

      if (indexMatches.length > 0) {
        indexMatches.forEach(idx => {
          console.log(`     - ${idx[1]}`);
        });
      }

      // Extraire les relations
      const relationMatches = [...tableContent.matchAll(/(\w+)\s+(\w+)(\[\])?\s+@relation/g)];
      const relations = relationMatches.map(r => r[2]);

      // Vérifier les champs critiques
      const hasCreatedAt = tableContent.includes("createdAt");
      const hasUpdatedAt = tableContent.includes("updatedAt");
      const hasEntrepriseId = tableContent.includes("entrepriseId");

      // RÈGLES DE VÉRIFICATION

      // 1. Tables sans index sur clés étrangères critiques
      if (hasEntrepriseId && !tableContent.includes("@@index([entrepriseId])")) {
        issues.push(`⚠️ Missing index on entrepriseId (critical for multi-tenant queries)`);
      }

      // 2. Tables sans timestamps
      if (!hasCreatedAt || !hasUpdatedAt) {
        warnings.push(`⚠️ ${tableName}: Missing createdAt/updatedAt (audit trail)`);
      }

      // 3. Champs text sans limite qui devraient avoir une limite
      if (tableContent.includes("String?") && !tableContent.includes("@db.Text")) {
        const stringFields = [...tableContent.matchAll(/(\w+)\s+String\?/g)];
        if (stringFields.length > 3) {
          tableOptimizations.push(
            `Consider using @db.Text or @db.VarChar(n) for long strings in ${tableName}`
          );
        }
      }

      // 4. Index sur colonnes qui devraient en avoir (pour scale)
      const scaleRecommendations: Record<string, string[]> = {
        Document: ["dateEmission", "dateEcheance", "statut", "type", "clientId"],
        Article: ["reference", "code_barre", "actif", "type"],
        Client: ["email", "telephone", "nom"],
        MouvementStock: ["date", "articleId", "type"],
        Paiement: ["date", "mode", "statut"],
        User: ["email", "role"],
        LigneDocument: ["documentId", "articleId"],
        Campaign: ["status", "scheduledAt"],
        Conversation: ["status", "priority", "assignedToId"],
      };

      if (scaleRecommendations[tableName]) {
        const recommendedFields = scaleRecommendations[tableName];
        const missingIndexes = recommendedFields.filter(field => {
          return tableContent.includes(`${field}`) &&
                 !tableContent.includes(`@@index([${field}])`);
        });

        if (missingIndexes.length > 0 && count === 0) {
          tableOptimizations.push(
            `📈 ${tableName}: Consider adding indexes on [${missingIndexes.join(", ")}] for better scale`
          );
        }
      }

      // 5. Tables relationnelles qui devraient avoir des index composites
      const compositeRecommendations: Record<string, string[][]> = {
        Document: [["entrepriseId", "statut"], ["entrepriseId", "type"], ["clientId", "statut"]],
        Article: [["entrepriseId", "actif"], ["categorieId", "actif"]],
        LigneDocument: [["documentId", "articleId"]],
        MouvementStock: [["articleId", "date"], ["entrepriseId", "date"]],
        Client: [["entrepriseId", "niveauFideliteId"]],
        Paiement: [["documentId", "statut"]],
        StoreStockItem: [["storeId", "articleId"]],
      };

      if (compositeRecommendations[tableName]) {
        compositeRecommendations[tableName].forEach(fields => {
          const indexExists = tableContent.includes(`@@index([${fields.join(", ")}])`);
          if (!indexExists) {
            tableOptimizations.push(
              `💡 ${tableName}: Add composite index on (${fields.join(", ")}) for faster queries`
            );
          }
        });
      }

      tables.push({
        name: tableName,
        recordCount: count,
        hasIndex: hasIndexes,
        relations,
        issues,
        optimizations: tableOptimizations,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.log(`   ❌ Error: ${errorMessage}`);
      criticalIssues.push(`❌ ${tableName}: Cannot analyze (${errorMessage})`);
    }
  }

  // ============================================
  // 2. VÉRIFIER LES RELATIONS ORPHELINES
  // ============================================
  console.log("\n\n🔗 Vérification des relations...\n");

  const relationChecks = [
    {
      parent: "Entreprise",
      child: "User",
      foreignKey: "entrepriseId",
      async check() {
        const orphans = await prisma.user.findMany({
          where: { entrepriseId: undefined },
        });
        return orphans.length;
      },
    },
    {
      parent: "Entreprise",
      child: "Client",
      foreignKey: "entrepriseId",
      async check() {
        const orphans = await prisma.client.findMany({
          where: { entrepriseId: undefined },
        });
        return orphans.length;
      },
    },
    {
      parent: "Entreprise",
      child: "Document",
      foreignKey: "entrepriseId",
      async check() {
        const orphans = await prisma.document.findMany({
          where: { entrepriseId: undefined },
        });
        return orphans.length;
      },
    },
  ];

  for (const check of relationChecks) {
    try {
      const orphanCount = await check.check();
      if (orphanCount > 0) {
        criticalIssues.push(
          `❌ Found ${orphanCount} orphaned ${check.child} records (no ${check.parent})`
        );
      } else {
        console.log(`   ✓ ${check.parent} → ${check.child}: OK`);
      }
    } catch {
      // Table might not exist yet
    }
  }

  // ============================================
  // 3. VÉRIFIER LA SCALABILITÉ
  // ============================================
  console.log("\n\n📈 Analyse de scalabilité...\n");

  // Tables critiques pour la performance
  const criticalTables = [
    "Document",
    "LigneDocument",
    "Article",
    "Client",
    "MouvementStock",
    "Paiement",
    "StoreStockItem",
  ];

  criticalTables.forEach(tableName => {
    const table = tables.find(t => t.name === tableName);
    if (table) {
      console.log(`   ${tableName}:`);
      console.log(`     - Current records: ${table.recordCount}`);
      console.log(`     - Indexes: ${table.hasIndex ? "✓" : "❌ MISSING"}`);

      // Estimation de volume pour un ERP
      const expectedVolumes: Record<string, number> = {
        Document: 100000, // 100k documents/an
        LigneDocument: 500000, // 5 lignes/doc en moyenne
        Article: 10000,
        Client: 50000,
        MouvementStock: 200000,
        Paiement: 100000,
        StoreStockItem: 50000,
      };

      if (expectedVolumes[tableName]) {
        const expected = expectedVolumes[tableName];
        console.log(`     - Expected at scale: ~${expected.toLocaleString()} records`);

        if (!table.hasIndex) {
          criticalIssues.push(
            `🚨 ${tableName} will have ${expected.toLocaleString()}+ records but has NO INDEXES!`
          );
        }
      }
    }
  });

  // ============================================
  // 4. TABLES INUTILISÉES
  // ============================================
  console.log("\n\n🗑️ Vérification des tables inutilisées...\n");

  const unusedTables = tables.filter(t =>
    t.recordCount === 0 &&
    !["Subscription", "UsageCounter", "PaymentLink", "Terminal"].includes(t.name)
  );

  if (unusedTables.length > 0) {
    console.log(`   Found ${unusedTables.length} empty tables (might be unused or new features):`);
    unusedTables.forEach(t => {
      console.log(`     - ${t.name}`);
    });
  } else {
    console.log(`   ✓ All tables are in use`);
  }

  // ============================================
  // 5. RAPPORT FINAL
  // ============================================
  console.log("\n\n" + "=".repeat(70));
  console.log("📋 RAPPORT FINAL");
  console.log("=".repeat(70) + "\n");

  // Critical Issues
  if (criticalIssues.length > 0) {
    console.log("🚨 PROBLÈMES CRITIQUES:\n");
    criticalIssues.forEach(issue => console.log(`   ${issue}`));
    console.log();
  }

  // Warnings
  if (warnings.length > 0) {
    console.log("⚠️  AVERTISSEMENTS:\n");
    warnings.forEach(warning => console.log(`   ${warning}`));
    console.log();
  }

  // Optimizations
  const allOptimizations = tables.flatMap(t => t.optimizations);
  if (allOptimizations.length > 0) {
    console.log("💡 OPTIMISATIONS RECOMMANDÉES:\n");
    allOptimizations.forEach(opt => console.log(`   ${opt}`));
    console.log();
  }

  // Summary
  console.log("📊 RÉSUMÉ:\n");
  console.log(`   Total tables: ${tables.length}`);
  console.log(`   Tables with data: ${tables.filter(t => t.recordCount > 0).length}`);
  console.log(`   Tables with indexes: ${tables.filter(t => t.hasIndex).length}`);
  console.log(`   Critical issues: ${criticalIssues.length}`);
  console.log(`   Warnings: ${warnings.length}`);
  console.log(`   Optimization suggestions: ${allOptimizations.length}`);
  console.log();

  // Grade
  let grade = "A+";
  if (criticalIssues.length > 0) grade = "D";
  else if (warnings.length > 5) grade = "C";
  else if (allOptimizations.length > 10) grade = "B";

  console.log(`🎯 GRADE: ${grade}`);
  console.log();

  if (grade === "A+" || grade === "B") {
    console.log("✅ Votre base de données est bien structurée et optimisée!");
  } else {
    console.log("⚠️  Des améliorations sont recommandées pour une meilleure scalabilité.");
  }

  // Exit code
  process.exit(criticalIssues.length > 0 ? 1 : 0);
}

main();
