// ============================================
// CHATBOT FEEDBACK API - Thumbs up/down
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api/auth-middleware';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const feedbackSchema = z.object({
  messageId: z.string(),
  feedback: z.enum(['positive', 'negative']),
  comment: z.string().optional(),
});

export const POST = withAuth(async (req: NextRequest, session: any) => {
  try {
    const body = await req.json();
    const validated = feedbackSchema.parse(body);

    // Vérifier que le message existe et appartient à une conversation de l'utilisateur
    const message = await prisma.message.findFirst({
      where: {
        id: validated.messageId,
        conversation: {
          userId: session.user.id,
          entrepriseId: session.user.entrepriseId,
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
    const currentMetadata = (message.metadata as any) || {};
    const updatedMetadata = {
      ...currentMetadata,
      feedback: {
        type: validated.feedback,
        comment: validated.comment,
        timestamp: new Date().toISOString(),
      },
    };

    await prisma.message.update({
      where: { id: validated.messageId },
      data: { metadata: updatedMetadata },
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback enregistré',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement du feedback' },
      { status: 500 }
    );
  }
});
