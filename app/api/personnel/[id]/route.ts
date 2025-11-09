/**
 * API Routes - Gestion d'un employé spécifique
 *
 * GET /api/personnel/[id] - Récupérer un employé
 * PATCH /api/personnel/[id] - Mettre à jour un employé
 * DELETE /api/personnel/[id] - Supprimer un employé
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from "@/lib/personnel/personnel.service";
import { UserStatus } from "@prisma/client";

/**
 * GET /api/personnel/[id]
 * Récupérer les informations détaillées d'un employé
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.entrepriseId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const user = await getUserById(params.id, session.user.entrepriseId);

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("[GET /api/personnel/:id] Error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/personnel/[id]
 * Mettre à jour les informations d'un employé
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await req.json();

    // Si c'est un changement de statut uniquement
    if (body.status && Object.keys(body).length === 1) {
      const user = await toggleUserStatus(
        params.id,
        session.user.entrepriseId,
        body.status as UserStatus,
        session.user.id
      );
      return NextResponse.json({ user });
    }

    // Mise à jour complète
    const updateData: any = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.prenom !== undefined) updateData.prenom = body.prenom;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.telephone !== undefined) updateData.telephone = body.telephone;
    if (body.dateNaissance !== undefined) {
      updateData.dateNaissance = body.dateNaissance ? new Date(body.dateNaissance) : null;
    }
    if (body.adresse !== undefined) updateData.adresse = body.adresse;
    if (body.codePostal !== undefined) updateData.codePostal = body.codePostal;
    if (body.ville !== undefined) updateData.ville = body.ville;
    if (body.photoUrl !== undefined) updateData.photoUrl = body.photoUrl;
    if (body.poste !== undefined) updateData.poste = body.poste;
    if (body.departement !== undefined) updateData.departement = body.departement;
    if (body.dateEmbauche !== undefined) {
      updateData.dateEmbauche = body.dateEmbauche ? new Date(body.dateEmbauche) : null;
    }
    if (body.dateFinContrat !== undefined) {
      updateData.dateFinContrat = body.dateFinContrat ? new Date(body.dateFinContrat) : null;
    }
    if (body.salaireHoraire !== undefined) updateData.salaireHoraire = body.salaireHoraire;
    if (body.numeroSecu !== undefined) updateData.numeroSecu = body.numeroSecu;
    if (body.iban !== undefined) updateData.iban = body.iban;

    const user = await updateUser(
      params.id,
      session.user.entrepriseId,
      updateData,
      session.user.id
    );

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("[PATCH /api/personnel/:id] Error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/personnel/[id]
 * Supprimer un employé
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Ne pas permettre de se supprimer soi-même
    if (params.id === session.user.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas vous supprimer vous-même" },
        { status: 400 }
      );
    }

    await deleteUser(params.id, session.user.entrepriseId, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[DELETE /api/personnel/:id] Error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
