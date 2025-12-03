/**
 * API Routes - Gestion du Personnel
 *
 * GET /api/personnel - Liste tous les employés
 * POST /api/personnel - Créer un nouvel employé
 */

import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError, BusinessError } from "@/lib/errors";
import { createUser, getUsers, canAddUser, userHasPermission } from "@/lib/personnel/personnel.service";
import { UserRole, UserStatus } from "@/lib/personnel/roles-config";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/personnel
 * Liste tous les employés de l'entreprise avec filtres optionnels
 */
export async function GET(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            // Vérifier les permissions
            const hasPermission = await userHasPermission(ctx.userId, "canViewUsers");
            if (!hasPermission) {
                throw new BusinessError("Vous n'avez pas la permission de voir les utilisateurs");
            }

            const { searchParams } = new URL(req.url);
            const role = searchParams.get("role") as UserRole | null;
            const status = searchParams.get("status") as UserStatus | null;
            const search = searchParams.get("search") || undefined;

            const users = await getUsers(ctx.entrepriseId, {
                role: role || undefined,
                status: status || undefined,
                search,
            });

            return NextResponse.json({ users });
        },
        {
            context: { resourceName: "Personnel", operation: "list" },
        }
    );
}

/**
 * POST /api/personnel
 * Créer un nouvel employé
 */
export async function POST(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            // Vérifier les permissions
            const hasPermission = await userHasPermission(ctx.userId, "canManageUsers");
            if (!hasPermission) {
                throw new BusinessError("Vous n'avez pas la permission de gérer les utilisateurs");
            }

            // Vérifier la limite du plan
            const canAdd = await canAddUser(ctx.entrepriseId);
            if (!canAdd) {
                throw new BusinessError("Limite d'utilisateurs atteinte pour votre plan");
            }

            const body = await req.json();

            // Validation
            if (!body.email) {
                throw new ValidationError("L'email est requis");
            }

            if (!body.role) {
                throw new ValidationError("Le rôle est requis");
            }

            // Créer l'utilisateur
            const user = await createUser(
                ctx.entrepriseId,
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
                ctx.userId
            );

            return NextResponse.json({ user }, { status: 201 });
        },
        {
            context: { resourceName: "Personnel", operation: "create" },
        }
    );
}
