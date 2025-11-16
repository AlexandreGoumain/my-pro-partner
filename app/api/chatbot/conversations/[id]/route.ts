// ============================================
// CHATBOT CONVERSATION API - Get/Delete Specific
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { requireTenantAuth, handleTenantError } from '@/lib/middleware/tenant-isolation';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { entrepriseId, userId } = await requireTenantAuth();

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: params.id,
        userId,
        entrepriseId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            role: true,
            content: true,
            model: true,
            metadata: true,
            createdAt: true,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  } catch (error: unknown) {
    return handleTenantError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { entrepriseId, userId } = await requireTenantAuth();

    // Vérifier que la conversation appartient à l'utilisateur
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: params.id,
        userId,
        entrepriseId,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la conversation (cascade delete sur messages)
    await prisma.conversation.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Conversation supprimée',
    });
  } catch (error: unknown) {
    return handleTenantError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { entrepriseId, userId } = await requireTenantAuth();

    const body = await req.json();
    const { pinned, titre } = body;

    // Vérifier que la conversation appartient à l'utilisateur
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: params.id,
        userId,
        entrepriseId,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour la conversation
    const updated = await prisma.conversation.update({
      where: { id: params.id },
      data: {
        ...(pinned !== undefined && { pinned }),
        ...(titre && { titre }),
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    return handleTenantError(error);
  }
}
