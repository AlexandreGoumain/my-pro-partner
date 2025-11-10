# MyProPartner - ERP SaaS pour Artisans & PME

> Plateforme ERP full-stack multi-tenant moderne dédiée aux artisans et PME françaises, démontrant une maîtrise complète de l'écosystème Next.js et des architectures SaaS professionnelles.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

## 📋 À propos du projet

Application ERP SaaS **production-ready** développée avec les dernières technologies web, conçue pour gérer l'ensemble des besoins opérationnels d'une petite entreprise artisanale : gestion clients, catalogue produits, stocks multi-magasins, devis, factures, paiements, fidélité, équipe, caisse (POS), réconciliation bancaire, automatisations marketing et assistant IA.

**Ce projet met en avant :**

- Architecture SaaS multi-tenant complète avec isolation des données
- 122 API routes RESTful sécurisées avec validation stricte
- 40+ modèles de base de données avec relations complexes
- 66+ Custom Hooks pour architecture propre (séparation UI/logique)
- 12 services métier encapsulés et réutilisables
- Système de pricing avancé avec 4 plans (FREE, STARTER, PRO, ENTERPRISE)
- Navigation business-adaptive (20 types d'activités supportés)
- Authentification double : admin + portail client séparé
- Intégrations professionnelles (Stripe, OpenAI, Resend)
- PWA avec mode offline pour utilisation hors ligne

### 📊 État d'avancement du projet

**✅ Projet à 90% de complétion - Production Ready**

---

## 🎯 Compétences démontrées

### Frontend Avancé

- **React 19** avec Server Components et Client Components
- **Next.js 16** (App Router) avec optimisations automatiques
- **TypeScript strict** - Type safety complète avec validation runtime (Zod)
- **Shadcn/ui** - 50+ composants accessibles et personnalisables
- **Tailwind CSS v4** - Styling moderne responsive
- **React Hook Form + Zod** - Validation formulaires robuste
- **TanStack Query** - Cache et synchronisation serveur avec pagination
- **66+ Custom Hooks** - Architecture propre avec séparation complète UI/logique
- **PWA & Offline Mode** - Application installable avec mode hors ligne

### Backend & Architecture

- **Next.js API Routes** - 122 endpoints RESTful
- **Prisma ORM 6** - 40+ modèles avec type-safe queries
- **PostgreSQL 16** - Base de données relationnelle avec migrations
- **NextAuth.js v4** - Authentification double (admin + client portal)
- **Multi-Tenancy** - Isolation complète des données par entreprise
- **Service Layer** - 12 services métier réutilisables et testables
- **Role-Based Access Control (RBAC)** - 6 rôles avec 30+ permissions granulaires
- **Error Handling** - Gestion centralisée avec logging structuré
- **API Security** - CSRF protection, validation Zod, JWT sessions

### Intégrations Professionnelles

- **Stripe Complete** - Subscriptions, paiements, webhooks, Terminal (POS physique)
- **OpenAI GPT-4** - Chatbot assistant avec function calling
- **Resend** - Emails transactionnels avec templates React
- **React PDF** - Génération documents professionnels (devis, factures)
- **FEC Export** - Export comptable conforme norme française

### Architecture & Patterns

- **Clean Architecture** - Séparation stricte (Présentation / Hooks / Services / Data)
- **Custom Hooks Pattern** - 66+ hooks réutilisables pour logique métier
- **Service Layer Pattern** - Services encapsulés et testables
- **Multi-Tenancy Pattern** - Architecture SaaS avec isolation des données
- **Type Safety** - TypeScript strict + validation runtime (Zod)
- **Business-Adaptive Navigation** - UI qui s'adapte au type d'activité
- **Pricing System** - Limitation features et quotas par plan
- **DRY Principle** - Code hautement réutilisable et maintenable

---

## ✨ Fonctionnalités principales

> **Légende :** ✅ Implémenté et fonctionnel • 🚧 En cours • 💡 Planifié v1.0+

### 🔐 Authentification & Sécurité ✅

- ✅ Double système d'authentification (admin dashboard + portail client)
- ✅ Inscription/connexion sécurisée (bcrypt)
- ✅ OAuth 2.0 avec Google
- ✅ Sessions JWT (7 jours, httpOnly cookies)
- ✅ Protection CSRF et validation stricte des entrées
- ✅ Middleware de protection des routes API
- ✅ Système d'invitation pour collaborateurs
- ✅ Invitation clients au portail avec approbation

### 👥 Gestion des Clients ✅

- ✅ API REST complète (122 endpoints dont 20+ pour clients)
- ✅ CRUD avec validation Zod
- ✅ Recherche multi-critères (nom, email, ville, segment)
- ✅ Filtrage et pagination optimisée (React Query)
- ✅ **Portail client séparé** avec authentification indépendante
- ✅ Auto-inscription client avec approbation admin
- ✅ Segmentation clients avancée pour marketing ciblé
- ✅ Envoi d'emails personnalisés par client ou segment
- ✅ Historique complet des documents par client
- ✅ Import/export clients (CSV)
- ✅ Statistiques et analytics clients
- ✅ Système de notifications client (dashboard portail)

### 📦 Catalogue d'Articles ✅

- ✅ CRUD complet avec interface UI moderne
- ✅ Produits et Services distincts
- ✅ Vue grille/liste avec tri multi-critères
- ✅ **Gestion stocks multi-magasins** (stock par emplacement)
- ✅ Traçabilité complète (mouvements, historique)
- ✅ Alertes automatiques (rupture, seuil minimum, réapprovisionnement)
- ✅ **Transferts inter-magasins** avec validation
- ✅ Catégorisation hiérarchique (parent/enfant)
- ✅ **Champs personnalisés par catégorie** (configuration dynamique)
- ✅ Génération automatique de références
- ✅ Pagination et recherche temps réel
- 💡 Upload et gestion d'images produits

### 📄 Documents Commerciaux ✅

- ✅ **3 types de documents** : Devis, Factures, Avoirs
- ✅ API REST complète (CRUD, conversion, paiement, PDF, email)
- ✅ Workflow complet avec statuts (Brouillon, Envoyé, Accepté, Refusé, Payé, Annulé)
- ✅ Interface création/édition avec formulaire dynamique
- ✅ Calculs automatiques temps réel (HT, TVA, TTC, remises)
- ✅ Suivi des paiements multi-méthodes avec historique
- ✅ **Conversion devis → facture** automatisée
- ✅ **Génération PDF professionnelle** (React PDF) avec templates
- ✅ **Numérotation multi-séries** avec reset automatique (annuel/mensuel)
- ✅ Envoi par email avec PDF en pièce jointe
- ✅ **Paiement en ligne via Stripe** (lien de paiement dans facture)
- ✅ **Génération QR codes** pour paiement rapide
- ✅ Gestion des statuts avec transitions validées
- ✅ Vue grille/liste avec filtres avancés
- ✅ Analytics des impayés avec relances automatiques

### 🎁 Programme de Fidélité ✅

- ✅ Système de points complet (1€ = 1 point)
- ✅ **Gestion niveaux de fidélité** (CRUD admin avec configuration)
- ✅ Configuration par niveau : seuil, % remise, couleur, icône, avantages
- ✅ Attribution automatique du niveau selon points cumulés
- ✅ **Application automatique des remises** par niveau
- ✅ Gain automatique de points lors du paiement (Stripe webhook)
- ✅ Ajustements manuels de points (ajout/retrait admin)
- ✅ Historique complet des mouvements de points
- ✅ **Expiration automatique des points** (configurable)
- ✅ Dashboard client : solde, niveau actuel, progression
- ✅ Statistiques programme : taux participation, distribution par niveau
- ✅ API REST complète (points, niveaux, mouvements)

### 🏪 Gestion Multi-Magasins ✅

- ✅ Gestion de plusieurs emplacements physiques
- ✅ Stock par magasin avec suivi en temps réel
- ✅ **Transferts de stock inter-magasins** avec validation
- ✅ **Gestion des caisses/terminaux** par magasin
- ✅ Sessions de caisse (ouverture/fermeture avec fond de caisse)
- ✅ Rapports par magasin
- ✅ Configuration des paramètres par emplacement

### 💳 Point de Vente (POS) ✅

- ✅ Interface tactile pour vente en magasin
- ✅ Gestion du panier en temps réel
- ✅ Recherche produits rapide
- ✅ Sélection client et application fidélité
- ✅ **Multi-moyens de paiement** (Espèces, Carte, Chèque)
- ✅ **Intégration Stripe Terminal** (lecteurs de carte physiques)
- ✅ Génération ticket de caisse
- ✅ Workflow checkout optimisé

### 🏦 Réconciliation Bancaire ✅

- ✅ Import transactions bancaires (CSV)
- ✅ **Matching automatique** avec factures (montant + date)
- ✅ Matching manuel pour cas complexes
- ✅ Détection d'anomalies
- ✅ Statistiques de réconciliation
- ✅ Suivi du statut par transaction

### 👥 Gestion d'Équipe & Permissions ✅

- ✅ **6 rôles hiérarchiques** : OWNER, ADMIN, MANAGER, EMPLOYEE, CASHIER, ACCOUNTANT
- ✅ **30+ permissions granulaires** configurables par utilisateur
- ✅ Système d'invitation par email (tokens sécurisés)
- ✅ Gestion des horaires de travail
- ✅ **Time tracking** (pointage entrée/sortie)
- ✅ Historique d'activité utilisateur (audit log)
- ✅ Gestion des statuts (Actif, Inactif, Suspendu, Invité)
- ✅ Interface d'administration complète

### 🤖 Automatisations Marketing ✅

**Triggers :**
- ✅ Nouveau client dans segment
- ✅ Jalon client atteint (montant total, nombre achats)
- ✅ Changement de segment
- ✅ Inactivité détectée
- ✅ Tâches planifiées (cron)

**Actions :**
- ✅ Envoi d'email
- ✅ Ajout/retrait de segment
- ✅ Attribution de points fidélité
- ✅ Création de tâche
- 💡 Envoi SMS

- ✅ Exécution et logging des automatisations
- ✅ Statistiques de succès/échec

### 📧 Campagnes Marketing ✅

- ✅ Campagnes email ciblées par segment
- ✅ Planification de campagnes
- ✅ Tracking des performances (taux d'ouverture, clics)
- ✅ Gestion du statut (Brouillon, Planifiée, Envoyée, Terminée)
- ✅ Statistiques par campagne
- 💡 Campagnes SMS (structure prête)

### 🤖 Assistant IA (Chatbot) ✅

- ✅ **Intégration OpenAI GPT-4** avec function calling
- ✅ Conversations multi-tours
- ✅ Historique des messages
- ✅ Système de feedback (👍/👎)
- ✅ Conversations épinglées
- ✅ Récupération de données métier (clients, articles, documents, stats)
- ✅ Limitation par plan (FREE: 0, STARTER: 50/mois, PRO+: illimité)

### 💰 Système de Pricing & Abonnements ✅

**4 Plans :** FREE, STARTER (39€), PRO (69€), ENTERPRISE (179€)

- ✅ **40+ limites configurables** par plan
- ✅ Limitations quantitatives (clients, produits, documents/mois)
- ✅ Limitations fonctionnelles (analytics avancées, API, segmentation)
- ✅ Quotas mensuels avec reset automatique
- ✅ **Intégration Stripe Subscriptions** complète
- ✅ Webhooks pour sync automatique
- ✅ Portail client Stripe (gestion abonnement)
- ✅ Upgrade/downgrade avec proratisation
- ✅ Gestion du statut d'abonnement
- ✅ Composants paywall pour features limitées

### 🏢 Templates Métier & Onboarding ✅

**20 Types d'Activités Supportés :**
Général, Plomberie, Électricité, Chauffage, Menuiserie, Peinture, Maçonnerie, Restauration, Boulangerie, Coiffure, Esthétique, Fitness, Garage, Informatique, Consulting, Commerce de détail, Immobilier, Santé, Juridique, Comptabilité

**Features :**
- ✅ **Navigation business-adaptive** (terminologie et icônes adaptées)
- ✅ Catégories pré-configurées par industrie
- ✅ Champs personnalisés templates
- ✅ Niveaux de fidélité suggérés
- ✅ Séries de numérotation templates
- ✅ Wizard d'onboarding en 3 étapes
- ✅ Configuration automatique à l'inscription

### 📊 Analytics & Reporting ✅

- ✅ Dashboard avec KPIs temps réel
- ✅ Statistiques de vente (CA, évolution)
- ✅ Analyse de rentabilité
- ✅ Top débiteurs avec alertes
- ✅ Suivi des impayés avec relances
- ✅ Statistiques clients (segmentation, valeur vie)
- ✅ Performance produits (top ventes, marges)
- ✅ Analytics programme fidélité (participation, distribution)
- ✅ **Export FEC** (comptabilité française conforme)
- ✅ Filtrage temporel avancé
- 💡 Export Excel pour tous les rapports

### 📱 PWA & Offline ✅

- ✅ Progressive Web App manifest
- ✅ Service worker pour mode offline
- ✅ Installable sur mobile et desktop
- ✅ Gestion offline/online
- ✅ Icônes app (192x192, 512x512)

---

## 🛠️ Stack technique

| Catégorie          | Technologies                                      |
| ------------------ | ------------------------------------------------- |
| **Framework**      | Next.js 16 (App Router), React 19                 |
| **Language**       | TypeScript 5.x (strict mode)                      |
| **Styling**        | Tailwind CSS v4, Shadcn/ui (50+ composants)       |
| **Database**       | PostgreSQL 16 + Prisma ORM 6                      |
| **Auth**           | NextAuth.js v4 (JWT + OAuth Google)               |
| **Validation**     | Zod + React Hook Form                             |
| **State**          | TanStack Query, React Hooks (66+), Context API    |
| **API**            | Next.js API Routes (122 endpoints RESTful)        |
| **Payments**       | Stripe (Checkout, Subscriptions, Terminal, Links) |
| **AI**             | OpenAI GPT-4 (chatbot, function calling)          |
| **PDF**            | @react-pdf/renderer                               |
| **Email**          | Resend + React Email                              |
| **Charts**         | Recharts                                          |
| **Date/Time**      | date-fns                                          |
| **Icons**          | Lucide React                                      |
| **PWA**            | next-pwa (offline mode)                           |

---

## 🏗️ Architecture du projet

```
my-pro-partner/
├── app/
│   ├── (dashboard)/              # Layout admin avec protection auth
│   │   └── dashboard/
│   │       ├── articles/         # Gestion catalogue & stocks
│   │       ├── clients/          # CRM clients
│   │       ├── documents/        # Devis/Factures/Avoirs
│   │       ├── analytics/        # Tableaux de bord & KPIs
│   │       ├── settings/         # Paramètres entreprise
│   │       ├── campaigns/        # Campagnes marketing
│   │       ├── automations/      # Automatisations
│   │       ├── segments/         # Segmentation clients
│   │       ├── loyalty/          # Programme fidélité
│   │       ├── pos/              # Point de vente (caisse)
│   │       ├── bank/             # Réconciliation bancaire
│   │       ├── stores/           # Multi-magasins
│   │       ├── personnel/        # Gestion équipe
│   │       └── chatbot/          # Assistant IA
│   ├── (client-portal)/          # Portail client (auth séparée)
│   │   └── client/
│   │       ├── login/            # Connexion client
│   │       ├── register/         # Inscription client
│   │       ├── dashboard/        # Dashboard client
│   │       ├── documents/        # Documents client
│   │       ├── loyalty/          # Fidélité client
│   │       └── profile/          # Profil client
│   ├── api/                      # 122 API Routes REST
│   │   ├── auth/                 # Auth admin
│   │   ├── client/auth/          # Auth client portal
│   │   ├── admin/                # Routes admin
│   │   ├── articles/             # CRUD articles
│   │   ├── categories/           # CRUD catégories
│   │   ├── clients/              # CRUD clients
│   │   ├── documents/            # CRUD documents + PDF + email
│   │   ├── stock/                # Gestion stocks
│   │   ├── segments/             # Segmentation
│   │   ├── campaigns/            # Campagnes
│   │   ├── automations/          # Automatisations
│   │   ├── loyalty-levels/       # Niveaux fidélité
│   │   ├── loyalty-points/       # Points fidélité
│   │   ├── stores/               # Multi-magasins
│   │   ├── pos/                  # Point de vente
│   │   ├── bank/                 # Réconciliation bancaire
│   │   ├── personnel/            # Gestion équipe
│   │   ├── terminal/             # Stripe Terminal
│   │   ├── payment-links/        # Liens de paiement
│   │   ├── chatbot/              # Assistant IA
│   │   ├── subscription/         # Stripe subscriptions
│   │   ├── analytics/            # Endpoints analytics
│   │   ├── export/               # Exports (FEC, CSV)
│   │   └── webhooks/             # Webhooks Stripe
│   ├── auth/                     # Pages login/register admin
│   ├── team/                     # Acceptation invitations équipe
│   ├── onboarding/               # Wizard onboarding
│   ├── pricing/                  # Pages pricing
│   ├── pay/                      # Pages paiement public Stripe
│   └── payment/                  # Pages success/cancel paiement
├── components/
│   ├── ui/                       # Design system (50+ Shadcn)
│   ├── dashboard/                # Composants dashboard
│   ├── articles/                 # Composants articles
│   ├── categories/               # Composants catégories
│   ├── clients/                  # Composants clients
│   ├── documents/                # Composants documents
│   ├── segments/                 # Composants segmentation
│   ├── campaigns/                # Composants campagnes
│   ├── automations/              # Composants automatisations
│   ├── loyalty/                  # Composants fidélité
│   ├── pos/                      # Composants POS
│   ├── bank/                     # Composants réconciliation
│   ├── personnel/                # Composants équipe
│   ├── onboarding/               # Composants onboarding
│   ├── pricing/                  # Composants pricing
│   ├── paywall/                  # Composants limitation plans
│   ├── pdf/                      # Templates PDF
│   ├── analytics/                # Composants analytics
│   └── providers/                # Context providers
├── hooks/                        # 66+ Custom Hooks
│   ├── use-dashboard-stats.ts    # Stats dashboard
│   ├── use-article-stats.ts      # Stats articles
│   ├── use-article-filters.ts    # Filtrage articles
│   ├── use-clients-page.ts       # Page clients
│   ├── use-articles.ts           # Gestion articles
│   ├── use-documents.ts          # Gestion documents (React Query)
│   ├── use-document-detail.ts    # Détail document
│   ├── use-document-pdf.ts       # Opérations PDF
│   ├── use-payment-dialog.ts     # Dialogue paiement
│   ├── use-campaigns-page.ts     # Page campagnes
│   ├── use-automations-page.ts   # Page automatisations
│   ├── use-segments-page.ts      # Page segments
│   ├── use-loyalty-levels-page.ts # Page niveaux fidélité
│   ├── use-pos-cart.ts           # Panier POS
│   ├── use-subscription.ts       # Gestion abonnement
│   ├── use-plan-limits.ts        # Vérification limites plan
│   ├── use-client-auth.ts        # Auth client portal
│   ├── use-client-loyalty.ts     # Fidélité client
│   ├── use-business-navigation.ts # Navigation business-adaptive
│   └── ...                       # 45+ autres hooks
├── lib/
│   ├── services/                 # 12 Services métier
│   │   ├── business-template.service.ts
│   │   ├── email-notification.service.ts
│   │   ├── loyalty.service.ts
│   │   ├── fec.service.ts
│   │   ├── subscription.service.ts
│   │   ├── bank-reconciliation.service.ts
│   │   ├── terminal.service.ts
│   │   ├── payment-link.service.ts
│   │   ├── qr-code.service.ts
│   │   ├── notification.service.ts
│   │   ├── document-converter.service.ts
│   │   └── document-number-generator.service.ts
│   ├── navigation/               # Navigation business-adaptive
│   │   ├── navigation-config.ts
│   │   ├── navigation-labels.ts
│   │   └── navigation-utils.ts
│   ├── personnel/                # Personnel management
│   │   ├── personnel.service.ts
│   │   └── roles-config.ts
│   ├── email/                    # Service email
│   │   ├── email-service.ts
│   │   └── email-utils.ts
│   ├── stripe/                   # Configuration Stripe
│   │   ├── stripe-config.ts
│   │   └── stripe-constants.ts
│   ├── middleware/               # Middlewares
│   │   └── tenant-isolation.ts  # Multi-tenancy
│   ├── pricing-config.ts         # Configuration pricing (40+ limites)
│   ├── auth.ts                   # NextAuth config
│   ├── prisma.ts                 # Prisma client singleton
│   ├── validation.ts             # Schémas Zod réutilisables
│   ├── constants/                # Constantes globales
│   ├── types/                    # Types TypeScript globaux
│   └── utils/                    # Helpers & utilities
└── prisma/
    ├── schema.prisma             # 40+ modèles de données
    └── migrations/               # Historique migrations
```

---

## 📊 Modèle de données (Prisma)

### 40+ Entités Implémentées

**Multi-Tenancy & Subscriptions**
- **Entreprise** - Tenant principal (54 champs, 27 relations)
- **Subscription** - Abonnements Stripe
- **UsageCounter** - Compteurs mensuels (documents, questions)

**Gestion Utilisateurs & Équipe**
- **User** - Membres équipe (6 rôles)
- **UserPermissions** - 30+ permissions granulaires
- **UserSchedule** - Horaires de travail
- **TimeEntry** - Pointages entrée/sortie
- **UserActivity** - Audit log
- **UserInvitationToken** - Invitations équipe

**Multi-Magasins**
- **Store** - Emplacements physiques
- **Register** - Caisses/terminaux POS
- **RegisterSession** - Sessions de caisse
- **StoreStockItem** - Stock par magasin
- **StockTransfer** - Transferts inter-magasins
- **StockTransferItem** - Lignes de transfert

**Clients**
- **Client** - Données clients BtoB/BtoC
- **InvitationToken** - Invitations portail client
- **PasswordResetToken** - Reset mot de passe
- **ClientNotification** - Notifications client

**Catalogue**
- **Categorie** - Catégories hiérarchiques
- **ChampPersonnalise** - Champs dynamiques
- **Article** - Produits/Services
- **MouvementStock** - Historique mouvements

**Documents**
- **Document** - Devis, Factures, Avoirs
- **LigneDocument** - Lignes de documents
- **Paiement** - Historique paiements
- **SerieDocument** - Séries de numérotation

**Programme Fidélité**
- **NiveauFidelite** - Niveaux configurables
- **MouvementPoints** - Transactions de points

**Marketing**
- **Segment** - Segments clients
- **Campaign** - Campagnes email/SMS
- **Automation** - Automatisations
- **AutomationExecution** - Log exécutions

**Assistant IA**
- **Conversation** - Conversations chatbot
- **Message** - Messages chat

**Paiements**
- **PaymentLink** - Liens de paiement
- **Terminal** - Terminaux Stripe (POS physiques)

**Banque**
- **BankTransaction** - Transactions bancaires
- **ReconciliationStatus** - Statut matching

**Configuration**
- **ParametresEntreprise** - Paramètres globaux
- **BusinessType** - Type d'activité (20 types)

---

## 🚀 Installation & Lancement

### Prérequis

```bash
Node.js 18+ • PostgreSQL 16+ • npm/yarn/pnpm
```

### Configuration rapide

```bash
# 1. Cloner le dépôt
git clone <repository-url>
cd my-pro-partner

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos credentials

# 4. Initialiser la base de données
npx prisma generate
npx prisma db push  # ou: npx prisma migrate dev

# 5. Lancer en mode développement
npm run dev
```

L'application sera disponible sur **http://localhost:3000**

### Variables d'environnement requises

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mypropartner"

# Auth
NEXTAUTH_SECRET="<générer avec: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="<votre-google-oauth-client-id>"
GOOGLE_CLIENT_SECRET="<votre-google-oauth-secret>"

# Stripe (Paiements & Subscriptions)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI (Assistant IA)
OPENAI_API_KEY="sk-..."

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@votre-domaine.com"
EMAIL_FROM_NAME="MyProPartner"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📚 Concepts techniques avancés

### Architecture Multi-Tenant

```typescript
// Isolation complète des données par entreprise
export async function requireTenantAuth(): Promise<TenantContext> {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { entreprise: true }
  });

  // Validation abonnement
  if (!user.entreprise.abonnementActif) {
    throw new TenantError("Abonnement expiré", 403);
  }

  return { userId: user.id, entrepriseId: user.entreprise.id };
}
```

### Custom Hooks Architecture

```typescript
// Séparation complète UI / Logique métier
export function useArticlesPage() {
  const { stats, filters } = useArticleStats(articles);
  const { filteredArticles } = useArticleFilters(articles, filters);
  const { handleCreate, handleEdit, handleDelete } = useArticles();

  return { stats, filteredArticles, handlers };
}
```

### Type Safety Complète

```typescript
// Extension des types NextAuth
declare module "next-auth" {
  interface Session {
    user: User & {
      id: string;
      role: UserRole;
      entrepriseId: string;
      plan: PlanType;
    };
  }
}

// Inférence de types Prisma
type ArticleWithCategory = Prisma.ArticleGetPayload<{
  include: { categorie: true, store: true };
}>;
```

### Validation Double Couche

```typescript
// Schéma Zod partagé frontend/backend
const articleSchema = z.object({
  nom: z.string().min(1).max(100),
  prix: z.number().positive(),
  stock: z.number().int().min(0),
});

// Validation côté client (React Hook Form)
const form = useForm<z.infer<typeof articleSchema>>({
  resolver: zodResolver(articleSchema),
});

// Validation côté serveur (API Route)
const body = articleSchema.parse(await req.json());
```

### Pricing System

```typescript
// Configuration centralisée des limites
const PRICING_PLANS = {
  FREE: {
    maxClients: 10,
    maxProducts: 10,
    maxDocumentsPerMonth: 10,
    maxQuestionsPerMonth: 0,
    hasAdvancedAnalytics: false,
    canSegmentClients: false,
  },
  STARTER: {
    maxClients: 100,
    maxProducts: 100,
    maxDocumentsPerMonth: Infinity,
    maxQuestionsPerMonth: 50,
    hasAdvancedAnalytics: false,
    canSegmentClients: false,
  },
  // ... PRO, ENTERPRISE
};

// Utilisation dans composants
const { limits, canUse, isLimited } = usePlanLimits(userPlan);

if (isLimited('maxClients', clientsCount)) {
  return <UpgradePrompt />;
}
```

---

## 🎨 Design & UX

- **Design System** : Shadcn/ui pour cohérence visuelle (50+ composants)
- **Responsive** : Mobile-first avec breakpoints Tailwind
- **Accessibilité** : Support ARIA, navigation clavier, contraste WCAG
- **Loading States** : Skeletons et spinners pour feedback utilisateur
- **Error States** : Messages d'erreur clairs avec actions correctives
- **Empty States** : UI adaptées quand pas de données
- **Dark Mode Ready** : Support via Tailwind (prêt à activer)
- **PWA** : Installable avec icônes et manifest

---

## 🔒 Sécurité

- ✅ Validation stricte des entrées (Zod runtime + TypeScript)
- ✅ Protection CSRF native Next.js
- ✅ Sessions JWT sécurisées (httpOnly cookies, 7 jours)
- ✅ Hashing bcrypt pour mots de passe
- ✅ OAuth 2.0 avec Google
- ✅ Protection des routes API (middleware)
- ✅ Multi-tenancy avec isolation des données
- ✅ RBAC avec permissions granulaires
- ✅ Sanitization des erreurs (pas d'exposition de détails sensibles)
- ✅ Rate limiting sur endpoints sensibles
- ✅ Validation des webhooks Stripe (signatures)

---

## 📈 Roadmap & Évolutions

### 🎯 En cours (Sprint actuel)

- 🚧 Optimisations de performance (React Query cache, images)
- 🚧 Tests E2E (Playwright)
- 🚧 Documentation API (OpenAPI/Swagger)

### 📋 Prochaines priorités (v1.0)

- ⏳ Upload et gestion d'images produits (Cloudinary/AWS S3)
- ⏳ Export Excel pour tous les rapports analytics
- ⏳ Intégration SMS (Twilio) pour campagnes et notifications
- ⏳ Tables & Réservations (restaurants/bars) - backend à compléter
- ⏳ Intégrations comptables (Sage, QuickBooks)

### 🚀 Améliorations futures (v2.0+)

- **Multi-devise** - Support international
- **API Publique** - REST API pour intégrations tierces
- **Mobile Apps** - Applications natives iOS/Android
- **Marketplace** - Extensions et plugins tiers
- **BI Avancé** - Tableaux de bord personnalisables
- **Workflow Engine** - Automatisations avancées
- **Multi-langue** - i18n complet

---

## 🧪 Scripts disponibles

```bash
npm run dev           # Serveur de développement (localhost:3000)
npm run build         # Build de production optimisé
npm start             # Serveur de production
npm run lint          # Analyse ESLint
npx prisma studio     # Interface graphique DB (localhost:5555)
npx prisma generate   # Régénération du client Prisma
npx prisma db push    # Sync schema DB (développement)
npx prisma migrate dev # Créer migration (production)
```

---

## 📞 Contact & Portfolio

Ce projet est un **projet portfolio production-ready** démontrant mes compétences en développement full-stack moderne et architecture SaaS.

**Développé avec :** Next.js • React • TypeScript • PostgreSQL • Prisma • Stripe • OpenAI

### 📝 Points clés

Ce projet représente **~90% d'avancement** vers une version 1.0 production :

- ✅ **Architecture SaaS complète** avec multi-tenancy et isolation des données
- ✅ **122 API routes RESTful** avec validation stricte
- ✅ **40+ modèles de données** avec relations complexes
- ✅ **66+ Custom Hooks** pour architecture propre (séparation UI/logique)
- ✅ **12 Services métier** encapsulés et réutilisables
- ✅ **Authentification double** (admin dashboard + portail client)
- ✅ **Intégrations professionnelles** (Stripe, OpenAI, Resend)
- ✅ **Système de pricing** avancé avec 4 plans et 40+ limites
- ✅ **Navigation business-adaptive** (20 types d'activités)
- ✅ **Programme de fidélité** complet
- ✅ **Multi-magasins** avec transferts de stock
- ✅ **Point de vente (POS)** avec Stripe Terminal
- ✅ **Réconciliation bancaire** automatique
- ✅ **Automatisations marketing** avec triggers/actions
- ✅ **Assistant IA** avec GPT-4
- ✅ **PWA avec mode offline**

📚 **Le code démontre ma capacité à :**
- Architecturer une application SaaS complexe avec **Clean Architecture**
- Implémenter des **patterns professionnels** (Custom Hooks, Service Layer, Multi-Tenancy)
- Gérer des **intégrations tierces** (Stripe, OpenAI, Resend, PDF)
- Optimiser les **performances** (React Query, pagination, caching)
- Maintenir une **qualité de code** élevée (DRY, types stricts, error handling)
- Développer des **features avancées** (RBAC, pricing, business templates, AI chatbot)

**Prochaines étapes** : Upload d'images, tests E2E, documentation API, optimisations performance

---

💼 **Disponible pour opportunités full-stack JavaScript/TypeScript**
