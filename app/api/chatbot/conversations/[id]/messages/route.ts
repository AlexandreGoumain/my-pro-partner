// ============================================
// CHATBOT MESSAGES API - Get Messages for Conversation
// ============================================

import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
    req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            // Vérifier que la conversation appartient à l'utilisateur
            const conversation = await prisma.conversation.findUnique({
                where: {
                    id,
                    userId: ctx.userId,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!conversation) {
                throw new NotFoundError("Conversation non trouvée");
            }

            // Récupérer les messages
            const { searchParams } = new URL(req.url);
            const limit = parseInt(searchParams.get("limit") || "100");
            const before = searchParams.get("before"); // Pour pagination cursor-based

            const messages = await prisma.message.findMany({
                where: {
                    conversationId: id,
                    ...(before && { createdAt: { lt: new Date(before) } }),
                },
                orderBy: { createdAt: "desc" },
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
        },
        {
            context: { resourceName: "Chatbot", operation: "getMessages" },
        }
    );
}
