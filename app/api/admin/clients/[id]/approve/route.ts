import { NextRequest, NextResponse } from "next/server";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const approveSchema = z.object({
  approve: z.boolean(),
  reason: z.string().optional(), // Reason for rejection
});

/**
 * POST /api/admin/clients/[id]/approve
 * Approve or reject a pending client registration
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { entrepriseId } = await requireTenantAuth();
    const { id: clientId } = await params;

    const body = await req.json();
    const validation = approveSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { approve, reason } = validation.data;

    // Check if client exists and belongs to company
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        entrepriseId,
        pendingApproval: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { message: "Client non trouvé ou déjà traité" },
        { status: 404 }
      );
    }

    if (approve) {
      // Approve: enable portal access
      const updatedClient = await prisma.client.update({
        where: { id: clientId },
        data: {
          pendingApproval: false,
          clientPortalEnabled: true,
        },
      });

      // TODO: Send approval email to client

      console.log(
        `[Client Approval] Client ${client.email} approved by admin`
      );

      return NextResponse.json({
        message: "Client approuvé avec succès",
        client: {
          id: updatedClient.id,
          email: updatedClient.email,
          clientPortalEnabled: updatedClient.clientPortalEnabled,
        },
      });
    } else {
      // Reject: delete the client or mark as rejected
      await prisma.client.delete({
        where: { id: clientId },
      });

      // TODO: Send rejection email to client with reason

      console.log(
        `[Client Approval] Client ${client.email} rejected by admin`
      );

      return NextResponse.json({
        message: "Client rejeté",
      });
    }
  } catch (error) {
    return handleTenantError(error);
  }
}
