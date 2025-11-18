# Unified Stats System

Système de statistiques unifié suivant les principes de design Apple (sobre, épuré, élégant).

## Composants

### StatCard

Carte de statistique flexible avec plusieurs variantes.

```tsx
import { StatCard } from "@/components/ui/stats";
import { Users } from "lucide-react";

<StatCard
  label="Total clients"
  value={1234}
  icon={Users}
  change={12.5}
  subtitle="vs mois dernier"
/>
```

#### Props

- `label`: Libellé de la stat
- `value`: Valeur (nombre ou string)
- `icon`: Icône Lucide (optionnel)
- `variant`: `"default" | "compact" | "large"` (défaut: "default")
- `change`: Pourcentage de changement (optionnel)
- `subtitle`: Sous-titre (optionnel)
- `iconPosition`: `"left" | "right" | "top"` (défaut: "right")
- `clickable`: Rend la carte cliquable
- `onClick`: Fonction de clic
- `active`: État actif (bordure accentuée)

#### Variantes

**Default**: Layout flexible avec icône à droite ou à gauche
```tsx
<StatCard
  label="CA mensuel"
  value="45 678 €"
  icon={TrendingUp}
  change={8.2}
/>
```

**Compact**: Layout horizontal avec icône à gauche
```tsx
<StatCard
  variant="compact"
  label="Commandes"
  value={89}
  icon={ShoppingCart}
  change={-2.1}
/>
```

**Large**: Style analytics avec grande valeur
```tsx
<StatCard
  variant="large"
  label="Chiffre d'affaires"
  value="125 450 €"
  icon={Euro}
  subtitle="30 derniers jours"
/>
```

### StatsGrid

Grille responsive pour afficher plusieurs stats.

```tsx
import { StatsGrid } from "@/components/ui/stats";
import { Users, TrendingUp, ShoppingCart, Target } from "lucide-react";

<StatsGrid
  columns={4}
  gap="md"
  stats={[
    {
      label: "Total clients",
      value: 1234,
      icon: Users,
      change: 5.2,
    },
    {
      label: "CA mensuel",
      value: "45 678 €",
      icon: TrendingUp,
      change: 12.5,
    },
    {
      label: "Commandes",
      value: 89,
      icon: ShoppingCart,
      change: -2.1,
    },
    {
      label: "Taux conversion",
      value: "3.2%",
      icon: Target,
    },
  ]}
/>
```

#### Props

- `stats`: Array de StatCardProps
- `columns`: `2 | 3 | 4` (défaut: 4)
- `gap`: `"sm" | "md" | "lg"` (défaut: "md")

### StatsSection

Section avec titre et grille de stats.

```tsx
import { StatsSection } from "@/components/ui/stats";

<StatsSection
  title="Vue d'ensemble"
  description="Statistiques clés de votre activité"
  columns={3}
  stats={[...]}
/>
```

## Utilitaires

### formatStatValue

Formate une valeur selon un type.

```tsx
import { formatStatValue } from "@/components/ui/stats";

formatStatValue(45678.50, "currency")           // "45 678,50 €"
formatStatValue(1234, "number")                 // "1 234"
formatStatValue(3.2, "percent")                 // "3.2%"
formatStatValue(42, "custom", { suffix: " kg" }) // "42 kg"
```

### createStatConfig

Créer rapidement une config de stat avec formatage.

```tsx
import { createStatConfig } from "@/components/ui/stats";
import { TrendingUp, Users } from "lucide-react";

const stats = [
  createStatConfig("Chiffre d'affaires", 45678.50, "currency", TrendingUp, {
    change: 12.5,
    subtitle: "vs mois dernier"
  }),
  createStatConfig("Total clients", 1234, "number", Users),
  createStatConfig("Taux conversion", 3.2, "percent"),
];
```

### calculateChange

Calculer le pourcentage de changement.

```tsx
import { calculateChange } from "@/components/ui/stats";

const change = calculateChange(150, 100); // 50
const change = calculateChange(75, 100);  // -25
```

### formatCompactNumber

Formater les grands nombres avec K, M, B.

```tsx
import { formatCompactNumber } from "@/components/ui/stats";

formatCompactNumber(1234)      // "1.2K"
formatCompactNumber(1234567)   // "1.2M"
formatCompactNumber(1234567890) // "1.2B"
```

### Presets

Configs pré-configurées pour les stats courantes.

```tsx
import { statPresets } from "@/components/ui/stats";

const stats = [
  statPresets.revenue(45678.50, 12.5, "vs mois dernier"),
  statPresets.count("Clients", 1234, Users, 5.2),
  statPresets.percentage("Taux de conversion", 3.2, Target),
  statPresets.average("Panier moyen", 156.50),
];
```

## Exemples d'Utilisation

### Dashboard Simple

```tsx
import { StatsGrid, createStatConfig } from "@/components/ui/stats";
import { Users, Euro, ShoppingCart, TrendingUp } from "lucide-react";

export function Dashboard() {
  const stats = [
    createStatConfig("Total clients", 1234, "number", Users, { change: 5.2 }),
    createStatConfig("CA total", 125450.50, "currency", Euro, { change: 12.5 }),
    createStatConfig("Commandes", 89, "number", ShoppingCart, { change: -2.1 }),
    createStatConfig("Conversion", 3.2, "percent", TrendingUp),
  ];

  return <StatsGrid columns={4} stats={stats} />;
}
```

### Stats avec Filtrage Interactif

```tsx
import { StatCard } from "@/components/ui/stats";
import { Package, Box } from "lucide-react";

export function ProductStats() {
  const [typeFilter, setTypeFilter] = useState<"ALL" | "PRODUCT" | "SERVICE">("ALL");

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        label="Tous"
        value={totalArticles}
        icon={Package}
        clickable
        active={typeFilter === "ALL"}
        onClick={() => setTypeFilter("ALL")}
      />
      <StatCard
        label="Produits"
        value={totalProducts}
        icon={Box}
        clickable
        active={typeFilter === "PRODUCT"}
        onClick={() => setTypeFilter("PRODUCT")}
      />
      <StatCard
        label="Services"
        value={totalServices}
        icon={Wrench}
        clickable
        active={typeFilter === "SERVICE"}
        onClick={() => setTypeFilter("SERVICE")}
      />
    </div>
  );
}
```

### Analytics avec Comparaison de Périodes

```tsx
import { StatsSection, calculateChange } from "@/components/ui/stats";
import { useDatePeriods } from "@/hooks/use-date-periods";

export function AnalyticsDashboard() {
  const { currentPeriod, previousPeriod } = useDatePeriods("30d");

  const stats = [
    {
      label: "Chiffre d'affaires",
      value: formatCurrency(currentRevenue),
      variant: "large" as const,
      change: calculateChange(currentRevenue, previousRevenue),
      subtitle: "30 derniers jours",
    },
    // ... autres stats
  ];

  return (
    <StatsSection
      title="Performance"
      description="Analyse de vos performances sur 30 jours"
      stats={stats}
      columns={4}
    />
  );
}
```

## Migration depuis les anciens composants

### AnalyticsKPICard → StatCard (variant="large")

```tsx
// Avant
<AnalyticsKPICard
  title="Chiffre d'affaires"
  value="45 678 €"
  subtitle="vs mois dernier"
  icon={Euro}
/>

// Après
<StatCard
  variant="large"
  label="Chiffre d'affaires"
  value="45 678 €"
  subtitle="vs mois dernier"
  icon={Euro}
/>
```

### StatCard (ancien) → StatCard (variant="compact")

```tsx
// Avant
<StatCard
  icon={Users}
  label="Total clients"
  value={1234}
/>

// Après
<StatCard
  variant="compact"
  icon={Users}
  label="Total clients"
  value={1234}
/>
```

### ArticleStatsCard → StatCard

```tsx
// Avant
<ArticleStatsCard
  label="Produits"
  value={42}
  icon={Package}
  percentage={65}
  isActive={true}
  isClickable={true}
  onClick={handleClick}
/>

// Après
<StatCard
  label="Produits"
  value={42}
  icon={Package}
  change={65}  // Note: devient un % de changement
  active={true}
  clickable={true}
  onClick={handleClick}
/>
```

## Principes de Design

✅ **À faire**:
- Utiliser des nuances de gris (bg-black/5, text-black/60, etc.)
- Bordures subtiles (border-black/8)
- Ombres légères (shadow-sm)
- Typographie précise (text-[14px], tracking-[-0.01em])

❌ **À éviter**:
- Couleurs vives (bleu, vert, rouge sauf statut critique)
- Gradients
- Ombres prononcées
- Animations tape-à-l'œil
