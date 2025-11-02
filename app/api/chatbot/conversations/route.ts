// ============================================
// CHATBOT CONVERSATIONS API - List
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api/auth-middleware';
import { prisma } from '@/lib/prisma';

export const GET = withAuth(async (req: NextRequest, session: any) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Récupérer les conversations de l'utilisateur
    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where: {
          userId: session.user.id,
          entrepriseId: session.user.entrepriseId,
        },
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: {
              content: true,
              createdAt: true,
              role: true,
            },
          },
          _count: {
            select: {
              messages: true,
            },
          },
        },
        orderBy: [
          { pinned: 'desc' },
          { updatedAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.conversation.count({
        where: {
          userId: session.user.id,
          entrepriseId: session.user.entrepriseId,
        },
      }),
    ]);

    return NextResponse.json({
      conversations,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des conversations' },
      { status: 500 }
    );
  }
});
