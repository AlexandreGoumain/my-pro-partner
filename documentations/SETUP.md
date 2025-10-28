# ERP Artisan - Guide d'Installation et Configuration

## Prérequis

- Node.js 18+ et npm
- PostgreSQL 12+ ou Docker pour PostgreSQL
- Un éditeur de code (VS Code recommandé)

## Installation locale

### 1. Variables d'environnement

Créez un fichier `.env.local` avec :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/erp_artisan?schema=public"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

**Pour générer une clé secrète sécurisée :**
```bash
openssl rand -base64 32
```

### 2. Configuration PostgreSQL

#### Option A : Installation locale
```bash
# macOS avec Homebrew
brew install postgresql@15
brew services start postgresql@15

# Windows
# Télécharger et installer PostgreSQL depuis https://www.postgresql.org/download/windows/

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

Créez la base de données :
```bash
createdb erp_artisan
```

#### Option B : Docker (Recommandé)
```bash
docker run --name postgres-erp \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=erp_artisan \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Initialisez Prisma et la base de données

```bash
# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Exécuter les migrations (créer les tables)
npx prisma migrate dev --name init

# (Optionnel) Seed la base avec des données de test
npx prisma db seed
```

### 4. Lancez le serveur de développement

```bash
npm run dev
```

L'application sera disponible sur : `http://localhost:3000`

## Pages principales

- **Login** : `http://localhost:3000/auth/login`
- **Register** : `http://localhost:3000/auth/register`
- **Dashboard** : `http://localhost:3000/dashboard` (protégée)

## Structure des dossiers

```
.
├── app/
│   ├── api/                 # API Routes
│   │   ├── auth/           # Authentification NextAuth
│   │   ├── clients/        # CRUD Clients
│   │   ├── articles/       # CRUD Articles
│   │   ├── documents/      # CRUD Documents
│   │   └── categories/     # CRUD Catégories
│   ├── auth/               # Pages authentification
│   └── dashboard/          # Pages protégées
├── lib/
│   ├── prisma.ts          # Client Prisma
│   └── validation.ts      # Schémas Zod
├── prisma/
│   └── schema.prisma      # Schéma BD
└── public/                 # Fichiers statiques
```

## Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Serveur production
npm start

# Vérifier les erreurs TypeScript
npx tsc --noEmit

# Ouvrir Prisma Studio (interface BD graphique)
npx prisma studio

# Réinitialiser la base de données (ATTENTION: supprime les données)
npx prisma migrate reset
```

## Architecture API

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/[...nextauth]` - NextAuth.js (signIn, signOut, etc.)

### Clients
- `GET /api/clients` - Lister tous les clients
- `POST /api/clients` - Créer un client
- `GET /api/clients/[id]` - Détails d'un client
- `PUT /api/clients/[id]` - Mettre à jour un client
- `DELETE /api/clients/[id]` - Supprimer un client

### Articles
- `GET /api/articles` - Lister tous les articles
- `POST /api/articles` - Créer un article
- `GET /api/articles/[id]` - Détails d'un article
- `PUT /api/articles/[id]` - Mettre à jour un article
- `DELETE /api/articles/[id]` - Supprimer un article

### Documents (Devis/Factures)
- `GET /api/documents` - Lister tous les documents
- `POST /api/documents` - Créer un document
- `GET /api/documents/[id]` - Détails d'un document
- `PUT /api/documents/[id]` - Mettre à jour un document
- `DELETE /api/documents/[id]` - Supprimer un document

### Catégories
- `GET /api/categories` - Lister toutes les catégories
- `POST /api/categories` - Créer une catégorie

## Déploiement sur OVH VPS

### 1. Préparation

```bash
# Build production
npm run build

# Créer un fichier .env.production avec les vraies variables
cp .env.local .env.production
```

### 2. Sur le VPS

```bash
# Cloner le projet
git clone <votre-repo> /var/www/erp-artisant
cd /var/www/erp-artisant

# Installer les dépendances
npm install --production

# Générer Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate deploy

# Démarrer avec PM2
pm2 start npm --name "erp" -- start
pm2 save
```

### 3. Configuration Nginx

```nginx
server {
    listen 80;
    server_name erp.monentreprise.fr;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL avec Let's Encrypt

```bash
sudo certbot --nginx -d erp.monentreprise.fr
```

## Données de test

Pour créer un utilisateur de test :

```bash
npm run seed
# ou créer manuellement via /auth/register
```

Email: `test@example.com`
Mot de passe: `password123`

## Troubleshooting

### Erreur de connexion à PostgreSQL
- Vérifier que PostgreSQL est lancé
- Vérifier la DATABASE_URL dans .env.local
- Vérifier les identifiants (user/password)

### Erreur "nextauth secret" non défini
- Générer une clé : `openssl rand -base64 32`
- Ajouter à .env.local : `NEXTAUTH_SECRET=...`

### Prisma not found
```bash
npm install
npx prisma generate
```

### Port 3000 déjà utilisé
```bash
# Lancer sur un autre port
PORT=3001 npm run dev
```

## Support et Documentation

- [NextAuth.js Docs](https://next-auth.js.org)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Version** : 0.1.0
**Date de création** : 2025-10-27
