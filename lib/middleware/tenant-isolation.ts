import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
    public statusCode: number = 401,
  ) {
    super(message);
    this.name = "TenantError";
  }
}

export async function requireTenantAuth(): Promise<TenantContext> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new TenantError("Non autorisé - session invalide", 401);
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
        },
      },
    },
  });

  if (!user) {
    throw new TenantError("Utilisateur introuvable", 404);
  }

  if (!user.entreprise) {
    throw new TenantError("Entreprise introuvable", 404);
  }

  if (!user.entreprise.abonnementActif) {
    throw new TenantError(
      "Abonnement expiré - Veuillez renouveler votre abonnement",
      403,
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
      "Abonnement expiré - Veuillez renouveler votre abonnement",
      403,
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
      { status: error.statusCode },
    );
  }

  console.error("Tenant isolation error:", error);
  return NextResponse.json(
    { message: "Erreur interne du serveur" },
    { status: 500 },
  );
}

export async function requireAdmin(): Promise<TenantContext> {
  const context = await requireTenantAuth();

  // Allow OWNER and ADMIN roles
  if (context.user.role !== "OWNER" && context.user.role !== "ADMIN") {
    throw new TenantError("Accès refusé - Droits administrateur requis", 403);
  }

  return context;
}

export function validateTenantAccess(
  resourceEntrepriseId: string,
  userEntrepriseId: string,
): void {
  if (resourceEntrepriseId !== userEntrepriseId) {
    throw new TenantError(
      "Accès refusé - Cette ressource n'appartient pas à votre entreprise",
      403,
    );
  }
}
