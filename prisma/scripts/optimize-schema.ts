import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

/**
 * Script pour appliquer automatiquement toutes les optimisations recommandées
 *
 * - Ajoute les timestamps manquants (createdAt/updatedAt)
 * - Ajoute les index composites pour la scalabilité
 * - Ajoute les index manquants sur colonnes fréquemment utilisées
 */

const schemaPath = resolve(__dirname, "../schema.prisma");

function main() {
  console.log("🔧 Application des optimisations au schéma Prisma...\n");

  let schema = readFileSync(schemaPath, "utf-8");
  let modificationsCount = 0;

  // ============================================
  // 1. AJOUTER LES TIMESTAMPS MANQUANTS
  // ============================================
  console.log("📅 Ajout des timestamps manquants...");

  const modelsNeedingTimestamps = [
    "LigneDocument",
    "Paiement",
    "MouvementStock",
    "MouvementPoints",
    "Message",
  ];

  modelsNeedingTimestamps.forEach(modelName => {
    const modelRegex = new RegExp(
      `(model ${modelName} \\{[\\s\\S]*?)(\\n\\})`
    );

    if (schema.match(modelRegex)) {
      // Vérifier si les timestamps existent déjà
      const modelContent = schema.match(modelRegex)?.[0] || "";

      if (!modelContent.includes("createdAt") && !modelContent.includes("updatedAt")) {
        schema = schema.replace(
          modelRegex,
          `$1
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
$2`
        );
        console.log(`   ✓ ${modelName}: Added timestamps`);
        modificationsCount++;
      }
    }
  });

  // ============================================
  // 2. AJOUTER LES INDEX COMPOSITES
  // ============================================
  console.log("\n📈 Ajout des index composites...");

  const compositeIndexes: Record<string, string[][]> = {
    Article: [
      ["entrepriseId", "actif"],
      ["categorieId", "actif"],
    ],
    Document: [
      ["entrepriseId", "type"],
      ["clientId", "statut"],
    ],
    LigneDocument: [
      ["documentId", "articleId"],
    ],
    Paiement: [
      ["documentId", "statut"],
    ],
    MouvementStock: [
      ["articleId", "date"],
      ["entrepriseId", "date"],
    ],
    Client: [
      ["entrepriseId", "niveauFideliteId"],
    ],
    StoreStockItem: [
      ["storeId", "articleId"],
    ],
  };

  Object.entries(compositeIndexes).forEach(([modelName, indexes]) => {
    const modelRegex = new RegExp(
      `(model ${modelName} \\{[\\s\\S]*?)((?:\\n  @@.*)*)(\\n\\})`
    );

    const match = schema.match(modelRegex);
    if (match) {
      const currentIndexes = match[2] || "";

      indexes.forEach(fields => {
        const indexStr = `@@index([${fields.join(", ")}])`;

        // Vérifier si l'index existe déjà
        if (!currentIndexes.includes(indexStr)) {
          // Ajouter juste avant le closing brace
          schema = schema.replace(
            new RegExp(`(model ${modelName} \\{[\\s\\S]*?)(\\n\\})`),
            `$1  ${indexStr}\n$2`
          );
          console.log(`   ✓ ${modelName}: Added ${indexStr}`);
          modificationsCount++;
        }
      });
    }
  });

  // ============================================
  // 3. AJOUTER LES INDEX SIMPLES MANQUANTS
  // ============================================
  console.log("\n📊 Ajout des index simples manquants...");

  const simpleIndexes: Record<string, string[]> = {
    Client: ["telephone"],
    Paiement: ["date", "mode"],
  };

  Object.entries(simpleIndexes).forEach(([modelName, fields]) => {
    fields.forEach(field => {
      const indexStr = `@@index([${field}])`;
      const modelRegex = new RegExp(
        `(model ${modelName} \\{[\\s\\S]*?)(\\n\\})`
      );

      const match = schema.match(modelRegex);
      if (match) {
        const modelContent = match[0];

        // Vérifier que le champ existe et que l'index n'existe pas
        if (modelContent.includes(`${field}`) && !modelContent.includes(indexStr)) {
          schema = schema.replace(
            modelRegex,
            `$1  ${indexStr}\n$2`
          );
          console.log(`   ✓ ${modelName}: Added index on ${field}`);
          modificationsCount++;
        }
      }
    });
  });

  // ============================================
  // 4. SAUVEGARDER LE SCHÉMA
  // ============================================
  if (modificationsCount > 0) {
    writeFileSync(schemaPath, schema, "utf-8");
    console.log(`\n✅ ${modificationsCount} optimisation(s) appliquée(s) au schéma!`);
    console.log("\n⚠️  IMPORTANT: Exécutez maintenant:");
    console.log("   npx prisma db push");
    console.log("   (ou créez une migration si en production)\n");
  } else {
    console.log("\n✅ Le schéma est déjà complètement optimisé!\n");
  }
}

main();
