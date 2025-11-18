// ============================================
// CHATBOT MESSAGES API - Get Messages for Conversation
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { requireTenantAuth, handleTenantError } from '@/lib/middleware/tenant-isolation';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const { entrepriseId, userId } = await requireTenantAuth();

    // Vérifier que la conversation appartient à l'utilisateur
    const conversation = await prisma.conversation.findUnique({
      where: {
        id,
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

    // Récupérer les messages
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const before = searchParams.get('before'); // Pour pagination cursor-based

    const messages = await prisma.message.findMany({
      where: {
        conversationId: id,
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
    return handleTenantError(error);
  }
}
