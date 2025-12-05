/**
 * API Routes - Gestion d'un employé spécifique
 *
 * GET /api/personnel/[id] - Récupérer un employé
 * PATCH /api/personnel/[id] - Mettre à jour un employé
 * DELETE /api/personnel/[id] - Supprimer un employé
 */

import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError, BusinessError } from "@/lib/errors";
import {
    getUserById,
    updateUser,
    deleteUser,
    toggleUserStatus,
    userHasPermission,
} from "@/lib/personnel/personnel.service";
import { UserStatus } from "@/lib/personnel/roles-config";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/personnel/[id]
 * Récupérer les informations détaillées d'un employé
 */
export async function GET(
    _req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const user = await getUserById(id, ctx.entrepriseId);
            return NextResponse.json({ user });
        },
        {
            context: { resourceName: "Personnel", operation: "get" },
        }
    );
}

/**
 * PATCH /api/personnel/[id]
 * Mettre à jour les informations d'un employé
 */
export async function PATCH(
    req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            // Vérifier les permissions
            const hasPermission = await userHasPermission(ctx.userId, "canManageUsers");
            if (!hasPermission) {
                throw new BusinessError("Vous n'avez pas la permission de gérer les utilisateurs");
            }

            const body = await req.json();

            // Si c'est un changement de statut uniquement
            if (body.status && Object.keys(body).length === 1) {
                const user = await toggleUserStatus(
                    id,
                    ctx.entrepriseId,
                    body.status as UserStatus,
                    ctx.userId
                );
                return NextResponse.json({ user });
            }

            // Mise à jour complète
            const updateData: Record<string, unknown> = {};

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
                id,
                ctx.entrepriseId,
                updateData,
                ctx.userId
            );

            return NextResponse.json({ user });
        },
        {
            context: { resourceName: "Personnel", operation: "update" },
        }
    );
}

/**
 * DELETE /api/personnel/[id]
 * Supprimer un employé
 */
export async function DELETE(
    _req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            // Vérifier les permissions
            const hasPermission = await userHasPermission(ctx.userId, "canManageUsers");
            if (!hasPermission) {
                throw new BusinessError("Vous n'avez pas la permission de gérer les utilisateurs");
            }

            // Ne pas permettre de se supprimer soi-même
            if (id === ctx.userId) {
                throw new ValidationError("Vous ne pouvez pas vous supprimer vous-même");
            }

            await deleteUser(id, ctx.entrepriseId, ctx.userId);

            return NextResponse.json({ success: true });
        },
        {
            context: { resourceName: "Personnel", operation: "delete" },
        }
    );
}
