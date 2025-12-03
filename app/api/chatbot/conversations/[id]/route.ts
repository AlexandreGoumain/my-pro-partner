// ============================================
// CHATBOT CONVERSATION API - Get/Delete Specific
// ============================================

import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
    _req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const conversation = await prisma.conversation.findUnique({
                where: {
                    id,
                    userId: ctx.userId,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    messages: {
                        orderBy: { createdAt: "asc" },
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
                throw new NotFoundError("Conversation non trouvée");
            }

            return NextResponse.json(conversation);
        },
        {
            context: { resourceName: "Chatbot", operation: "getConversation" },
        }
    );
}

export async function DELETE(
    _req: NextRequest,
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

            // Supprimer la conversation (cascade delete sur messages)
            await prisma.conversation.delete({
                where: { id },
            });

            return NextResponse.json({
                success: true,
                message: "Conversation supprimée",
            });
        },
        {
            context: { resourceName: "Chatbot", operation: "deleteConversation" },
        }
    );
}

export async function PATCH(
    req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await req.json();
            const { pinned, titre } = body;

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

            // Mettre à jour la conversation
            const updated = await prisma.conversation.update({
                where: { id },
                data: {
                    ...(pinned !== undefined && { pinned }),
                    ...(titre && { titre }),
                },
            });

            return NextResponse.json(updated);
        },
        {
            context: { resourceName: "Chatbot", operation: "updateConversation" },
        }
    );
}
