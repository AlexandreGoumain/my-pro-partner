/**
 * API Route - Gestion des permissions d'un employé
 * PATCH /api/personnel/[id]/permissions - Mettre à jour les permissions
 */

import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { updateUserPermissions, userHasPermission } from "@/lib/personnel/personnel.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireTenantAuth();
    const { id } = await params;

    // Vérifier que l'utilisateur a la permission canManageUsers
    const hasPermission = await userHasPermission(userId, "canManageUsers");
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Vous n'avez pas la permission de gérer les utilisateurs" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const permissions = await updateUserPermissions(id, body, userId);

    return NextResponse.json({ permissions });
  } catch (error) {
    return handleTenantError(error);
  }
}
