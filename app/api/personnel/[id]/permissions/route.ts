/**
 * API Route - Gestion des permissions d'un employé
 * PATCH /api/personnel/[id]/permissions - Mettre à jour les permissions
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateUserPermissions } from "@/lib/personnel/personnel.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // TODO: Vérifier que l'utilisateur a la permission canManageUsers

    const body = await req.json();
    const permissions = await updateUserPermissions(params.id, body, session.user.id);

    return NextResponse.json({ permissions });
  } catch (error: any) {
    console.error("[PATCH /api/personnel/:id/permissions] Error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
