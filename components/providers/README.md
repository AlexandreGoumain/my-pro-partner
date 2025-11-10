# Providers - Architecture Globale

## LimitDialogProvider

Provider global qui gère le dialog de limite atteinte pour toute l'application.

### Architecture

```
app/(dashboard)/dashboard/layout.tsx
  └─ <LimitDialogProvider>  ← Dialog géré globalement ici
       └─ Toutes les pages enfants
            └─ useLimitDialog() ← Accessible partout
```

**Avantages :**
- ✅ Dialog appelé **une seule fois** au niveau du layout
- ✅ Accessible partout via `useLimitDialog()`
- ✅ Pas besoin de passer `<LimitReachedDialog />` dans chaque page
- ✅ State global partagé

### Utilisation

#### 1. Dans une page (simple)

```tsx
import { useLimitDialog } from "@/components/providers";

function ClientsPage() {
  const { checkLimit, userPlan } = useLimitDialog();
  const clientsCount = 10;

  function handleCreateClient() {
    // Vérifie ET affiche le dialog automatiquement si limite atteinte
    if (!checkLimit("maxClients", clientsCount)) {
      return; // Bloqué
    }

    // Créer le client...
  }

  return (
    <div>
      <Button onClick={handleCreateClient}>Créer un client</Button>
      {/* Pas besoin de <LimitReachedDialog /> ici ! */}
    </div>
  );
}
```

#### 2. Avec indicateur de progression

```tsx
import { useLimitDialog } from "@/components/providers";
import { LimitIndicator } from "@/components/paywall";
import { Card, CardContent } from "@/components/ui/card";

function ClientsPage() {
  const { checkLimit, userPlan } = useLimitDialog();
  const clientsCount = 8;

  return (
    <div>
      {/* Afficher la progression */}
      <Card>
        <CardContent>
          <LimitIndicator
            userPlan={userPlan}
            limitKey="maxClients"
            currentValue={clientsCount}
            label="Clients"
            showProgress
            showUpgradeLink
          />
        </CardContent>
      </Card>

      {/* Bouton avec vérification */}
      <Button onClick={() => {
        if (!checkLimit("maxClients", clientsCount)) return;
        handleCreate();
      }}>
        Créer un client
      </Button>
    </div>
  );
}
```

#### 3. Features booléennes (ON/OFF)

```tsx
import { useLimitDialog } from "@/components/providers";

function AnalyticsPage() {
  const { checkFeature } = useLimitDialog();

  function handleAdvancedAnalytics() {
    // Vérifie si la feature est disponible
    if (!checkFeature("hasAdvancedAnalytics")) {
      return; // Dialog s'affiche automatiquement
    }

    router.push("/analytics/advanced");
  }

  return (
    <Button onClick={handleAdvancedAnalytics}>
      Analytics avancées
    </Button>
  );
}
```

#### 4. Bloquer une page entière avec PlanGate

```tsx
import { PlanGate } from "@/components/paywall";
import { useLimitDialog } from "@/components/providers";

function SegmentationPage() {
  const { userPlan } = useLimitDialog();

  return (
    <PlanGate
      userPlan={userPlan}
      feature="canSegmentClients"
      upgradeMessage="La segmentation nécessite le plan Pro."
    >
      <div>
        {/* Contenu de la page */}
      </div>
    </PlanGate>
  );
}
```

### API du hook `useLimitDialog()`

```tsx
const {
  checkLimit,      // (limitKey, currentValue) => boolean
  checkFeature,    // (feature) => boolean
  showDialog,      // (limitKey) => void - Afficher manuellement
  closeDialog,     // () => void - Fermer
  userPlan         // "FREE" | "STARTER" | "PRO" | "ENTERPRISE"
} = useLimitDialog();
```

### Composants complémentaires

- **`LimitIndicator`** : Barre de progression "X/Y" avec alerte
- **`PlanGate`** : Bloquer une section/page entière
- **`FeatureBadge`** : Badge "PRO" à côté des features
- **`UpgradeCard`** : Carte d'upgrade

Tous disponibles via `import { ... } from "@/components/paywall"`

## Différences avec l'ancienne version

**Avant (❌ ancien système) :**
```tsx
// Dans CHAQUE page
const { checkLimit, dialogProps } = useLimitDialog(userPlan);
// ...
<LimitReachedDialog {...dialogProps} /> // Répété partout
```

**Maintenant (✅ nouveau système) :**
```tsx
// Dans UNE SEULE page (layout)
<LimitDialogProvider>
  {children}
</LimitDialogProvider>

// Dans toutes les pages enfants
const { checkLimit } = useLimitDialog(); // Pas besoin du dialog !
```

**Bénéfices :**
- 🚀 Moins de code répétitif
- 🎯 Centralisé et maintenable
- 🧹 Composant dialog appelé 1x au lieu de 15x
- 💪 State global partagé
