// ============================================
// CHATBOT FEEDBACK API - Thumbs up/down
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { requireTenantAuth, handleTenantError } from '@/lib/middleware/tenant-isolation';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { validateRequest } from '@/lib/utils/validation-helper';

const feedbackSchema = z.object({
  messageId: z.string(),
  feedback: z.enum(['positive', 'negative']),
  comment: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { entrepriseId, userId } = await requireTenantAuth();

    const body = await req.json();
    const result = validateRequest(feedbackSchema, body);
    if (!result.success) return result.response;

    const { messageId, feedback, comment } = result.data;

    // Vérifier que le message existe et appartient à une conversation de l'utilisateur
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        conversation: {
          userId,
          entrepriseId,
        },
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le metadata du message avec le feedback
    const currentMetadata = (message.metadata as unknown) || {};
    const updatedMetadata = {
      ...currentMetadata,
      feedback: {
        type: feedback,
        comment: comment,
        timestamp: new Date().toISOString(),
      },
    };

    await prisma.message.update({
      where: { id: messageId },
      data: { metadata: updatedMetadata },
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback enregistré',
    });
  } catch (error: unknown) {
    return handleTenantError(error);
  }
}
