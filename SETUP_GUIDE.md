# Guide de Setup MyProPartner

## 📋 Prérequis

- Node.js 18+ installé
- PostgreSQL 14+ installé et démarré
- Compte Stripe (pour les paiements)
- Git installé

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <your-repo-url>
cd my-pro-partner
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Éditez `.env` et remplissez au minimum :
- `DATABASE_URL` - URL de connexion PostgreSQL
- `NEXTAUTH_SECRET` - Générer avec : `openssl rand -base64 32`
- `STRIPE_SECRET_KEY` - Clé Stripe (mode test pour dev)
- `STRIPE_PUBLISHABLE_KEY` - Clé publique Stripe

### 4. Créer la base de données PostgreSQL

```bash
# Connectez-vous à PostgreSQL
psql -U postgres

# Créez la base de données
CREATE DATABASE mypropartner;

# Sortez
\q
```

### 5. Exécuter la migration Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Cette commande va :
- Générer le client Prisma
- Créer toutes les tables dans la base de données
- Appliquer les migrations

### 6. (Optionnel) Seed initial

```bash
npx prisma db seed
```

### 7. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🎨 Configuration Stripe

### Créer les produits et prix dans Stripe

1. Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com)
2. Allez dans **Produits** → **Ajouter un produit**

#### Produit STARTER
- Nom : "Plan Starter"
- Prix mensuel : **29€/mois** (récurrent)
  - Copier le Price ID → `STRIPE_PRICE_STARTER_MONTHLY`
- Prix annuel : **290€/an** (récurrent)
  - Copier le Price ID → `STRIPE_PRICE_STARTER_YEARLY`

#### Produit PRO
- Nom : "Plan Pro"
- Prix mensuel : **79€/mois** (récurrent)
  - Copier le Price ID → `STRIPE_PRICE_PRO_MONTHLY`
- Prix annuel : **790€/an** (récurrent)
  - Copier le Price ID → `STRIPE_PRICE_PRO_YEARLY`

#### Produit ENTERPRISE
- Nom : "Plan Enterprise"
- Prix mensuel : **299€/mois** (récurrent)
  - Copier le Price ID → `STRIPE_PRICE_ENTERPRISE_MONTHLY`
- Prix annuel : **2990€/an** (récurrent)
  - Copier le Price ID → `STRIPE_PRICE_ENTERPRISE_YEARLY`

### Configurer les Webhooks Stripe

1. Dashboard Stripe → **Développeurs** → **Webhooks**
2. Ajouter un endpoint : `https://votre-domaine.com/api/webhooks/stripe`
3. Sélectionner les événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copier le **Signing secret** → `STRIPE_WEBHOOK_SECRET`

## 🛍️ Configuration des Intégrations E-commerce

### Shopify

1. Dans votre admin Shopify → **Apps** → **Develop apps**
2. Créer une nouvelle app
3. Configurer les **API scopes** :
   - `read_products`
   - `write_products`
   - `read_orders`
   - `write_orders`
   - `read_inventory`
   - `write_inventory`
4. Installer l'app et récupérer :
   - `SHOPIFY_API_KEY`
   - `SHOPIFY_API_SECRET`
   - `SHOPIFY_ACCESS_TOKEN`

### WooCommerce

1. Admin WordPress → **WooCommerce** → **Settings** → **Advanced** → **REST API**
2. Créer une nouvelle clé API avec permissions **Read/Write**
3. Récupérer :
   - `WOOCOMMERCE_CONSUMER_KEY`
   - `WOOCOMMERCE_CONSUMER_SECRET`

## 📱 Configuration PWA (Mode Offline)

### Créer les icônes

Créez deux images dans `/public` :
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)

Vous pouvez utiliser votre logo et le redimensionner.

### Build pour production

```bash
npm run build
npm start
```

Le Service Worker sera automatiquement enregistré en production.

## 🗄️ Structure de la base de données

Voici les tables principales créées :

### Multi-tenancy
- `Entreprise` - Entreprises (multi-tenant)
- `User` - Utilisateurs/Employés
- `Store` - Magasins/Points de vente
- `Register` - Caisses enregistreuses

### Business
- `Client` - Clients
- `Article` - Produits/Services
- `Document` - Devis/Factures
- `Paiement` - Paiements

### Stock
- `MouvementStock` - Mouvements de stock
- `StoreStockItem` - Stock par magasin
- `StockTransfer` - Transferts inter-magasins

### Personnel
- `UserPermissions` - Permissions granulaires
- `UserSchedule` - Horaires de travail
- `TimeEntry` - Pointage temps de travail
- `UserActivity` - Logs d'activité

### Fidélité & Marketing
- `NiveauFidelite` - Niveaux de fidélité
- `MouvementPoints` - Points de fidélité
- `Segment` - Segments clients
- `Campaign` - Campagnes marketing
- `Automation` - Automations

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e
```

## 📦 Build pour production

```bash
npm run build
```

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
vercel
```

### Docker

```bash
docker build -t mypropartner .
docker run -p 3000:3000 mypropartner
```

## 📝 Checklist de mise en production

- [ ] Variables d'environnement configurées
- [ ] Base de données PostgreSQL en production
- [ ] Migration Prisma exécutée
- [ ] Produits Stripe créés avec bons prix
- [ ] Webhooks Stripe configurés
- [ ] DNS configuré
- [ ] SSL/HTTPS activé
- [ ] Icônes PWA créées
- [ ] Service Worker testé
- [ ] Backup database configuré
- [ ] Monitoring (Sentry) configuré
- [ ] Analytics configuré

## 🆘 Troubleshooting

### Erreur : "Can't reach database server"

Vérifiez que PostgreSQL est démarré :
```bash
sudo service postgresql status
sudo service postgresql start
```

### Erreur : "Invalid `prisma.xxx.findMany()` invocation"

Regénérez le client Prisma :
```bash
npx prisma generate
```

### Le mode offline ne fonctionne pas

Le Service Worker n'est actif qu'en production. Build et déployez :
```bash
npm run build
npm start
```

## 📚 Documentation

- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Shopify API](https://shopify.dev/api)
- [WooCommerce API](https://woocommerce.github.io/woocommerce-rest-api-docs/)

## 🤝 Support

Pour toute question : support@mypropartner.com
