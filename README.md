# MyProPartner - ERP pour Artisans

> Plateforme ERP full-stack moderne dédiée aux artisans et PME, démontrant une maîtrise complète de l'écosystème Next.js et des architectures web modernes.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

## 📋 À propos du projet

Application ERP complète développée en utilisant les dernières technologies web, conçue pour gérer l'ensemble des besoins opérationnels d'une petite entreprise artisanale : gestion clients, catalogue produits, devis, factures et suivi des paiements.

**Ce projet met en avant :**

-   Architecture full-stack moderne avec Next.js 16 (App Router)
-   Maîtrise de TypeScript en mode strict
-   Conception d'APIs RESTful sécurisées
-   Modélisation de bases de données relationnelles complexes
-   UX/UI professionnelle avec design system cohérent
-   Bonnes pratiques de développement (DRY, type safety, error handling)

### 📊 État d'avancement du projet

**Modules complétés (70%):**

-   ✅ Authentification complète (JWT + OAuth Google)
-   ✅ Gestion des articles (CRUD, UI, stocks, catégories)
-   ✅ API Clients (backend complet)
-   ✅ API Documents (backend complet)
-   ✅ Système de gestion des stocks avec alertes

**En cours de développement (20%):**

-   🚧 Interface utilisateur pour la gestion des clients
-   🚧 Interface utilisateur pour les documents commerciaux
-   🚧 Logique métier des calculs et paiements

**Planifié (10%):**

-   ⏳ Génération PDF et exports
-   ⏳ Upload d'images
-   ⏳ Fonctionnalités avancées (conversions, emails, stats)

## 🎯 Compétences démontrées

### Frontend

-   **React 19** avec Server Components et Client Components
-   **Next.js 16** (App Router) - Routing moderne et optimisations automatiques
-   **TypeScript strict** - Type safety complète avec types étendus
-   **Shadcn/ui** - Composants accessibles et personnalisables
-   **Tailwind CSS v4** - Styling moderne et responsive
-   **React Hook Form + Zod** - Validation de formulaires robuste
-   **Gestion d'état** - Hooks React et Context API

### Backend

-   **Next.js API Routes** - Architecture serverless
-   **Prisma ORM** - Type-safe database queries
-   **PostgreSQL** - Base de données relationnelle
-   **NextAuth.js v4** - Authentication complète (JWT + OAuth)
-   **RESTful API** - Design d'API standardisé et paginé
-   **Error Handling** - Gestion centralisée des erreurs

### Architecture & Best Practices

-   **Clean Architecture** - Séparation des responsabilités
-   **Type Safety** - TypeScript strict avec validation runtime (Zod)
-   **Security First** - CSRF protection, validation stricte, sessions JWT
-   **DRY Principle** - Code réutilisable et maintenable
-   **Error Management** - Gestion unifiée des erreurs Prisma
-   **API Pagination** - Optimisation des performances

## ✨ Fonctionnalités principales

> **Légende :** ✅ Implémenté et fonctionnel • 🚧 En cours de développement • ⏳ Prochainement • 💡 Planifié pour v1.0+

### 🔐 Authentification & Sécurité ✅

-   ✅ Système d'inscription/connexion sécurisé (bcrypt)
-   ✅ OAuth 2.0 avec Google
-   ✅ Sessions JWT sans stockage côté serveur (7 jours)
-   ✅ Protection CSRF et validation des entrées
-   ✅ Middleware de protection des routes API

### 👥 Gestion des Clients 🚧

-   ✅ API REST complète (CRUD avec validation Zod)
-   ✅ Recherche multi-critères (nom, email, ville)
-   ✅ Filtrage et pagination optimisée
-   🚧 Interface utilisateur dashboard
-   ⏳ Export de données (CSV/Excel)

### 📦 Catalogue d'Articles ✅

-   ✅ CRUD complet avec interface UI moderne
-   ✅ Vue grille/liste avec tri multi-critères
-   ✅ Gestion complète des stocks (mouvements, historique)
-   ✅ Alertes automatiques (rupture de stock, seuil minimum)
-   ✅ Catégorisation hiérarchique (parent/enfant)
-   ✅ Pagination et recherche en temps réel
-   ⏳ Upload et gestion d'images produits

### 📄 Documents Commerciaux 🚧

-   ✅ Modèle de données complet (Devis, Factures, Avoirs)
-   ✅ API REST pour CRUD documents
-   ✅ Statuts multiples (Brouillon, Envoyé, Accepté, Payé...)
-   🚧 Interface de création/édition de documents
-   🚧 Calculs automatiques (HT, TVA, TTC, remises)
-   🚧 Suivi des paiements (modèle prêt, API à créer)
-   ⏳ Workflow de conversion devis → facture
-   ⏳ Génération PDF avec template professionnel
-   ⏳ Numérotation automatique incrémentale

## 🛠️ Stack technique

| Catégorie      | Technologies                        |
| -------------- | ----------------------------------- |
| **Framework**  | Next.js 16 (App Router), React 19   |
| **Language**   | TypeScript 5.x (strict mode)        |
| **Styling**    | Tailwind CSS v4, Shadcn/ui          |
| **Database**   | PostgreSQL 16 + Prisma ORM          |
| **Auth**       | NextAuth.js v4 (JWT + OAuth Google) |
| **Validation** | Zod + React Hook Form               |
| **State**      | React Hooks, Context API            |
| **API**        | Next.js API Routes (RESTful)        |

## 🏗️ Architecture du projet

```
my-pro-partner/
├── app/
│   ├── (dashboard)/              # Layout avec protection auth
│   │   └── dashboard/
│   │       ├── articles/         # Gestion catalogue
│   │       ├── clients/          # CRM clients
│   │       └── documents/        # Devis/Factures
│   ├── api/                      # API Routes REST
│   │   ├── auth/                 # Endpoints auth
│   │   ├── articles/             # CRUD articles
│   │   ├── clients/              # CRUD clients
│   │   └── documents/            # CRUD documents
│   └── auth/                     # Pages login/register
├── components/
│   ├── ui/                       # Design system (Shadcn)
│   ├── skeletons/                # Loading states
│   └── providers/                # Context providers
├── lib/
│   ├── auth.ts                   # NextAuth config
│   ├── db.ts                     # Prisma client singleton
│   ├── validation.ts             # Schémas Zod réutilisables
│   ├── constants/                # Config & constantes
│   ├── errors/                   # Error handling utilities
│   ├── types/                    # Types TypeScript globaux
│   └── utils/                    # Helpers & utilities
└── prisma/
    ├── schema.prisma             # Modèle de données
    └── migrations/               # Historique migrations
```

## 📊 Modèle de données

Le schéma Prisma comprend **8 entités principales** avec relations complexes :

| Entité                   | État              | Description                                                               |
| ------------------------ | ----------------- | ------------------------------------------------------------------------- |
| **User**                 | ✅ Utilisé        | Utilisateurs avec rôles (ADMIN/USER), authentification                    |
| **Client**               | ✅ Utilisé        | Données clients BtoB/BtoC avec API complète                               |
| **Article**              | ✅ Utilisé        | Produits/Services avec stocks et catégories                               |
| **Categorie**            | ✅ Utilisé        | Hiérarchie parent/enfant pour articles                                    |
| **MouvementStock**       | ✅ Utilisé        | Traçabilité complète des stocks (ENTREE, SORTIE, etc.)                    |
| **Document**             | 🚧 Partiel        | Devis/Factures/Avoirs (API prête, UI en cours)                            |
| **LigneDocument**        | 🚧 Partiel        | Lignes de documents (modèle prêt, API à créer)                            |
| **Paiement**             | ⏳ Prévu          | Historique paiements multi-méthodes                                       |
| **ParametresEntreprise** | ⏳ Prévu          | Configuration entreprise (TVA, CGV, numérotation)                         |
| **CompteClient**         | 💡 Planifié v1.0  | Gestion débit/crédit, solde, échéances                                    |
| **MouvementPoints**      | 💡 Planifié v1.0  | Traçabilité programme fidélité (gain/dépense/expiration)                  |
| **NiveauFidelite**       | 💡 Planifié v1.0  | Table configurable (nom, seuil points, remise, avantages) avec CRUD admin |
| **MouvementCompte**      | 💡 Planifié v1.0  | Historique des mouvements de compte client                                |
| **Ticket**               | 💡 Planifié v2.0+ | Système de tickets (bugs, features, support) avec workflow                |
| **CommentaireTicket**    | 💡 Planifié v2.0+ | Fil de discussion et historique des tickets                               |
| **VoteTicket**           | 💡 Planifié v2.0+ | Votes utilisateurs pour priorisation features                             |
| **Reprise**              | 💡 Planifié v2.0+ | Dossiers de reprise avec workflow et évaluation                           |
| **GrilleReprise**        | 💡 Planifié v2.0+ | Barèmes de prix de reprise selon état et ancienneté                       |
| **EtatProduit**          | 💡 Planifié v2.0+ | Évaluation détaillée (état, photos, défauts)                              |

**Points clés architecturaux :**

-   Relations one-to-many et many-to-one bien définies
-   Soft deletes avec champs `deletedAt` optionnels
-   Timestamps automatiques (`createdAt`, `updatedAt`)
-   Contraintes d'intégrité référentielle (CASCADE, SET NULL)
-   Index pour optimisation des requêtes fréquentes
-   Types TypeScript générés automatiquement par Prisma

## 🚀 Installation & Lancement

### Prérequis

```bash
Node.js 18+ • PostgreSQL 14+ • npm/yarn/pnpm
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
npx prisma migrate dev

# 5. Lancer en mode développement
npm run dev
```

L'application sera disponible sur **http://localhost:3000**

### Variables d'environnement requises

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mypropartner"
NEXTAUTH_SECRET="<générer avec: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="<votre-google-oauth-client-id>"
GOOGLE_CLIENT_SECRET="<votre-google-oauth-secret>"
```

## 📚 Concepts techniques mis en œuvre

### Type Safety complète

```typescript
// Extension des types NextAuth
declare module "next-auth" {
    interface Session {
        user: User & { id: string; role: UserRole };
    }
}

// Inférence de types Prisma
type ArticleWithCategory = Prisma.ArticleGetPayload<{
    include: { categorie: true };
}>;
```

### Validation double couche

```typescript
// Schéma Zod partagé frontend/backend
const articleSchema = z.object({
    nom: z.string().min(1).max(100),
    prix: z.number().positive(),
    // ...
});

// Validation côté client (React Hook Form)
const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
});

// Validation côté serveur (API Route)
const body = articleSchema.parse(await req.json());
```

### Error Handling centralisé

```typescript
// Utility pour gérer les erreurs Prisma de manière uniforme
export function handlePrismaError(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint violation
        // P2025: Record not found
        // etc.
    }
}
```

### Pagination optimisée

```typescript
// Pagination cursor-based pour performances
const articles = await prisma.article.findMany({
    take: 20,
    skip: page * 20,
    include: { categorie: true },
    orderBy: { createdAt: "desc" },
});
```

## 🎨 Design & UX

-   **Design System** : Shadcn/ui pour cohérence visuelle
-   **Responsive** : Mobile-first avec breakpoints Tailwind
-   **Accessibilité** : Support ARIA, navigation clavier, contraste
-   **Loading States** : Skeletons pour meilleure UX
-   **Error States** : Messages d'erreur clairs et actions correctives
-   **Dark Mode** : Supporté via Tailwind (prêt à activer)

## 🔒 Sécurité

-   ✅ Validation stricte des entrées (Zod)
-   ✅ Protection CSRF native Next.js
-   ✅ Sessions JWT sécurisées (httpOnly cookies)
-   ✅ Hashing bcrypt pour mots de passe
-   ✅ OAuth 2.0 avec Google
-   ✅ Protection des routes API (middleware)
-   ✅ Sanitization des erreurs (pas d'exposition de détails sensibles)

## 📈 Roadmap & Évolutions

### 🎯 En cours de développement (Sprint actuel)

-   🚧 Interface dashboard Clients (liste, création, édition)
-   🚧 Interface dashboard Documents (devis/factures)
-   🚧 Logique de calculs automatiques des documents
-   🚧 API gestion des paiements

### 📋 Prochaines priorités (v1.0)

-   ⏳ Workflow conversion devis → facture
-   ⏳ Génération PDF des documents (@react-pdf/renderer)
-   ⏳ Upload et gestion d'images produits (Cloudinary/AWS S3)
-   ⏳ Numérotation automatique incrémentale
-   ⏳ Export de données (CSV/Excel)
-   ⏳ **Programme de fidélité client**
    -   Système de points basé sur les achats (ex: 1€ = 1 point)
    -   **Gestion des niveaux de fidélité (CRUD admin)**
        -   Création de niveaux personnalisés (ex: Bronze, Argent, Gold, Platine)
        -   Configuration par niveau : seuil de points, % remise, couleur/icône
        -   Avantages et description configurables
        -   Ordre/priorité des niveaux
    -   Attribution automatique du niveau selon les points
    -   Avantages par niveau (remises automatiques, promotions exclusives)
    -   Historique complet des mouvements de points (gain/dépense/expiration)
    -   Expiration automatique des points (durée configurable)
    -   Tableau de bord client : solde points, niveau actuel, prochain niveau
-   ⏳ **Gestion des comptes clients**
    -   Compte débiteur/créditeur par client
    -   Suivi du solde en temps réel
    -   Historique des mouvements (achats, paiements, avoirs)
    -   Alertes pour comptes dépassant un seuil
    -   Rapports d'impayés et relances automatiques

### 🚀 Améliorations futures (v2.0+)

-   **Système de feedback et support utilisateur**
    -   Module de tickets intégré (bugs, demandes de fonctionnalités, questions)
    -   Catégorisation : Bug, Feature Request, Amélioration, Question, Support
    -   Workflow de tickets : Nouveau → En cours → Résolu → Fermé
    -   Niveaux de priorité (Urgent, Haute, Moyenne, Basse)
    -   Assignation aux développeurs/support
    -   Système de commentaires et historique détaillé
    -   Pièces jointes (captures d'écran, logs)
    -   Votes et réactions des utilisateurs pour prioriser
    -   Notifications par email des changements de statut
    -   Base de connaissances (FAQ/Documentation) issue des tickets résolus
    -   Tableau de bord : SLA, temps de résolution moyen, tickets ouverts/fermés
-   **Système de rachat/reprise de produits**
    -   Configuration des articles rachetables avec grilles tarifaires
    -   Workflow de reprise : estimation → inspection → validation → paiement/avoir
    -   Évaluation de l'état du produit (Neuf, Excellent, Bon, Acceptable, Défectueux)
    -   Barème de prix selon l'état et l'ancienneté
    -   Intégration avec gestion des stocks (produits d'occasion)
    -   Génération de bons de reprise et avoirs automatiques
    -   Historique des reprises par client
    -   Photos et descriptions de l'état du produit repris
-   **Tableau de bord analytique**
    -   Statistiques de vente et CA (Chart.js)
    -   Analyse du programme de fidélité (taux participation, points distribués)
    -   Analyse des reprises (volume, marge, rotation stock occasion)
    -   Rapports clients (meilleurs clients, impayés, ancienneté)
    -   KPIs temps réel (stock critique, factures en attente, etc.)
-   **Automatisations & Communications**
    -   Envoi d'emails automatiques (relances, confirmations, promotions)
    -   SMS pour notifications importantes
    -   Webhooks pour intégrations tierces
-   **Module de caisse (POS)**
    -   Interface tactile pour vente en magasin
    -   Application des points fidélité en temps réel
    -   Process de reprise intégré au parcours de vente
    -   Gestion multi-moyens de paiement
    -   Ticket de caisse thermique
-   Gestion multi-entreprise (SaaS multi-tenant)
-   API publique REST avec documentation Swagger/OpenAPI
-   Tests E2E avec Playwright
-   CI/CD avec GitHub Actions
-   Optimisation SEO et performance
-   Mode hors ligne (PWA)

## 🧪 Scripts disponibles

```bash
npm run dev          # Serveur de développement (localhost:3000)
npm run build        # Build de production optimisé
npm start            # Serveur de production
npm run lint         # Analyse ESLint
npx prisma studio    # Interface graphique DB (localhost:5555)
npx prisma generate  # Régénération du client Prisma
```

## 📞 Contact

Ce projet est un **projet portfolio en développement actif** démontrant mes compétences en développement full-stack moderne.

**Développé avec :** Next.js • React • TypeScript • PostgreSQL • Prisma

### 📝 Note pour les recruteurs

Ce projet représente environ **~70% d'avancement** :

-   ✅ L'architecture, l'authentification, et le module Articles sont **entièrement fonctionnels**
-   🚧 Les modules Clients et Documents ont une **API complète** mais leur interface utilisateur est en cours de développement
-   📚 Le code démontre ma capacité à architecturer une application complexe avec des **patterns professionnels** (type safety, error handling, validation, pagination, etc.)

Je continue activement le développement pour atteindre une version 1.0 complète.

---

💼 **Disponible pour opportunités full-stack JavaScript/TypeScript**
