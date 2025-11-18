# Guide du Système de Permissions

Guide complet pour utiliser le système de permissions dans l'application ERP.

## Vue d'Ensemble

Le système de permissions permet de contrôler l'accès aux différentes opérations de l'application en fonction du rôle et des permissions de chaque utilisateur.

## Architecture

```
┌─────────────────┐
│   API Route     │
│  (Next.js)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Permission     │
│  Middleware     │
│                 │
│ - requirePerm   │
│ - withPerm      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Personnel      │
│  Service        │
│                 │
│ userHasPermission│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Prisma DB      │
│ UserPermissions │
└─────────────────┘
```

## Permissions Disponibles

```typescript
type PermissionName =
  | "canViewUsers"       // Voir les utilisateurs
  | "canManageUsers"     // Gérer les utilisateurs (CRUD)
  | "canViewReports"     // Voir les rapports
  | "canManageInventory" // Gérer l'inventaire
  | "canManageFinance"   // Gérer les finances
  | "canManageSettings"  // Gérer les paramètres
  | "canDeleteData"      // Supprimer des données
  | "canExportData"      // Exporter des données
  | "canManageRoles";    // Gérer les rôles
```

## Utilisation

### 1. Avec CRUD Factory (Recommandé)

La manière la plus simple d'ajouter des permissions est via la configuration du CRUD factory :

```typescript
// app/api/users/route.ts
import { createCrudRoutes } from "@/lib/api/crud-factory";
import { userCreateSchema, userUpdateSchema } from "@/lib/validation";

export const { GET, POST } = createCrudRoutes({
  modelName: "user",
  resourceName: "User",
  createSchema: userCreateSchema,
  updateSchema: userUpdateSchema,
  searchFields: ["name", "email"],

  // 🔐 Configuration des permissions
  permissions: {
    list: "canViewUsers",      // GET /api/users
    create: "canManageUsers",   // POST /api/users
  },
});
```

```typescript
// app/api/users/[id]/route.ts
import { createResourceByIdRoutes } from "@/lib/api/crud-factory";
import { userUpdateSchema } from "@/lib/validation";

export const { GET, PUT, DELETE } = createResourceByIdRoutes({
  modelName: "user",
  resourceName: "User",
  updateSchema: userUpdateSchema,

  // 🔐 Configuration des permissions
  permissions: {
    read: "canViewUsers",       // GET /api/users/[id]
    update: "canManageUsers",   // PUT /api/users/[id]
    delete: "canManageUsers",   // DELETE /api/users/[id]
  },
});
```

### 2. Avec Middleware Direct

Pour les routes personnalisées qui n'utilisent pas le CRUD factory :

#### Option A : `requirePermission()`

```typescript
// app/api/custom-operation/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/middleware/permissions";
import { requireTenantAuth } from "@/lib/middleware/tenant-isolation";

export async function POST(req: NextRequest) {
  try {
    // Authentification
    const { entrepriseId } = await requireTenantAuth();

    // 🔐 Vérification de permission
    await requirePermission(req, "canManageInventory");

    // Logique métier (uniquement si permission OK)
    const result = await performCustomOperation();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    // Les erreurs de permission sont gérées automatiquement
    if (error instanceof ForbiddenError) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }
    throw error;
  }
}
```

#### Option B : `withPermission()` Wrapper

```typescript
// app/api/reports/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/middleware/permissions";

// 🔐 Wrapper qui vérifie la permission automatiquement
export const GET = withPermission("canExportData", async (req: NextRequest) => {
  // Cette fonction ne s'exécute que si l'utilisateur a la permission
  const data = await generateReport();
  return NextResponse.json(data);
});
```

### 3. Permissions Multiples

#### Toutes les permissions requises (AND)

```typescript
import { requireAllPermissions } from "@/lib/middleware/permissions";

export async function POST(req: NextRequest) {
  await requireAllPermissions(req, [
    "canManageUsers",
    "canManageRoles"
  ]);

  // L'utilisateur doit avoir LES DEUX permissions
  // ...
}
```

#### Au moins une permission requise (OR)

```typescript
import { requireAnyPermission } from "@/lib/middleware/permissions";

export async function GET(req: NextRequest) {
  await requireAnyPermission(req, [
    "canViewReports",
    "canManageFinance"
  ]);

  // L'utilisateur doit avoir AU MOINS UNE des permissions
  // ...
}
```

### 4. Vérification Conditionnelle

```typescript
import { getUserPermissions } from "@/lib/middleware/permissions";

export async function GET(req: NextRequest) {
  const permissions = await getUserPermissions(req);

  if (permissions.canViewReports) {
    // Afficher les rapports détaillés
    return getDetailedReports();
  } else {
    // Afficher les rapports basiques uniquement
    return getBasicReports();
  }
}
```

## Exemples Complets

### Exemple 1 : API Personnel (Utilisateurs)

```typescript
// app/api/personnel/route.ts
import { createCrudRoutes } from "@/lib/api/crud-factory";
import { createUserSchema, updateUserSchema } from "@/lib/validation";
import { canAddUser, createUser } from "@/lib/personnel/personnel.service";

export const { GET, POST } = createCrudRoutes({
  modelName: "user",
  resourceName: "User",
  createSchema: createUserSchema,
  updateSchema: updateUserSchema,
  searchFields: ["name", "prenom", "email"],

  // 🔐 Permissions
  permissions: {
    list: "canViewUsers",      // Voir la liste du personnel
    create: "canManageUsers",   // Créer un nouvel employé
  },

  // Custom logic pour la création
  beforeCreate: async (data, entrepriseId) => {
    // Vérifier la limite du plan
    const canAdd = await canAddUser(entrepriseId);
    if (!canAdd) {
      throw new Error("Limite d'utilisateurs atteinte pour votre plan");
    }

    // Créer l'utilisateur avec invitation
    const user = await createUser(entrepriseId, data, data.userId);
    return user;
  },
});
```

### Exemple 2 : Export de Données

```typescript
// app/api/export/clients/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/middleware/permissions";
import { requireTenantAuth } from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";

export const GET = withPermission("canExportData", async (req: NextRequest) => {
  const { entrepriseId } = await requireTenantAuth();

  // Récupérer tous les clients
  const clients = await prisma.client.findMany({
    where: { entrepriseId },
  });

  // Générer CSV
  const csv = generateCSV(clients);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=clients.csv",
    },
  });
});
```

### Exemple 3 : Suppression avec Confirmation

```typescript
// app/api/data/purge/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAllPermissions } from "@/lib/middleware/permissions";
import { requireTenantAuth } from "@/lib/middleware/tenant-isolation";

export async function DELETE(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    // 🔐 Nécessite TOUTES ces permissions
    await requireAllPermissions(req, [
      "canDeleteData",
      "canManageSettings"
    ]);

    // Double vérification via le body
    const { confirmation } = await req.json();
    if (confirmation !== "DELETE_ALL_DATA") {
      return NextResponse.json(
        { error: "Confirmation requise" },
        { status: 400 }
      );
    }

    // Purger les données
    await purgeAllData(entrepriseId);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }
    throw error;
  }
}
```

## Gestion des Erreurs

Le système de permissions génère automatiquement des erreurs `ForbiddenError` avec des messages clairs :

```typescript
// Erreur générée automatiquement
{
  "error": "Permission requise : canManageUsers. Vous n'avez pas les droits nécessaires pour effectuer cette action.",
  "status": 403
}
```

Pour personnaliser les messages :

```typescript
try {
  await requirePermission(req, "canManageUsers");
} catch (error) {
  if (error instanceof ForbiddenError) {
    return NextResponse.json(
      {
        error: "Accès refusé",
        message: "Seuls les administrateurs peuvent effectuer cette action",
        requiredPermission: "canManageUsers"
      },
      { status: 403 }
    );
  }
  throw error;
}
```

## Tests

### Tester les Permissions

```typescript
// __tests__/api/personnel.test.ts
import { GET } from "@/app/api/personnel/route";

describe("Personnel API", () => {
  it("should deny access without canViewUsers permission", async () => {
    // Mock user without permission
    mockUser({ permissions: { canViewUsers: false } });

    const req = createMockRequest();
    const response = await GET(req);

    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({
      error: expect.stringContaining("canViewUsers")
    });
  });

  it("should allow access with canViewUsers permission", async () => {
    // Mock user with permission
    mockUser({ permissions: { canViewUsers: true } });

    const req = createMockRequest();
    const response = await GET(req);

    expect(response.status).toBe(200);
  });
});
```

## Best Practices

### ✅ À Faire

1. **Toujours utiliser CRUD factory quand possible** - Moins de code, plus maintenable
2. **Permissions granulaires** - Séparer read/create/update/delete
3. **Messages d'erreur clairs** - Indiquer quelle permission manque
4. **Vérifier tôt** - Permissions en début de fonction
5. **Documenter** - Commenter les permissions requises

```typescript
/**
 * Export all clients to CSV
 * @requires canExportData permission
 */
export const GET = withPermission("canExportData", async (req) => {
  // ...
});
```

### ❌ À Éviter

1. **Ne pas hardcoder les rôles** - Utiliser les permissions, pas les rôles
```typescript
// ❌ Mauvais
if (user.role === "ADMIN") { ... }

// ✅ Bon
await requirePermission(req, "canManageUsers");
```

2. **Ne pas dupliquer les vérifications**
```typescript
// ❌ Mauvais (déjà vérifié par CRUD factory)
export const { GET } = createCrudRoutes({
  permissions: { list: "canViewUsers" },
  beforeList: async () => {
    await requirePermission(req, "canViewUsers"); // Redondant !
  }
});

// ✅ Bon
export const { GET } = createCrudRoutes({
  permissions: { list: "canViewUsers" },
});
```

3. **Ne pas oublier les permissions sur toutes les routes**
```typescript
// ❌ Mauvais
export const { GET, POST } = createCrudRoutes({
  // Aucune permission ! N'importe qui peut accéder
});

// ✅ Bon
export const { GET, POST } = createCrudRoutes({
  permissions: {
    list: "canViewUsers",
    create: "canManageUsers",
  },
});
```

## Migration des Routes Existantes

### Avant (sans permissions)

```typescript
export async function GET(req: NextRequest) {
  try {
    const { entrepriseId, userId } = await requireTenantAuth();

    // Vérification manuelle
    const hasPermission = await userHasPermission(userId, "canViewUsers");
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Vous n'avez pas la permission..." },
        { status: 403 }
      );
    }

    const users = await getUsers(entrepriseId);
    return NextResponse.json({ users });
  } catch (error: any) {
    return handleTenantError(error);
  }
}
```

### Après (avec CRUD factory + permissions)

```typescript
export const { GET } = createCrudRoutes({
  modelName: "user",
  resourceName: "User",
  createSchema: userSchema,
  updateSchema: userSchema,
  searchFields: ["name", "email"],
  permissions: {
    list: "canViewUsers",
  },
});
```

**Réduction**: 117 lignes → ~15 lignes 🎉

---

**Documentation créée le**: 17 Novembre 2025
**Version**: 1.0.0
