// ============================================
// CHATBOT CONVERSATIONS API - List
// ============================================

import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const { searchParams } = new URL(req.url);
            const page = parseInt(searchParams.get("page") || "1");
            const limit = parseInt(searchParams.get("limit") || "20");
            const search = searchParams.get("search") || "";
            const skip = (page - 1) * limit;

            // Build where clause with optional search
            const whereClause = {
                userId: ctx.userId,
                entrepriseId: ctx.entrepriseId,
                ...(search && {
                    OR: [
                        { titre: { contains: search, mode: "insensitive" as const } },
                        { messages: { some: { content: { contains: search, mode: "insensitive" as const } } } },
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
                            orderBy: { createdAt: "desc" },
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
                        { pinned: "desc" },
                        { updatedAt: "desc" },
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
        },
        {
            context: { resourceName: "Chatbot", operation: "listConversations" },
        }
    );
}
