// ============================================
// CHATBOT MESSAGE API - Streaming with OpenAI
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { requireTenantAuth, handleTenantError } from '@/lib/middleware/tenant-isolation';
import { prisma } from '@/lib/prisma';
import { getSystemPrompt } from '@/lib/chatbot/chatbot-prompts';
import { chatbotTools } from '@/lib/chatbot/chatbot-actions';
import { createOpenAIStream } from '@/lib/chatbot/api/stream-handler';
import { nanoid } from 'nanoid';
import { getCurrentUsage, isLimitReached } from '@/lib/middleware/feature-validation';
import { checkFeatureAccess, createFeatureError, createLimitError } from '@/lib/utils/plan-helpers';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  conversationId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { entrepriseId, userId, user, entreprise } = await requireTenantAuth();

    // Check if user has access to the assistant (STARTER+ only)
    // Using new centralized plan system
    const hasAssistant = await checkFeatureAccess(entrepriseId, "aiChatbot");
    if (!hasAssistant) {
      return NextResponse.json(
        createFeatureError("aiChatbot"),
        { status: 403 }
      );
    }

    // Check quota for maxQuestionsPerMonth (except if unlimited = -1)
    const currentUsage = await getCurrentUsage(entrepriseId, "maxQuestionsPerMonth");
    if (isLimitReached(entreprise.plan, "maxQuestionsPerMonth", currentUsage)) {
      return NextResponse.json(
        createLimitError("maxQuestionsPerMonth"),
        { status: 403 }
      );
    }

    const body: RequestBody = await req.json();
    const { messages, conversationId } = body;

    console.log('Received body:', { messagesCount: messages?.length, conversationId });

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage.content;

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
      const title = userMessage.length > 50 ? userMessage.substring(0, 47) + '...' : userMessage;
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
      return new Response(JSON.stringify({ error: 'Conversation non trouvée' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: userMessage,
        model: null,
      },
    });

    // Prepare system prompt
    const systemPrompt = getSystemPrompt({
      userName: user.name || undefined,
      entrepriseName: entreprise.nom || 'Mon Entreprise',
      userRole: user.role || 'utilisateur',
    });

    // Call OpenAI API
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('Calling OpenAI API with messages:', formattedMessages.length);

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...formattedMessages],
        tools: chatbotTools,
        tool_choice: 'auto',
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', openaiResponse.status, errorText);
      throw new Error(`API error: ${openaiResponse.status} ${errorText}`);
    }

    console.log('OpenAI API response received, starting stream');

    // Get base URL for action execution
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    // Create stream with callback to save to database
    const stream = await createOpenAIStream({
      response: openaiResponse,
      baseUrl,
      onStreamEnd: async (fullText, toolCalls) => {
        // Save assistant message to database
        try {
          await prisma.message.create({
            data: {
              conversationId: conversation!.id,
              role: 'ASSISTANT',
              content: fullText,
              model: 'gpt-4o-mini',
              metadata: {
                timestamp: new Date().toISOString(),
                toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
              },
            },
          });

          await prisma.conversation.update({
            where: { id: conversation!.id },
            data: { updatedAt: new Date() },
          });
        } catch (dbError) {
          console.error('Database save error:', dbError);
        }
      },
    });

    // Return the stream with custom headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Conversation-Id': conversation.id,
        'X-Model-Used': 'gpt-4o-mini',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    return handleTenantError(error);
  }
}
