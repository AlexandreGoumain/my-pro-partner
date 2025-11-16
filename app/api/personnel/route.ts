/**
 * API Routes - Gestion du Personnel
 *
 * GET /api/personnel - Liste tous les employés
 * POST /api/personnel - Créer un nouvel employé
 */

import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { createUser, getUsers, canAddUser, userHasPermission } from "@/lib/personnel/personnel.service";
import { UserRole } from "@prisma/client";

/**
 * GET /api/personnel
 * Liste tous les employés de l'entreprise avec filtres optionnels
 */
export async function GET(req: NextRequest) {
  try {
    const { entrepriseId, userId } = await requireTenantAuth();

    // Vérifier les permissions
    const hasPermission = await userHasPermission(userId, "canViewUsers");
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Vous n'avez pas la permission de voir les utilisateurs" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") as UserRole | null;
    const status = searchParams.get("status") as any;
    const search = searchParams.get("search") || undefined;

    const users = await getUsers(entrepriseId, {
      role: role || undefined,
      status: status || undefined,
      search,
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    return handleTenantError(error);
  }
}

/**
 * POST /api/personnel
 * Créer un nouvel employé
 */
export async function POST(req: NextRequest) {
  try {
    const { entrepriseId, userId } = await requireTenantAuth();

    // Vérifier les permissions
    const hasPermission = await userHasPermission(userId, "canManageUsers");
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Vous n'avez pas la permission de gérer les utilisateurs" },
        { status: 403 }
      );
    }

    // Vérifier la limite du plan
    const canAdd = await canAddUser(entrepriseId);
    if (!canAdd) {
      return NextResponse.json(
        {
          error: "Limite d'utilisateurs atteinte pour votre plan",
          limitReached: true
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validation
    if (!body.email) {
      return NextResponse.json(
        { error: "L'email est requis" },
        { status: 400 }
      );
    }

    if (!body.role) {
      return NextResponse.json(
        { error: "Le rôle est requis" },
        { status: 400 }
      );
    }

    // Créer l'utilisateur
    const user = await createUser(
      entrepriseId,
      {
        email: body.email,
        name: body.name,
        prenom: body.prenom,
        role: body.role,
        password: body.password,
        telephone: body.telephone,
        poste: body.poste,
        departement: body.departement,
        dateEmbauche: body.dateEmbauche ? new Date(body.dateEmbauche) : undefined,
        salaireHoraire: body.salaireHoraire,
        sendInvitation: body.sendInvitation !== false, // true par défaut
      },
      userId
    );

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    return handleTenantError(error);
  }
}
