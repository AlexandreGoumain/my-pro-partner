import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/lib/personnel/roles-config";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { isDashboardEnabled } from "@/lib/dashboard-enabled";

// Constantes
const HTTP_STATUS = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

const USER_STATUS = {
    DELETED: "DELETED",
} as const;

const ADMIN_ROLES: UserRole[] = ["OWNER", "ADMIN"];

const ERROR_MESSAGES = {
    UNAUTHORIZED: "Non autorisé - session invalide",
    USER_NOT_FOUND: "Utilisateur introuvable",
    USER_DELETED: "Compte utilisateur supprimé",
    ENTREPRISE_NOT_FOUND: "Entreprise introuvable",
    SUBSCRIPTION_EXPIRED:
        "Abonnement expiré - Veuillez renouveler votre abonnement",
    ADMIN_REQUIRED: "Accès refusé - Droits administrateur requis",
    TENANT_ACCESS_DENIED:
        "Accès refusé - Cette ressource n'appartient pas à votre entreprise",
    INTERNAL_ERROR: "Erreur interne du serveur",
    DEVELOPMENT_ONLY: "Cette fonctionnalité n'est pas disponible en production",
    DASHBOARD_DISABLED:
        "Le dashboard n'est pas encore disponible. Rejoignez notre liste d'attente !",
} as const;

// Helper pour vérifier si un rôle est admin
function isAdminRole(role: string): boolean {
    return ADMIN_ROLES.includes(role as UserRole);
}

export interface TenantContext {
    userId: string;
    entrepriseId: string;
    entreprise: {
        id: string;
        nom: string;
        email: string;
        plan: string;
        abonnementActif: boolean;
        dateExpiration: Date | null;
        businessType: string;
    };
    user: {
        id: string;
        email: string;
        name: string | null;
        role: string;
    };
}

export class TenantError extends Error {
    constructor(
        message: string,
        public statusCode: number = HTTP_STATUS.UNAUTHORIZED
    ) {
        super(message);
        this.name = "TenantError";
    }
}

export async function requireTenantAuth(): Promise<TenantContext> {
    // Vérifier si le dashboard est activé
    if (!isDashboardEnabled()) {
        throw new TenantError(
            ERROR_MESSAGES.DASHBOARD_DISABLED,
            HTTP_STATUS.FORBIDDEN
        );
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        throw new TenantError(
            ERROR_MESSAGES.UNAUTHORIZED,
            HTTP_STATUS.UNAUTHORIZED
        );
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            entreprise: {
                select: {
                    id: true,
                    nom: true,
                    email: true,
                    plan: true,
                    abonnementActif: true,
                    dateExpiration: true,
                    businessType: true,
                },
            },
        },
    });

    if (!user) {
        throw new TenantError(
            ERROR_MESSAGES.USER_NOT_FOUND,
            HTTP_STATUS.NOT_FOUND
        );
    }

    // Vérifier que l'utilisateur n'est pas supprimé (soft delete)
    if (user.status === USER_STATUS.DELETED) {
        throw new TenantError(
            ERROR_MESSAGES.USER_DELETED,
            HTTP_STATUS.FORBIDDEN
        );
    }

    if (!user.entreprise) {
        throw new TenantError(
            ERROR_MESSAGES.ENTREPRISE_NOT_FOUND,
            HTTP_STATUS.NOT_FOUND
        );
    }

    if (!user.entreprise.abonnementActif) {
        throw new TenantError(
            ERROR_MESSAGES.SUBSCRIPTION_EXPIRED,
            HTTP_STATUS.FORBIDDEN
        );
    }

    if (
        user.entreprise.dateExpiration &&
        user.entreprise.dateExpiration < new Date()
    ) {
        await prisma.entreprise.update({
            where: { id: user.entreprise.id },
            data: { abonnementActif: false },
        });

        throw new TenantError(
            ERROR_MESSAGES.SUBSCRIPTION_EXPIRED,
            HTTP_STATUS.FORBIDDEN
        );
    }

    return {
        userId: user.id,
        entrepriseId: user.entreprise.id,
        entreprise: user.entreprise,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
    };
}

export function handleTenantError(error: unknown): NextResponse {
    if (error instanceof TenantError) {
        return NextResponse.json(
            { message: error.message },
            { status: error.statusCode }
        );
    }

    console.error("Tenant isolation error:", error);
    return NextResponse.json(
        { message: ERROR_MESSAGES.INTERNAL_ERROR },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
}

export async function requireAdmin(): Promise<TenantContext> {
    const context = await requireTenantAuth();

    if (!isAdminRole(context.user.role)) {
        throw new TenantError(
            ERROR_MESSAGES.ADMIN_REQUIRED,
            HTTP_STATUS.FORBIDDEN
        );
    }

    return context;
}

export function validateTenantAccess(
    resourceEntrepriseId: string,
    userEntrepriseId: string
): void {
    if (resourceEntrepriseId !== userEntrepriseId) {
        throw new TenantError(
            ERROR_MESSAGES.TENANT_ACCESS_DENIED,
            HTTP_STATUS.FORBIDDEN
        );
    }
}

/**
 * Verify resource access with tenant isolation
 * Combines authentication, resource fetching, existence check, and ownership verification
 *
 * @param resourceId - ID of the resource to verify
 * @param fetchResource - Function to fetch the resource from database
 * @param resourceName - Human-readable name for error messages (e.g., "Campagne", "Client")
 * @returns Object containing the resource and tenant context
 * @throws TenantError if resource not found or doesn't belong to user's company
 *
 * @example
 * const { resource: campaign, context } = await verifyResourceAccess(
 *   params.id,
 *   (id) => prisma.campaign.findUnique({ where: { id } }),
 *   'Campagne'
 * );
 */
export async function verifyResourceAccess<T extends { entrepriseId: string }>(
    resourceId: string,
    fetchResource: (id: string) => Promise<T | null>,
    resourceName: string
): Promise<{ resource: T; context: TenantContext }> {
    const context = await requireTenantAuth();

    const resource = await fetchResource(resourceId);

    if (!resource) {
        throw new TenantError(
            `${resourceName} non trouvé`,
            HTTP_STATUS.NOT_FOUND
        );
    }

    validateTenantAccess(resource.entrepriseId, context.entrepriseId);

    return { resource, context };
}

/**
 * Require development mode - blocks execution in production
 * Useful for development-only endpoints like data deletion, seeding, etc.
 *
 * @throws TenantError if in production environment
 *
 * @example
 * export async function DELETE() {
 *   requireDevelopmentMode();
 *   // ... deletion logic
 * }
 */
export function requireDevelopmentMode(): void {
    if (process.env.NODE_ENV === "production") {
        throw new TenantError(
            ERROR_MESSAGES.DEVELOPMENT_ONLY,
            HTTP_STATUS.FORBIDDEN
        );
    }
}
