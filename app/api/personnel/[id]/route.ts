/**
 * API Routes - Gestion d'un employé spécifique
 *
 * GET /api/personnel/[id] - Récupérer un employé
 * PATCH /api/personnel/[id] - Mettre à jour un employé
 * DELETE /api/personnel/[id] - Supprimer un employé
 */

import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import {
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  userHasPermission,
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
    const { entrepriseId } = await requireTenantAuth();

    const user = await getUserById(params.id, entrepriseId);

    return NextResponse.json({ user });
  } catch (error: any) {
    return handleTenantError(error);
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
    const { entrepriseId, userId } = await requireTenantAuth();

    // Vérifier les permissions
    const hasPermission = await userHasPermission(userId, "canManageUsers");
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Vous n'avez pas la permission de gérer les utilisateurs" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Si c'est un changement de statut uniquement
    if (body.status && Object.keys(body).length === 1) {
      const user = await toggleUserStatus(
        params.id,
        entrepriseId,
        body.status as UserStatus,
        userId
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
      entrepriseId,
      updateData,
      userId
    );

    return NextResponse.json({ user });
  } catch (error: any) {
    return handleTenantError(error);
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
    const { entrepriseId, userId } = await requireTenantAuth();

    // Vérifier les permissions
    const hasPermission = await userHasPermission(userId, "canManageUsers");
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Vous n'avez pas la permission de gérer les utilisateurs" },
        { status: 403 }
      );
    }

    // Ne pas permettre de se supprimer soi-même
    if (params.id === userId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas vous supprimer vous-même" },
        { status: 400 }
      );
    }

    await deleteUser(params.id, entrepriseId, userId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return handleTenantError(error);
  }
}
