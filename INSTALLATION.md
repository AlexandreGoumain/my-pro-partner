# 🚀 Installation Rapide - Système de Paiement Complet

Ce guide vous permet d'installer et de configurer l'ensemble du système en **moins de 30 minutes**.

---

## 📋 Prérequis

- Node.js 18+ installé
- Base de données PostgreSQL configurée
- Compte Stripe (mode test pour commencer)
- Git

---

## ⚡ Installation en 5 étapes

### 1️⃣ Installer les dépendances NPM

```bash
# Dépendances principales
npm install qrcode csv-parse date-fns

# Types TypeScript
npm install -D @types/qrcode
```

### 2️⃣ Configurer les variables d'environnement

Compléter le fichier `.env` avec vos clés Stripe :

```bash
# Stripe - Clés de base
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE
STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_PUBLIQUE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_WEBHOOK

# Stripe - Price IDs (à configurer après création des produits)
STRIPE_PRICE_STARTER_MONTHLY=price_REMPLACER
STRIPE_PRICE_STARTER_ANNUAL=price_REMPLACER
STRIPE_PRICE_PRO_MONTHLY=price_REMPLACER
STRIPE_PRICE_PRO_ANNUAL=price_REMPLACER
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_REMPLACER
STRIPE_PRICE_ENTERPRISE_ANNUAL=price_REMPLACER

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3️⃣ Migrer la base de données

```bash
# Appliquer le schéma Prisma
npx prisma db push

# Générer le client Prisma
npx prisma generate
```

### 4️⃣ Configurer Stripe Dashboard

#### A. Créer les produits et prix

1. Connectez-vous sur https://dashboard.stripe.com/test/products
2. Cliquez sur "Ajouter un produit"
3. Créez 3 produits avec leurs prix :

**Produit 1 : STARTER**
- Nom : "Plan Starter"
- Description : "Pour les petites structures"
- Prix 1 : 29€/mois (récurrent)
  - Copier le Price ID → `STRIPE_PRICE_STARTER_MONTHLY`
- Prix 2 : 290€/an (récurrent)
  - Copier le Price ID → `STRIPE_PRICE_STARTER_ANNUAL`

**Produit 2 : PRO**
- Nom : "Plan Pro"
- Description : "Pour les entreprises en croissance"
- Prix 1 : 79€/mois (récurrent)
  - Copier le Price ID → `STRIPE_PRICE_PRO_MONTHLY`
- Prix 2 : 790€/an (récurrent)
  - Copier le Price ID → `STRIPE_PRICE_PRO_ANNUAL`

**Produit 3 : ENTERPRISE**
- Nom : "Plan Enterprise"
- Description : "Pour les grandes entreprises"
- Prix 1 : 299€/mois (récurrent)
  - Copier le Price ID → `STRIPE_PRICE_ENTERPRISE_MONTHLY`
- Prix 2 : 2990€/an (récurrent)
  - Copier le Price ID → `STRIPE_PRICE_ENTERPRISE_ANNUAL`

#### B. Configurer le webhook

1. Allez sur https://dashboard.stripe.com/test/webhooks
2. Cliquez sur "Ajouter un endpoint"
3. URL de l'endpoint : `https://votre-domaine.com/api/webhooks/stripe`
   - En développement local : utilisez [Stripe CLI](https://stripe.com/docs/stripe-cli) ou [ngrok](https://ngrok.com/)
4. Sélectionnez les événements suivants :
   ```
   ✅ checkout.session.completed
   ✅ customer.subscription.created
   ✅ customer.subscription.updated
   ✅ customer.subscription.deleted
   ✅ customer.subscription.trial_will_end
   ✅ invoice.paid
   ✅ invoice.payment_failed
   ✅ payment_intent.succeeded
   ```
5. Copiez le "Signing secret" → `STRIPE_WEBHOOK_SECRET`

#### C. Configuration pour le développement local

Pour tester les webhooks en local, utilisez Stripe CLI :

```bash
# Installer Stripe CLI (si pas déjà fait)
# Mac: brew install stripe/stripe-cli/stripe
# Windows: scoop install stripe
# Linux: https://stripe.com/docs/stripe-cli

# Se connecter à Stripe
stripe login

# Rediriger les webhooks vers votre serveur local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Le terminal affichera un webhook secret : copiez-le dans STRIPE_WEBHOOK_SECRET
```

### 5️⃣ Démarrer l'application

```bash
# Démarrer le serveur de développement
npm run dev
```

L'application sera disponible sur http://localhost:3000

---

## ✅ Tests de Validation

### Test 1 : Abonnement

1. Ouvrez http://localhost:3000/pricing
2. Cliquez sur "Commencer l'essai" pour le plan STARTER
3. Utilisez la carte de test Stripe : `4242 4242 4242 4242`
4. Date d'expiration : n'importe quelle date future
5. CVC : n'importe quel 3 chiffres
6. Vérifiez la redirection vers `/pricing/success`

### Test 2 : Point de Vente (POS)

1. Ouvrez http://localhost:3000/dashboard/pos
2. Ajoutez des articles au panier
3. Cliquez sur "Payer par carte"
4. Vérifiez que le ticket s'ouvre automatiquement

### Test 3 : Rapprochement Bancaire

1. Créez un fichier CSV de test `test-bank.csv` :
   ```csv
   Date;Libellé;Montant;Référence
   15/01/2025;Virement client;1250.50;REF123
   16/01/2025;Paiement fournisseur;-450.00;REF456
   ```

2. Ouvrez http://localhost:3000/dashboard/bank-reconciliation
3. Cliquez sur "Importer CSV"
4. Sélectionnez le fichier
5. Vérifiez l'import des transactions

### Test 4 : Terminaux (optionnel - nécessite un terminal Stripe)

1. Ouvrez http://localhost:3000/dashboard/terminals
2. Cliquez sur "Enregistrer un terminal"
3. Sélectionnez un terminal Stripe disponible
4. Donnez-lui un nom
5. Vérifiez qu'il apparaît dans la liste

---

## 🎨 Vérifications Supplémentaires

### Vérifier les composants UI

```bash
# Vérifier que tous les composants shadcn/ui sont installés
# Si un composant manque, l'installer avec :
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
```

### Vérifier la configuration TypeScript

```bash
# S'assurer qu'il n'y a pas d'erreurs TypeScript
npm run build
```

---

## 🐛 Résolution de Problèmes

### Erreur : "Module not found: qrcode"

```bash
npm install qrcode @types/qrcode
```

### Erreur : "Module not found: csv-parse"

```bash
npm install csv-parse
```

### Erreur Prisma : "Column 'subscription' does not exist"

```bash
# Réinitialiser la base de données (⚠️ en développement uniquement)
npx prisma db push --force-reset
npx prisma generate
```

### Erreur Stripe : "No such price"

Vérifiez que vous avez bien copié les Price IDs depuis le Stripe Dashboard vers votre fichier `.env`.

### Webhooks ne fonctionnent pas en local

Utilisez Stripe CLI pour rediriger les webhooks :

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- **Guide complet** : [`docs/IMPLEMENTATION_COMPLETE.md`](./docs/IMPLEMENTATION_COMPLETE.md)
- **Configuration Stripe** : [`docs/STRIPE_SUBSCRIPTIONS_SETUP.md`](./docs/STRIPE_SUBSCRIPTIONS_SETUP.md)
- **Démarrage rapide** : [`docs/QUICKSTART_SUBSCRIPTIONS.md`](./docs/QUICKSTART_SUBSCRIPTIONS.md)

---

## 🎯 Fonctionnalités Installées

Après cette installation, vous disposez de :

- ✅ Système d'abonnement SaaS (4 plans + essai gratuit)
- ✅ Point de Vente (POS) tactile avec impression de tickets
- ✅ Paiements par QR Code
- ✅ Liens de paiement partageables avec statistiques
- ✅ Support Apple Pay, Google Pay, PayPal
- ✅ Intégration terminaux physiques Stripe Terminal
- ✅ Rapprochement bancaire automatique (import CSV)
- ✅ Gestion automatique des stocks
- ✅ Webhooks Stripe complètement configurés
- ✅ API REST complète pour tous les modules

---

## 🚀 Passer en Production

Quand vous êtes prêt à passer en production :

1. **Créer les mêmes produits sur le compte Stripe LIVE** (pas test)
2. **Remplacer les clés de test par les clés live** dans `.env`
3. **Reconfigurer le webhook** avec l'URL de production
4. **Déployer** sur Vercel, Railway, ou votre hébergeur

```bash
# Build de production
npm run build

# Démarrer en production
npm start
```

---

## 💡 Conseils

- **En développement** : Gardez Stripe CLI actif pour recevoir les webhooks
- **Tests de paiement** : Utilisez toujours `4242 4242 4242 4242` en mode test
- **CSV bancaires** : Le format attendu est français (point-virgule, virgule pour décimales)
- **Période d'essai** : STARTER/PRO = 14 jours, ENTERPRISE = 30 jours

---

**✅ Installation terminée ! Vous êtes prêt à surpasser SumUp ! 🚀**

*Questions ou problèmes ? Consultez la documentation complète dans `/docs`*
