// ============================================
// CHATBOT CONVERSATION API - Get/Delete Specific
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api/auth-middleware';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

export const GET = withAuth(async (req: NextRequest, session: any, { params }: RouteParams) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
        entrepriseId: session.user.entrepriseId,
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
  } catch (error: any) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la conversation' },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (req: NextRequest, session: any, { params }: RouteParams) => {
  try {
    // Vérifier que la conversation appartient à l'utilisateur
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
        entrepriseId: session.user.entrepriseId,
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
  } catch (error: any) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la conversation' },
      { status: 500 }
    );
  }
});

export const PATCH = withAuth(async (req: NextRequest, session: any, { params }: RouteParams) => {
  try {
    const body = await req.json();
    const { pinned, titre } = body;

    // Vérifier que la conversation appartient à l'utilisateur
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
        entrepriseId: session.user.entrepriseId,
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
  } catch (error: any) {
    console.error('Error updating conversation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la conversation' },
      { status: 500 }
    );
  }
});
