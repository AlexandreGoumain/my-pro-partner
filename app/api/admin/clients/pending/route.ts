import { NextRequest, NextResponse } from "next/server";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/clients/pending
 * Get all clients pending admin approval
 */
export async function GET(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const pendingClients = await prisma.client.findMany({
      where: {
        entrepriseId,
        pendingApproval: true,
        clientPortalEnabled: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        adresse: true,
        codePostal: true,
        ville: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      clients: pendingClients,
      count: pendingClients.length,
    });
  } catch (error) {
    return handleTenantError(error);
  }
}
