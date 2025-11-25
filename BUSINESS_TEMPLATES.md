# Business Templates - Architecture & Classification

Ce document décrit l'architecture des templates métier de MyProPartner et comment ils sont organisés.

## Vue d'ensemble

MyProPartner utilise un système de **Catégories → Types → Capabilities** pour adapter l'ERP à chaque métier.

```
Catégorie (ex: INTERVENTION)
    └── Type de business (ex: PLOMBERIE)
            └── Capabilities activées (ex: domicile, contrats, stock_camionnette)
```

---

## Catégories

Les catégories regroupent les métiers par mode de fonctionnement similaire.

| Catégorie | Label | Description | Icône |
|-----------|-------|-------------|-------|
| `INTERVENTION` | Artisanat & Intervention | Activités d'intervention à domicile ou en atelier | Wrench |
| `POINT_DE_VENTE` | Points de Vente | Commerces avec encaissement sur place | Store |
| `RENDEZ_VOUS` | Rendez-vous & Services | Activités sur rendez-vous | Calendar |
| `SERVICE_INTELLECTUEL` | Services Professionnels | Prestations intellectuelles et conseil | Briefcase |
| `COMMERCE` | Commerce | Commerce de détail | ShoppingCart |
| `IMMOBILIER` | Immobilier | Gestion immobilière | Home |
| `GENERAL` | Général | Configuration standard personnalisable | Building2 |

---

## Types de Business par Catégorie

### INTERVENTION (Artisanat)

| Type | Label | Description | Couleur |
|------|-------|-------------|---------|
| `PLOMBERIE` | Plomberie | Plomberie, chauffagiste, sanitaire | #3B82F6 |
| `ELECTRICITE` | Électricité | Électricien, domotique, alarmes | #F59E0B |
| `CHAUFFAGE` | Chauffage | Chauffagiste, climatisation, pompes à chaleur | #EF4444 |
| `MENUISERIE` | Menuiserie | Menuisier, ébéniste, charpentier | #92400E |
| `PEINTURE` | Peinture | Peintre, décorateur, ravalement | #8B5CF6 |
| `MACONNERIE` | Maçonnerie | Maçon, gros œuvre, terrassement | #6B7280 |
| `GARAGE` | Garage Auto | Réparation automobile, entretien véhicules | #1F2937 |
| `INFORMATIQUE` | Informatique | Boutique informatique, réparation PC/Mac | #06B6D4 |

### POINT_DE_VENTE

| Type | Label | Description | Couleur |
|------|-------|-------------|---------|
| `RESTAURATION` | Restauration | Restaurant, brasserie, café | #DC2626 |
| `BOULANGERIE` | Boulangerie | Boulangerie, pâtisserie, traiteur | #D97706 |

### RENDEZ_VOUS

| Type | Label | Description | Couleur |
|------|-------|-------------|---------|
| `COIFFURE` | Coiffure | Salon de coiffure, barbier | #EC4899 |
| `ESTHETIQUE` | Esthétique | Institut de beauté, spa, onglerie | #F472B6 |
| `FITNESS` | Fitness | Coach sportif, salle de sport, yoga | #10B981 |
| `SANTE` | Santé | Praticien de santé, kinésithérapeute, ostéopathe | #EF4444 |

### SERVICE_INTELLECTUEL

| Type | Label | Description | Couleur |
|------|-------|-------------|---------|
| `CONSULTING` | Consulting | Consultant, conseil aux entreprises | #6366F1 |
| `COMPTABILITE` | Comptabilité | Expert-comptable, gestion | #059669 |
| `JURIDIQUE` | Juridique | Avocat, juriste, notaire | #7C3AED |

### COMMERCE

| Type | Label | Description | Couleur |
|------|-------|-------------|---------|
| `COMMERCE_DETAIL` | Commerce de détail | Boutique, magasin, e-commerce | #F97316 |

### IMMOBILIER

| Type | Label | Description | Couleur |
|------|-------|-------------|---------|
| `IMMOBILIER` | Immobilier | Agent immobilier, gestion locative | #0EA5E9 |

### GENERAL

| Type | Label | Description | Couleur |
|------|-------|-------------|---------|
| `GENERAL` | Général | Configuration standard personnalisable | #64748B |

---

## Capabilities (Fonctionnalités)

Les capabilities sont des modules activables selon le type de business.

### Capabilities de base (tous les business)

| Capability | Label | Description |
|------------|-------|-------------|
| `clients` | Gestion clients | CRM, fiches clients, historique |
| `documents` | Devis & Factures | Création de devis, factures, avoirs |
| `analytics` | Statistiques | Tableaux de bord et rapports |
| `fidelite` | Programme fidélité | Points, récompenses clients |

### Capabilities INTERVENTION

| Capability | Label | Description |
|------------|-------|-------------|
| `domicile` | Interventions à domicile | Déplacements chez le client |
| `atelier` | Réparations en atelier | Travaux en boutique/atelier |
| `suivi_bien` | Suivi de biens clients | Véhicules, PC, équipements |
| `urgence` | Gestion des urgences | Astreintes, priorités |
| `contrats` | Contrats de maintenance | Abonnements, entretiens récurrents |
| `garanties` | Suivi des garanties | Garanties pièces et main d'œuvre |
| `stock_camionnette` | Stock mobile/camionnette | Inventaire véhicules techniciens |

### Capabilities POINT_DE_VENTE

| Capability | Label | Description |
|------------|-------|-------------|
| `pos` | Caisse / POS | Point de vente, encaissement |
| `tables` | Gestion des tables | Plan de salle, réservations |
| `tickets` | Tickets rapides | Impression reçus |
| `commandes_rapides` | Commandes rapides | Mode service rapide |

### Capabilities RENDEZ_VOUS

| Capability | Label | Description |
|------------|-------|-------------|
| `agenda` | Agenda / Planning | Calendrier rendez-vous |
| `creneaux` | Créneaux horaires | Plages de disponibilité |
| `rappels_sms` | Rappels SMS | Notifications automatiques |
| `recurrence` | RDV récurrents | Rendez-vous périodiques |

### Capabilities SERVICE_INTELLECTUEL

| Capability | Label | Description |
|------------|-------|-------------|
| `temps_passe` | Suivi du temps | Timesheet, heures facturables |
| `projets` | Gestion de projets | Dossiers, missions |
| `facturation_horaire` | Facturation horaire | Taux horaire, temps × tarif |

### Capabilities COMMERCE

| Capability | Label | Description |
|------------|-------|-------------|
| `catalogue` | Catalogue produits | Fiches produits, références |
| `stock` | Gestion des stocks | Inventaire, mouvements |
| `ventes` | Suivi des ventes | Historique transactions |

### Capabilities IMMOBILIER

| Capability | Label | Description |
|------------|-------|-------------|
| `mandats` | Gestion des mandats | Contrats agence |
| `biens` | Gestion des biens | Propriétés, lots |
| `visites` | Planification visites | RDV visites immobilières |

---

## État d'implémentation des Templates

### Implémentation complète

| Template | Pages | APIs | Modèles DB | Status |
|----------|-------|------|------------|--------|
| **PLOMBERIE** | interventions, planning, contrats, flotte, stock-camionnette | Toutes | Intervention, Camionnette, ContratEntretien, etc. | **Production ready** |
| **INFORMATIQUE** | réparations, rachats, démontages | Toutes | Reparation, Rachat, Demontage | **Production ready** |

### Implémentation de base (fonctionnel)

| Template | Status | Notes |
|----------|--------|-------|
| ELECTRICITE | Utilise le modèle INTERVENTION | Même structure que plomberie |
| CHAUFFAGE | Utilise le modèle INTERVENTION | Même structure que plomberie |
| MENUISERIE | Utilise le modèle INTERVENTION | Même structure que plomberie |
| PEINTURE | Utilise le modèle INTERVENTION | Même structure que plomberie |
| MACONNERIE | Utilise le modèle INTERVENTION | Même structure que plomberie |
| GARAGE | Utilise le modèle INTERVENTION | Spécialisation possible |

### En développement

| Template | Status | Notes |
|----------|--------|-------|
| RESTAURATION | Base POS disponible | Tables en cours |
| BOULANGERIE | Base POS disponible | - |
| COIFFURE | Base agenda disponible | - |
| ESTHETIQUE | Base agenda disponible | - |

### Planifié

| Template | Status |
|----------|--------|
| FITNESS | Prévu |
| SANTE | Prévu |
| CONSULTING | Prévu |
| COMPTABILITE | Prévu |
| JURIDIQUE | Prévu |
| COMMERCE_DETAIL | Prévu |
| IMMOBILIER | Prévu |

---

## Architecture technique

### Fichiers de configuration

```
lib/
├── config/
│   └── business-hierarchy.config.ts    # Configuration catégories & types
├── types/
│   ├── business.ts                     # Type BusinessType
│   ├── business-category.ts            # Type BusinessCategory
│   ├── business-hierarchy.ts           # Interfaces & mappings
│   └── capability.ts                   # Capabilities & labels
```

### Schéma Prisma

Les modèles spécifiques aux templates sont dans `prisma/schema.prisma` :

- **Intervention** : Modèle de base pour tous les métiers d'intervention
- **ContratEntretien** : Contrats de maintenance
- **Camionnette** : Gestion de flotte
- **StockCamionnette** : Stock mobile
- **Reparation** : SAV informatique
- **Rachat** / **Demontage** : Occasion informatique

### Hooks React

```
hooks/
├── use-interventions.ts      # CRUD interventions
├── use-contrats.ts           # CRUD contrats entretien
├── use-flotte.ts             # Gestion camionnettes
├── use-entretiens-vehicules.ts
└── use-reparations.ts        # SAV informatique
```

---

## Ajouter un nouveau template

1. **Ajouter le type** dans `lib/types/business.ts`
2. **Configurer les capabilities** dans `lib/types/business-hierarchy.ts`
3. **Ajouter la config UI** dans `lib/config/business-hierarchy.config.ts`
4. **Créer les modèles Prisma** si nécessaire
5. **Créer les APIs** dans `app/api/`
6. **Créer les hooks** dans `hooks/`
7. **Créer les pages** dans `app/(dashboard)/dashboard/`

---

## Ressources

- Configuration : `lib/config/business-hierarchy.config.ts`
- Types : `lib/types/business*.ts`
- Capabilities : `lib/types/capability.ts`
