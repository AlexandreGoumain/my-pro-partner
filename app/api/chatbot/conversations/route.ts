// ============================================
// CHATBOT CONVERSATIONS API - List
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { requireTenantAuth, handleTenantError } from '@/lib/middleware/tenant-isolation';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { entrepriseId, userId } = await requireTenantAuth();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    // Build where clause with optional search
    const whereClause = {
      userId,
      entrepriseId,
      ...(search && {
        OR: [
          { titre: { contains: search, mode: 'insensitive' as const } },
          { messages: { some: { content: { contains: search, mode: 'insensitive' as const } } } },
        ],
      }),
    };

    // Récupérer les conversations de l'utilisateur
    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where: whereClause,
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
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      conversations,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    return handleTenantError(error);
  }
}
