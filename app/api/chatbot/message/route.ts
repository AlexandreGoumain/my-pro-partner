// ============================================
// CHATBOT MESSAGE API - Streaming with OpenAI
// ============================================

import { createOpenAIStream } from "@/lib/chatbot/api/stream-handler";
import { chatbotTools } from "@/lib/chatbot/chatbot-actions";
import { getSystemPrompt } from "@/lib/chatbot/chatbot-prompts";
import { checkInjection } from "@/lib/chatbot/security/injection-filter";
import { logger, logSecurityEvent } from "@/lib/chatbot/security/logger";
import { checkMessageRateLimitForPlan, getRateLimitForPlan, recordInjectionAttempt } from "@/lib/chatbot/security/rate-limit";
import { chatRequestSchema } from "@/lib/chatbot/validation";
import {
    getCurrentUsage,
    isLimitReached,
} from "@/lib/middleware/feature-validation";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import type { PlanAbonnement } from "@/lib/generated/prisma";
import {
    checkFeatureAccess,
    createFeatureError,
    createLimitError,
} from "@/lib/utils/plan-helpers";
import { validateRequest } from "@/lib/utils/validation-helper";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

interface RequestBody {
    messages: ChatMessage[];
    conversationId?: string;
}

// Estimation simple du nombre de tokens (1 token ≈ 4 caractères)
function estimateTokens(messages: ChatMessage[]): number {
    let total = 0;
    for (const msg of messages) {
        total += Math.ceil(msg.content.length / 4);
    }
    return total;
}

// Timeout controller pour la requête OpenAI
const OPENAI_TIMEOUT_MS = 30000; // 30 secondes

export async function POST(req: NextRequest) {
    try {
        const { entrepriseId, userId, user, entreprise } =
            await requireTenantAuth();

        // Check if user has access to the assistant (STARTER+ only)
        // Using new centralized plan system
        const hasAssistant = await checkFeatureAccess(
            entrepriseId,
            "aiChatbot"
        );
        if (!hasAssistant) {
            return NextResponse.json(createFeatureError("aiChatbot"), {
                status: 403,
            });
        }

        // Check quota for maxQuestionsPerMonth (except if unlimited = -1)
        const currentUsage = await getCurrentUsage(
            entrepriseId,
            "maxQuestionsPerMonth"
        );
        if (
            isLimitReached(
                entreprise.plan,
                "maxQuestionsPerMonth",
                currentUsage
            )
        ) {
            return NextResponse.json(createLimitError("maxQuestionsPerMonth"), {
                status: 403,
            });
        }

        // ✅ SÉCURITÉ : Rate limiting adaptatif selon le plan
        // FREE: 0/min, STARTER: 5/min, PRO: 20/min, ENTERPRISE: 50/min
        const rateLimitResult = await checkMessageRateLimitForPlan(userId, entreprise.plan as PlanAbonnement);
        const planLimit = getRateLimitForPlan(entreprise.plan as PlanAbonnement);

        if (!rateLimitResult.success) {
            logger.warn("Rate limit exceeded for chatbot messages", {
                userId,
                entrepriseId,
                plan: entreprise.plan,
                limit: rateLimitResult.limit,
                remaining: rateLimitResult.remaining,
                reset: new Date(rateLimitResult.reset).toISOString()
            });

            return NextResponse.json(
                {
                    error: "Trop de requêtes",
                    detail: `Vous avez atteint la limite de ${planLimit} messages par minute pour le plan ${entreprise.plan}. Veuillez réessayer dans quelques instants.`,
                    retryAfter: rateLimitResult.reset,
                    plan: entreprise.plan,
                    limit: planLimit,
                },
                {
                    status: 429,
                    headers: {
                        "X-RateLimit-Limit": rateLimitResult.limit.toString(),
                        "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
                        "X-RateLimit-Reset": rateLimitResult.reset.toString(),
                        "Retry-After": Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
                    }
                }
            );
        }

        // ✅ SÉCURITÉ : Validation stricte avec Zod
        const body = await req.json();
        const result = validateRequest(chatRequestSchema, body);
        if (!result.success) return result.response;

        const { messages, conversationId } = result.data;

        const lastMessage = messages[messages.length - 1];
        const userMessage = lastMessage.content;

        // ✅ SÉCURITÉ : Détection d'injection de prompt
        const injectionCheck = checkInjection(userMessage);
        if (injectionCheck.blocked) {
            // Enregistrer la tentative d'injection pour rate limiting
            const injectionRateLimit = await recordInjectionAttempt(userId);

            logSecurityEvent(
                "Prompt injection blocked",
                "high",
                `Blocked prompt injection attempt (score: ${injectionCheck.score})`,
                { userId, entrepriseId, score: injectionCheck.score }
            );

            // Si trop de tentatives d'injection, bloquer l'utilisateur
            if (!injectionRateLimit.success) {
                logSecurityEvent(
                    "User blocked for repeated injection attempts",
                    "critical",
                    `User exceeded injection attempt limit (${injectionRateLimit.limit} attempts)`,
                    { userId, entrepriseId }
                );

                return NextResponse.json(
                    {
                        error: "Compte temporairement bloqué",
                        detail: "Trop de tentatives suspectes détectées. Votre compte a été temporairement bloqué pour des raisons de sécurité.",
                        code: "ACCOUNT_BLOCKED",
                    },
                    { status: 403 }
                );
            }

            return NextResponse.json(
                {
                    error: "Requête suspecte détectée",
                    detail: injectionCheck.reason,
                    code: "INJECTION_DETECTED",
                },
                { status: 400 }
            );
        }

        // Log si score de suspicion élevé (mais pas bloquant)
        if (injectionCheck.score > 30) {
            logSecurityEvent(
                "High suspicion score detected",
                injectionCheck.score >= 50 ? "medium" : "low",
                `Message with suspicion score ${injectionCheck.score}`,
                { userId, entrepriseId }
            );
        }

        // ✅ SÉCURITÉ : Vérifier estimation de tokens
        const estimatedTokens = estimateTokens(messages);
        if (estimatedTokens > 4000) {
            return NextResponse.json(
                {
                    error: "Message trop long",
                    detail: "Votre message est trop long. Veuillez le raccourcir. (Limite: ~4000 tokens)",
                },
                { status: 400 }
            );
        }

        // Format messages for OpenAI
        const formattedMessages = messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
        }));

        // Create or retrieve conversation
        let conversation;
        if (conversationId) {
            conversation = await prisma.conversation.findUnique({
                where: { id: conversationId },
            });
        } else {
            // Create new conversation
            const title =
                userMessage.length > 50
                    ? userMessage.substring(0, 47) + "..."
                    : userMessage;
            conversation = await prisma.conversation.create({
                data: {
                    id: nanoid(),
                    titre: title,
                    userId,
                    entrepriseId,
                },
            });
        }

        if (!conversation) {
            return new Response(
                JSON.stringify({ error: "Conversation non trouvée" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
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

        // Prepare system prompt
        const systemPrompt = getSystemPrompt({
            userName: user.name || undefined,
            entrepriseName: entreprise.nom || "Mon Entreprise",
            userRole: user.role || "utilisateur",
        });

        // Call OpenAI API
        const apiKey = process.env.OPENAI_API_KEY;

        // ✅ SÉCURITÉ : Timeout sur la requête OpenAI
        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            OPENAI_TIMEOUT_MS
        );

        let openaiResponse;
        try {
            openaiResponse = await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [
                            { role: "system", content: systemPrompt },
                            ...formattedMessages,
                        ],
                        tools: chatbotTools,
                        tool_choice: "auto",
                        temperature: 0.7,
                        stream: true,
                    }),
                    signal: controller.signal,
                }
            );
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (
                fetchError instanceof Error &&
                fetchError.name === "AbortError"
            ) {
                return NextResponse.json(
                    {
                        error: "Timeout",
                        detail: "La requête a pris trop de temps. Veuillez réessayer.",
                    },
                    { status: 408 }
                );
            }
            throw fetchError;
        }

        clearTimeout(timeoutId);

        if (!openaiResponse.ok) {
            await openaiResponse.text(); // Consume response body
            logger.error("OpenAI API error", {
                statusCode: openaiResponse.status,
                statusText: openaiResponse.statusText
            }, { userId, entrepriseId });
            throw new Error(`OpenAI API error: ${openaiResponse.status}`);
        }

        // Get base URL for action execution
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const host = req.headers.get("host") || "localhost:3000";
        const baseUrl = `${protocol}://${host}`;

        // Create stream with callback to save to database
        const stream = await createOpenAIStream({
            response: openaiResponse,
            baseUrl,
            onStreamEnd: async (fullText, toolCalls) => {
                // Save assistant message to database
                try {
                    const metadata = {
                        timestamp: new Date().toISOString(),
                        ...(toolCalls.length > 0 && { toolCalls: toolCalls as object[] }),
                    };

                    await prisma.message.create({
                        data: {
                            conversationId: conversation!.id,
                            role: "ASSISTANT",
                            content: fullText,
                            model: "gpt-4o-mini",
                            metadata: metadata as object,
                        },
                    });

                    await prisma.conversation.update({
                        where: { id: conversation!.id },
                        data: { updatedAt: new Date() },
                    });
                } catch (dbError) {
                    logger.error("Failed to save assistant message to database", dbError, {
                        conversationId: conversation!.id,
                        userId,
                        entrepriseId
                    });
                }
            },
        });

        // Return the stream with custom headers
        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "X-Conversation-Id": conversation.id,
                "X-Model-Used": "gpt-4o-mini",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error: unknown) {
        return handleTenantError(error);
    }
}
