// ============================================
// CHATBOT FEEDBACK API - Thumbs up/down
// ============================================

import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const feedbackSchema = z.object({
    messageId: z.string(),
    feedback: z.enum(["positive", "negative"]),
    comment: z.string().optional(),
});

export async function POST(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await req.json();
            const result = feedbackSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const { messageId, feedback, comment } = result.data;

            // Vérifier que le message existe et appartient à une conversation de l'utilisateur
            const message = await prisma.message.findFirst({
                where: {
                    id: messageId,
                    conversation: {
                        userId: ctx.userId,
                        entrepriseId: ctx.entrepriseId,
                    },
                },
            });

            if (!message) {
                throw new NotFoundError("Message non trouvé");
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
                message: "Feedback enregistré",
            });
        },
        {
            context: { resourceName: "Chatbot", operation: "feedback" },
        }
    );
}
