#!/usr/bin/env node

/**
 * Script de vérification de l'installation
 * Vérifie que toutes les dépendances et configurations sont correctes
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de l\'installation...\n');

let errors = 0;
let warnings = 0;

// Vérifier les dépendances npm
console.log('📦 Vérification des dépendances npm...');
try {
  const packageJson = require('./package.json');
  const requiredDeps = {
    'qrcode': 'Génération de QR codes',
    'csv-parse': 'Parsing de CSV bancaires',
    'date-fns': 'Formatage de dates',
  };

  for (const [dep, description] of Object.entries(requiredDeps)) {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies?.[dep]) {
      console.log(`  ❌ ${dep} manquant (${description})`);
      errors++;
    } else {
      console.log(`  ✅ ${dep}`);
    }
  }
} catch (_e) {
  console.log('  ❌ Erreur lors de la lecture de package.json');
  errors++;
}

console.log('');

// Vérifier le fichier .env
console.log('⚙️  Vérification de la configuration (.env)...');
try {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('  ❌ Fichier .env manquant');
    errors++;
  } else {
    const envContent = fs.readFileSync(envPath, 'utf8');

    const requiredVars = {
      'STRIPE_SECRET_KEY': 'Clé secrète Stripe',
      'STRIPE_PUBLISHABLE_KEY': 'Clé publique Stripe',
      'STRIPE_WEBHOOK_SECRET': 'Secret webhook Stripe',
      'STRIPE_PRICE_STARTER_MONTHLY': 'Price ID Starter mensuel',
      'STRIPE_PRICE_STARTER_ANNUAL': 'Price ID Starter annuel',
      'STRIPE_PRICE_PRO_MONTHLY': 'Price ID Pro mensuel',
      'STRIPE_PRICE_PRO_ANNUAL': 'Price ID Pro annuel',
      'STRIPE_PRICE_ENTERPRISE_MONTHLY': 'Price ID Enterprise mensuel',
      'STRIPE_PRICE_ENTERPRISE_ANNUAL': 'Price ID Enterprise annuel',
      'NEXT_PUBLIC_APP_URL': 'URL de l\'application',
    };

    for (const [varName, description] of Object.entries(requiredVars)) {
      const regex = new RegExp(`^${varName}=.+$`, 'm');
      if (!regex.test(envContent)) {
        console.log(`  ⚠️  ${varName} manquant ou vide (${description})`);
        warnings++;
      } else if (envContent.includes(`${varName}=price_REMPLACER`) ||
                 envContent.includes(`${varName}=REMPLACER`)) {
        console.log(`  ⚠️  ${varName} doit être remplacé par une vraie valeur`);
        warnings++;
      } else {
        console.log(`  ✅ ${varName}`);
      }
    }
  }
} catch (e) {
  console.log(`  ❌ Erreur lors de la lecture du .env: ${e.message}`);
  errors++;
}

console.log('');

// Vérifier les fichiers Prisma
console.log('🗄️  Vérification de Prisma...');
try {
  const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    console.log('  ❌ Fichier schema.prisma manquant');
    errors++;
  } else {
    console.log('  ✅ schema.prisma présent');

    const schemaContent = fs.readFileSync(schemaPath, 'utf8');

    // Vérifier les modèles critiques
    const requiredModels = [
      'Subscription',
      'PaymentLink',
      'Terminal',
      'BankTransaction',
      'UsageCounter',
    ];

    for (const model of requiredModels) {
      if (!schemaContent.includes(`model ${model}`)) {
        console.log(`  ❌ Modèle ${model} manquant dans schema.prisma`);
        errors++;
      } else {
        console.log(`  ✅ Modèle ${model}`);
      }
    }

    // Vérifier les enums
    const requiredEnums = [
      'PlanAbonnement',
      'SubscriptionStatus',
      'TerminalStatus',
      'ReconciliationStatus',
    ];

    for (const enumName of requiredEnums) {
      if (!schemaContent.includes(`enum ${enumName}`)) {
        console.log(`  ❌ Enum ${enumName} manquant dans schema.prisma`);
        errors++;
      } else {
        console.log(`  ✅ Enum ${enumName}`);
      }
    }
  }
} catch (e) {
  console.log(`  ❌ Erreur lors de la vérification Prisma: ${e.message}`);
  errors++;
}

console.log('');

// Vérifier les services
console.log('🛠️  Vérification des services...');
const requiredServices = [
  'lib/services/subscription.service.ts',
  'lib/services/qr-code.service.ts',
  'lib/services/payment-link.service.ts',
  'lib/services/terminal.service.ts',
  'lib/services/bank-reconciliation.service.ts',
];

for (const servicePath of requiredServices) {
  const fullPath = path.join(__dirname, servicePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`  ❌ ${servicePath}`);
    errors++;
  } else {
    console.log(`  ✅ ${servicePath}`);
  }
}

console.log('');

// Vérifier les routes API critiques
console.log('🌐 Vérification des routes API...');
const criticalRoutes = [
  'app/api/subscription/create-checkout/route.ts',
  'app/api/pos/checkout/route.ts',
  'app/api/terminal/register/route.ts',
  'app/api/bank/import/route.ts',
  'app/api/webhooks/stripe/route.ts',
];

for (const routePath of criticalRoutes) {
  const fullPath = path.join(__dirname, routePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`  ❌ ${routePath}`);
    errors++;
  } else {
    console.log(`  ✅ ${routePath}`);
  }
}

console.log('');

// Vérifier les pages frontend
console.log('🎨 Vérification des pages frontend...');
const criticalPages = [
  'app/pricing/page.tsx',
  'app/(dashboard)/dashboard/pos/page.tsx',
  'app/(dashboard)/dashboard/terminals/page.tsx',
  'app/(dashboard)/dashboard/bank-reconciliation/page.tsx',
];

for (const pagePath of criticalPages) {
  const fullPath = path.join(__dirname, pagePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`  ❌ ${pagePath}`);
    errors++;
  } else {
    console.log(`  ✅ ${pagePath}`);
  }
}

console.log('');

// Résumé
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
if (errors === 0 && warnings === 0) {
  console.log('✅ Installation parfaite ! Tous les fichiers sont présents.');
  console.log('\n🚀 Vous pouvez démarrer avec : npm run dev');
} else if (errors === 0) {
  console.log(`⚠️  Installation presque complète (${warnings} avertissements)`);
  console.log('\nComplétez les variables d\'environnement manquantes dans .env');
  console.log('Puis démarrez avec : npm run dev');
} else {
  console.log(`❌ Installation incomplète (${errors} erreurs, ${warnings} avertissements)`);
  console.log('\nCorrigez les erreurs ci-dessus avant de démarrer.');

  if (errors > 5) {
    console.log('\n💡 Conseil : Installez les dépendances manquantes avec :');
    console.log('   npm install qrcode csv-parse date-fns');
    console.log('   npm install -D @types/qrcode');
  }
}
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Exit code
process.exit(errors > 0 ? 1 : 0);
