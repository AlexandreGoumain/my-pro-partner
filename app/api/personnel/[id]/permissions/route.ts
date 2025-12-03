/**
 * API Route - Gestion des permissions d'un employé
 * PATCH /api/personnel/[id]/permissions - Mettre à jour les permissions
 */

import { withApiHandler } from "@/lib/api/api-handler";
import { BusinessError } from "@/lib/errors";
import { updateUserPermissions, userHasPermission } from "@/lib/personnel/personnel.service";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(
    req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            // Vérifier que l'utilisateur a la permission canManageUsers
            const hasPermission = await userHasPermission(ctx.userId, "canManageUsers");
            if (!hasPermission) {
                throw new BusinessError("Vous n'avez pas la permission de gérer les utilisateurs");
            }

            const body = await req.json();
            const permissions = await updateUserPermissions(id, body, ctx.userId);

            return NextResponse.json({ permissions });
        },
        {
            context: { resourceName: "Personnel", operation: "updatePermissions" },
        }
    );
}
