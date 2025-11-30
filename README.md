# MyProPartner

**ERP SaaS multi-tenant pour artisans et PME françaises**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)

---

## Présentation

Application ERP complète conçue pour gérer l'ensemble des besoins opérationnels d'une entreprise : clients, catalogue, stocks, devis, factures, paiements, fidélité, équipe, caisse et modules métier spécialisés.

**Caractéristiques principales :**

- Architecture SaaS multi-tenant avec isolation des données
- 23 types d'activités supportés avec navigation adaptative
- Double authentification (dashboard admin + portail client)
- Intégrations Stripe, OpenAI, Resend
- PWA avec mode offline

---

## Stack technique

| Catégorie | Technologies |
|-----------|-------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Shadcn/ui |
| Backend | Next.js API Routes, Prisma ORM 6, PostgreSQL 16 |
| Auth | NextAuth.js v4 (JWT + OAuth Google) |
| Paiements | Stripe (Subscriptions, Checkout, Terminal) |
| IA | OpenAI GPT-4 |
| Email | Resend + React Email |
| PDF | @react-pdf/renderer |

---

## Fonctionnalités

### Core

| Module | Description |
|--------|-------------|
| **Clients** | CRM complet, segmentation, portail client séparé |
| **Catalogue** | Produits/services, catégories, champs personnalisés |
| **Stocks** | Multi-magasins, transferts, alertes, traçabilité |
| **Documents** | Devis, factures, avoirs avec génération PDF |
| **Paiements** | Multi-méthodes, Stripe, liens de paiement, QR codes |
| **Fidélité** | Points, niveaux, remises automatiques |
| **Équipe** | 6 rôles, 30+ permissions, invitations, time tracking |
| **POS** | Caisse tactile, Stripe Terminal |
| **Analytics** | KPIs, export FEC, réconciliation bancaire |
| **Marketing** | Campagnes email, automatisations, segmentation |
| **Chatbot** | Assistant IA avec GPT-4 |

### Modules métier

| Module | Fonctionnalités |
|--------|----------------|
| **SAV & Réparations** | Diagnostic, devis réparation, interventions, notifications |
| **Atelier** | Démontage, extraction de pièces, ressources |
| **Rachats** | Évaluation, ajout automatique au catalogue |
| **Immobilier Transaction** | Biens, mandats, estimations, visites, diffusion, matching |
| **Gestion Locative** | Baux, loyers, quittances, états des lieux, incidents |
| **Syndic** | Copropriétés, lots, charges, AG, conseil, travaux, comptabilité |

---

## Architecture

```
my-pro-partner/
├── app/
│   ├── (dashboard)/          # Dashboard admin protégé
│   ├── (client-portal)/      # Portail client
│   ├── api/                  # API Routes REST
│   ├── auth/                 # Authentification
│   └── onboarding/           # Wizard inscription
├── components/               # Composants UI par feature
├── hooks/                    # Custom hooks (120+)
├── lib/
│   ├── services/             # Services métier
│   ├── middleware/           # Multi-tenancy, auth
│   ├── navigation/           # Navigation business-adaptive
│   └── types/                # Types TypeScript
└── prisma/                   # Schema (65+ modèles)
```

---

## Installation

```bash
# Cloner et installer
git clone <repository-url>
cd my-pro-partner
npm install

# Configuration
cp .env.example .env.local
# Éditer .env.local avec vos credentials

# Base de données
npx prisma generate
npx prisma db push

# Lancer
npm run dev
```

### Variables d'environnement requises

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_..."
OPENAI_API_KEY="sk-..."
RESEND_API_KEY="re_..."
```

---

## Sécurité

- Validation stricte des entrées (Zod)
- Sessions JWT sécurisées (httpOnly cookies)
- Hashing bcrypt
- Protection CSRF
- Multi-tenancy avec isolation des données
- RBAC avec permissions granulaires
- Rate limiting
- 0 vulnérabilités npm

---

## Pricing

| Plan | Prix | Limites |
|------|------|---------|
| FREE | 0€ | 10 clients, 10 produits, 10 docs/mois |
| STARTER | 39€/mois | 100 clients, 100 produits, illimité |
| PRO | 69€/mois | 1000 clients, analytics avancées, API |
| ENTERPRISE | 179€/mois | Illimité, multi-magasins, support dédié |

---

## Roadmap

**Récemment complété :**
- Modules Immobilier (Transaction, Gestion Locative, Syndic)
- Audit de sécurité complet
- Génération PDF et notifications email

**En cours :**
- Tests E2E (Playwright)
- Documentation API (OpenAPI)
- Optimisations performance

**Prochaines priorités :**
- Upload d'images (S3/Cloudinary)
- Export Excel
- Intégration SMS (Twilio)
- Intégrations comptables

---

## Scripts

```bash
npm run dev        # Développement
npm run build      # Build production
npm run lint       # ESLint
npx prisma studio  # Interface DB
```

---

**Projet portfolio production-ready** démontrant une maîtrise complète de l'écosystème Next.js et des architectures SaaS professionnelles.
