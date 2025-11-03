// ============================================
// CHATBOT MESSAGES API - Get Messages for Conversation
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api/auth-middleware';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

export const GET = withAuth(async (req: NextRequest, session: unknown, { params }: RouteParams) => {
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

    // Récupérer les messages
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const before = searchParams.get('before'); // Pour pagination cursor-based

    const messages = await prisma.message.findMany({
      where: {
        conversationId: params.id,
        ...(before && { createdAt: { lt: new Date(before) } }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        role: true,
        content: true,
        model: true,
        metadata: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      messages: messages.reverse(), // Inverser pour avoir chronologique
      hasMore: messages.length === limit,
    });
  } catch (error: unknown) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    );
  }
});
