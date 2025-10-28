# MyProPartner - ERP pour Artisans

Application ERP moderne et intuitive dédiée aux artisans et petites entreprises, développée avec les dernières technologies web.

## 🚀 Technologies

-   **Frontend**: Next.js 16 (App Router), React 19, TypeScript
-   **UI**: Shadcn/ui, Tailwind CSS v4
-   **Backend**: Next.js API Routes
-   **Database**: PostgreSQL avec Prisma ORM
-   **Authentication**: NextAuth.js v4 (JWT + OAuth Google)
-   **Validation**: Zod + React Hook Form

## ✨ Fonctionnalités

### Gestion des Clients

-   CRUD complet avec recherche et filtres
-   Validation des données en temps réel
-   Interface responsive

### Catalogue d'Articles

-   Vue grille et liste avec tri/filtrage
-   Gestion des stocks avec alertes
-   Catégorisation hiérarchique
-   Pagination optimisée

### Documents Commerciaux

-   Création de devis, factures et avoirs
-   Conversion devis → facture
-   Suivi des paiements
-   Calculs automatiques (HT, TVA, TTC)

### Système d'Authentification

-   Inscription/connexion sécurisée
-   OAuth Google
-   Sessions JWT
-   Protection des routes

## 📦 Installation

### Prérequis

-   Node.js 18+
-   PostgreSQL
-   npm ou yarn

### Configuration

1. Cloner le projet

```bash
git clone <repository-url>
cd my-pro-partner
```

2. Installer les dépendances

```bash
npm install
```

3. Configuration de l'environnement

Créer un fichier `.env.local` à la racine :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/erp_artisan"
NEXTAUTH_SECRET="votre-secret-genere"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"
```

4. Initialiser la base de données

```bash
npx prisma generate
npx prisma migrate dev
```

5. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Structure du Projet

```
├── app/
│   ├── (dashboard)/           # Routes protégées
│   │   └── dashboard/         # Pages principales
│   ├── api/                   # API Routes
│   │   ├── auth/              # Authentication
│   │   ├── articles/          # Articles CRUD
│   │   ├── clients/           # Clients CRUD
│   │   └── documents/         # Documents CRUD
│   └── auth/                  # Pages d'authentification
├── components/
│   ├── ui/                    # Shadcn components
│   ├── skeletons/             # Loading states
│   └── providers/             # Context providers
├── lib/
│   ├── constants/             # Configurations statiques
│   ├── errors/                # Gestion d'erreurs
│   ├── types/                 # Types TypeScript
│   ├── utils/                 # Utilitaires
│   └── validation.ts          # Schémas Zod
└── prisma/
    └── schema.prisma          # Modèle de données
```

### Patterns & Best Practices

-   **Type Safety**: TypeScript strict avec types étendus NextAuth
-   **Error Handling**: Utility centralisée pour erreurs Prisma
-   **Validation**: Double validation (frontend + backend)
-   **Pagination**: API paginée par défaut (20 items/page)
-   **DRY**: Constantes et utilitaires réutilisables
-   **Security**: Authentication sur toutes les routes API

## 🔐 Sécurité

-   Validation stricte des entrées (Zod)
-   Protection CSRF
-   Sessions JWT sécurisées
-   Gestion des erreurs sans exposition d'informations sensibles
-   Rate limiting (recommandé en production)

## 📊 Base de Données

Schéma Prisma avec :

-   **User**: Gestion des utilisateurs et rôles
-   **Client**: Informations clients
-   **Article**: Catalogue produits/services
-   **Categorie**: Catégorisation hiérarchique
-   **Document**: Devis/Factures/Avoirs
-   **LigneDocument**: Lignes de documents
-   **Paiement**: Suivi des paiements
-   **ParametresEntreprise**: Configuration entreprise

## 🎨 Design System

-   **Theme**: Design professionnel monochrome
-   **Components**: Shadcn/ui pour consistance
-   **Responsive**: Mobile-first approach
-   **Accessibility**: Support ARIA et keyboard navigation
-   **Dark Mode**: Supporté (via Tailwind)

## 🚦 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm start            # Serveur de production
npm run lint         # Linter ESLint
npx prisma studio    # Interface de gestion DB
npx prisma generate  # Génération client Prisma
```

## 📚 Ressources Utiles

### Gestion Base de Données

```bash
# Créer une migration après modification du schema
npx prisma migrate dev --name nom_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Visualiser et éditer les données (ouvre une interface web)
npx prisma studio
```

### Structure des Routes API

Toutes les routes API suivent le pattern REST standard :
- `GET /api/[resource]` - Liste des ressources (avec pagination)
- `POST /api/[resource]` - Créer une ressource
- `GET /api/[resource]/[id]` - Récupérer une ressource
- `PUT /api/[resource]/[id]` - Mettre à jour une ressource
- `DELETE /api/[resource]/[id]` - Supprimer une ressource

### Authentification

L'authentification utilise NextAuth.js v4 avec :
- Sessions JWT (pas de sessions en BDD)
- Support OAuth Google
- Middleware de protection des routes
- Types TypeScript étendus pour User et Session

## 📝 License

Projet de démonstration - Tous droits réservés

---

Développé avec ❤️ pour démontrer mes compétences en développement Full-Stack
