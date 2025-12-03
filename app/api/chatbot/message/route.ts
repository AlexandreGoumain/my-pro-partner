// ============================================
// CHATBOT MESSAGE API - Streaming with AI SDK v5
// ============================================

import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { withApiHandler } from "@/lib/api/api-handler";
import { executeAction } from "@/lib/chatbot/chatbot-executor";
import { getSystemPrompt } from "@/lib/chatbot/chatbot-prompts";
import { checkContext } from "@/lib/chatbot/security/context-filter";
import { checkInjection } from "@/lib/chatbot/security/injection-filter";
import { logger, logSecurityEvent } from "@/lib/chatbot/security/logger";
import {
    checkMessageRateLimitForPlan,
    getRateLimitForPlan,
    recordInjectionAttempt,
} from "@/lib/chatbot/security/rate-limit";
import { chatRequestSchema } from "@/lib/chatbot/validation";
import { BusinessError, NotFoundError, ValidationError } from "@/lib/errors";
import type { PlanAbonnement } from "@/lib/generated/prisma";
import {
    getCurrentUsage,
    isLimitReached,
} from "@/lib/middleware/feature-validation";
import { prisma } from "@/lib/prisma";
import {
    checkFeatureAccess,
    createFeatureError,
    createLimitError,
} from "@/lib/utils/plan-helpers";

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

// Estimation simple du nombre de tokens (1 token ≈ 4 caractères)
function estimateTokens(messages: ChatMessage[]): number {
    let total = 0;
    for (const msg of messages) {
        total += Math.ceil(msg.content.length / 4);
    }
    return total;
}

// Tool execution wrapper for AI SDK v5
function createExecutableTool<T extends z.ZodObject<Record<string, z.ZodTypeAny>>>(
    name: string,
    description: string,
    inputSchema: T,
    baseUrl: string
) {
    return tool({
        description,
        inputSchema,
        execute: async (args: z.infer<T>) => {
            const result = await executeAction(name, args as Record<string, unknown>, baseUrl);
            return result;
        },
    });
}

export async function POST(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            // Check if user has access to the assistant (STARTER+ only)
            const hasAssistant = await checkFeatureAccess(ctx.entrepriseId, "aiChatbot");
            if (!hasAssistant) {
                return NextResponse.json(createFeatureError("aiChatbot"), {
                    status: 403,
                });
            }

            // Check quota for maxQuestionsPerMonth
            const currentUsage = await getCurrentUsage(
                ctx.entrepriseId,
                "maxQuestionsPerMonth"
            );
            if (
                isLimitReached(
                    ctx.entreprise.plan,
                    "maxQuestionsPerMonth",
                    currentUsage
                )
            ) {
                return NextResponse.json(createLimitError("maxQuestionsPerMonth"), {
                    status: 403,
                });
            }

            // Rate limiting
            const rateLimitResult = await checkMessageRateLimitForPlan(
                ctx.userId,
                ctx.entreprise.plan as PlanAbonnement
            );
            const planLimit = getRateLimitForPlan(ctx.entreprise.plan as PlanAbonnement);

            if (!rateLimitResult.success) {
                logger.warn("Rate limit exceeded for chatbot messages", {
                    userId: ctx.userId,
                    entrepriseId: ctx.entrepriseId,
                    plan: ctx.entreprise.plan,
                });

                return NextResponse.json(
                    {
                        error: "Trop de requêtes",
                        detail: `Limite de ${planLimit} messages par minute atteinte.`,
                        retryAfter: rateLimitResult.reset,
                    },
                    {
                        status: 429,
                        headers: {
                            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
                            "X-RateLimit-Remaining":
                                rateLimitResult.remaining.toString(),
                            "Retry-After": Math.ceil(
                                (rateLimitResult.reset - Date.now()) / 1000
                            ).toString(),
                        },
                    }
                );
            }

            // Validation
            const body = await req.json();
            const result = chatRequestSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const { messages, conversationId } = result.data;
            const lastMessage = messages[messages.length - 1];
            const userMessage = lastMessage.content;

            // Injection detection
            const injectionCheck = checkInjection(userMessage);
            if (injectionCheck.blocked) {
                const injectionRateLimit = await recordInjectionAttempt(ctx.userId);

                logSecurityEvent(
                    "Prompt injection blocked",
                    "high",
                    `Blocked prompt injection attempt (score: ${injectionCheck.score})`,
                    { userId: ctx.userId, entrepriseId: ctx.entrepriseId }
                );

                if (!injectionRateLimit.success) {
                    throw new BusinessError("Compte temporairement bloqué");
                }

                return NextResponse.json(
                    { error: "Requête suspecte détectée", detail: injectionCheck.reason },
                    { status: 400 }
                );
            }

            // Context check - Vérifier si la question est liée à l'ERP
            const contextCheck = checkContext(userMessage);
            if (!contextCheck.isOnTopic) {
                logger.info("Off-topic question detected", {
                    userId: ctx.userId,
                    entrepriseId: ctx.entrepriseId,
                    relevanceScore: contextCheck.relevanceScore,
                });

                return NextResponse.json(
                    {
                        error: "Question hors contexte",
                        detail: contextCheck.reason,
                        relevanceScore: contextCheck.relevanceScore,
                    },
                    { status: 400 }
                );
            }

            // Token limit check
            const estimatedTokens = estimateTokens(messages);
            if (estimatedTokens > 4000) {
                throw new ValidationError("Message trop long (Limite: ~4000 tokens)");
            }

            // Create or retrieve conversation
            let conversation;
            if (conversationId) {
                conversation = await prisma.conversation.findUnique({
                    where: { id: conversationId },
                });
            } else {
                const title =
                    userMessage.length > 50
                        ? userMessage.substring(0, 47) + "..."
                        : userMessage;
                conversation = await prisma.conversation.create({
                    data: {
                        id: nanoid(),
                        titre: title,
                        userId: ctx.userId,
                        entrepriseId: ctx.entrepriseId,
                    },
                });
            }

            if (!conversation) {
                throw new NotFoundError("Conversation");
            }

            // Save user message
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    role: "USER",
                    content: userMessage,
                    model: null,
                },
            });

            // System prompt
            const systemPrompt = getSystemPrompt({
                userName: ctx.user.name || undefined,
                entrepriseName: ctx.entreprise.nom || "Mon Entreprise",
                userRole: ctx.user.role || "utilisateur",
            });

            // Base URL for tool execution
            const protocol = req.headers.get("x-forwarded-proto") || "http";
            const host = req.headers.get("host") || "localhost:3000";
            const baseUrl = `${protocol}://${host}`;

            // Define tools with AI SDK format
            const tools = {
                search_clients: createExecutableTool(
                    "search_clients",
                    "Rechercher des clients avec filtres (nom, email, ville, points fidélité)",
                    z.object({
                        query: z.string().optional().describe("Terme de recherche"),
                        ville: z.string().optional().describe("Filtrer par ville"),
                        minPoints: z.number().optional().describe("Points minimum"),
                        maxPoints: z.number().optional().describe("Points maximum"),
                        limit: z.number().optional().describe("Nombre max de résultats"),
                    }),
                    baseUrl
                ),
                get_client_details: createExecutableTool(
                    "get_client_details",
                    "Obtenir les détails complets d'un client",
                    z.object({ clientId: z.string().describe("ID du client") }),
                    baseUrl
                ),
                create_client: createExecutableTool(
                    "create_client",
                    "Créer un nouveau client",
                    z.object({
                        nom: z.string().describe("Nom du client"),
                        prenom: z.string().optional().describe("Prénom"),
                        email: z.string().optional().describe("Email"),
                        telephone: z.string().optional().describe("Téléphone"),
                        adresse: z.string().optional().describe("Adresse"),
                        ville: z.string().optional().describe("Ville"),
                        codePostal: z.string().optional().describe("Code postal"),
                    }),
                    baseUrl
                ),
                search_articles: createExecutableTool(
                    "search_articles",
                    "Rechercher des articles/produits",
                    z.object({
                        query: z.string().optional().describe("Terme de recherche"),
                        type: z.enum(["PRODUIT", "SERVICE"]).optional(),
                        categorieId: z.string().optional(),
                        enStock: z.boolean().optional(),
                        limit: z.number().optional(),
                    }),
                    baseUrl
                ),
                get_stock_alerts: createExecutableTool(
                    "get_stock_alerts",
                    "Obtenir les alertes de stock (rupture, faible)",
                    z.object({
                        type: z.enum(["RUPTURE", "FAIBLE", "TOUS"]).optional(),
                    }),
                    baseUrl
                ),
                search_documents: createExecutableTool(
                    "search_documents",
                    "Rechercher des documents (devis, factures, avoirs)",
                    z.object({
                        type: z.enum(["DEVIS", "FACTURE", "AVOIR"]).optional(),
                        statut: z.enum(["BROUILLON", "ENVOYE", "ACCEPTE", "REFUSE", "PAYE", "ANNULE"]).optional(),
                        clientId: z.string().optional(),
                        limit: z.number().optional(),
                    }),
                    baseUrl
                ),
                create_document: createExecutableTool(
                    "create_document",
                    "Créer un nouveau document (devis, facture, avoir)",
                    z.object({
                        type: z.enum(["DEVIS", "FACTURE", "AVOIR"]),
                        clientId: z.string(),
                        dateEmission: z.string().optional(),
                    }),
                    baseUrl
                ),
                get_statistics: createExecutableTool(
                    "get_statistics",
                    "Obtenir les statistiques globales",
                    z.object({
                        period: z.enum(["TODAY", "WEEK", "MONTH", "YEAR", "ALL"]).optional(),
                    }),
                    baseUrl
                ),
                get_dashboard_kpis: createExecutableTool(
                    "get_dashboard_kpis",
                    "Obtenir les KPIs du dashboard",
                    z.object({}),
                    baseUrl
                ),
                query_unpaid_invoices: createExecutableTool(
                    "query_unpaid_invoices",
                    "Rechercher les factures impayées",
                    z.object({
                        overdueOnly: z.boolean().optional(),
                        minAmount: z.number().optional(),
                        clientId: z.string().optional(),
                    }),
                    baseUrl
                ),
                identify_best_clients: createExecutableTool(
                    "identify_best_clients",
                    "Identifier les meilleurs clients",
                    z.object({
                        limit: z.number().optional(),
                        period: z.enum(["month", "quarter", "year", "all"]).optional(),
                        sortBy: z.enum(["revenue", "count", "loyalty"]).optional(),
                    }),
                    baseUrl
                ),
                search_all: createExecutableTool(
                    "search_all",
                    "Recherche globale (clients, articles, documents)",
                    z.object({
                        query: z.string().describe("Terme de recherche"),
                        limit: z.number().optional(),
                    }),
                    baseUrl
                ),
                navigate_to: tool({
                    description: "Naviguer vers une page de l'ERP",
                    inputSchema: z.object({
                        page: z.enum([
                            "DASHBOARD",
                            "CLIENTS",
                            "ARTICLES",
                            "DOCUMENTS",
                            "STOCK",
                            "SEGMENTS",
                            "CAMPAIGNS",
                            "LOYALTY",
                            "SETTINGS",
                        ]).describe("Page de destination"),
                        entityId: z.string().optional().describe("ID de l'entité"),
                    }),
                    // No execute - handled client-side
                }),
            };

            // Stream with AI SDK
            const streamResult = streamText({
                model: openai("gpt-4o-mini"),
                system: systemPrompt,
                messages: messages.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
                tools,
                toolChoice: "auto",
                temperature: 0.7,
                maxOutputTokens: 2000,
                onFinish: async ({ text, toolCalls }) => {
                    // Save assistant message
                    try {
                        await prisma.message.create({
                            data: {
                                conversationId: conversation!.id,
                                role: "ASSISTANT",
                                content: text,
                                model: "gpt-4o-mini",
                                metadata: toolCalls?.length
                                    ? ({ toolCalls } as object)
                                    : undefined,
                            },
                        });

                        await prisma.conversation.update({
                            where: { id: conversation!.id },
                            data: { updatedAt: new Date() },
                        });
                    } catch (dbError) {
                        logger.error("Failed to save message", dbError);
                    }
                },
            });

            // Return streaming response with conversation ID header
            const response = streamResult.toUIMessageStreamResponse();

            // Add custom headers
            const headers = new Headers(response.headers);
            headers.set("X-Conversation-Id", conversation.id);
            headers.set("X-Model-Used", "gpt-4o-mini");

            return new NextResponse(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers,
            });
        },
        {
            context: { resourceName: "Chatbot", operation: "message" },
        }
    );
}
