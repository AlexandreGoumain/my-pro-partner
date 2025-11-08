/**
 * API Routes - Gestion du Personnel
 *
 * GET /api/personnel - Liste tous les employés
 * POST /api/personnel - Créer un nouvel employé
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createUser, getUsers, canAddUser } from "@/lib/personnel/personnel.service";
import { UserRole } from "@prisma/client";

/**
 * GET /api/personnel
 * Liste tous les employés de l'entreprise avec filtres optionnels
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.entrepriseId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier les permissions
    // TODO: Ajouter vérification canViewUsers

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") as UserRole | null;
    const status = searchParams.get("status") as any;
    const search = searchParams.get("search") || undefined;

    const users = await getUsers(session.user.entrepriseId, {
      role: role || undefined,
      status: status || undefined,
      search,
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("[GET /api/personnel] Error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/personnel
 * Créer un nouvel employé
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.entrepriseId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier les permissions
    // TODO: Ajouter vérification canManageUsers

    // Vérifier la limite du plan
    const canAdd = await canAddUser(session.user.entrepriseId);
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
      session.user.entrepriseId,
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
      session.user.id
    );

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/personnel] Error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création de l'utilisateur" },
      { status: 500 }
    );
  }
}
