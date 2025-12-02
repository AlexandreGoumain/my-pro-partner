// ============================================
// STREAM HANDLER - OpenAI Streaming Logic
// ============================================

import { executeAction } from '../chatbot-executor';
import { logger, logSecurityEvent } from '../security/logger';
import {
  getActionMetadata,
  requiresConfirmation,
  getConfirmationMessage,
  isCriticalAction,
} from '../security/action-metadata';

interface ToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
}

interface StreamHandlerParams {
  response: Response;
  baseUrl: string;
  onStreamEnd: (fullText: string, toolCalls: ToolCall[]) => Promise<void>;
}

/**
 * Handle OpenAI streaming response and execute tool calls
 */
export async function createOpenAIStream({
  response,
  baseUrl,
  onStreamEnd,
}: StreamHandlerParams): Promise<ReadableStream> {
  let fullText = '';
  const toolCalls: ToolCall[] = [];
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            logger.debug('Stream completed', { textLength: fullText.length, toolCallsCount: toolCalls.length });

            // Execute tool calls if any
            if (toolCalls.length > 0) {
              fullText = await executeToolCalls(toolCalls, baseUrl, controller, encoder, fullText);
            }

            // Call the callback with final data
            await onStreamEnd(fullText, toolCalls);

            controller.close();
            break;
          }

          // Decode the chunk
          const chunk = decoder.decode(value, { stream: true });

          // Parse SSE events
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const json = JSON.parse(data);
                const delta = json.choices?.[0]?.delta;

                // Handle text content
                if (delta?.content) {
                  fullText += delta.content;
                  logger.debug('Streaming content chunk', { chunkLength: delta.content.length });
                  controller.enqueue(encoder.encode(delta.content));
                }

                // Handle tool calls
                if (delta?.tool_calls) {
                  accumulateToolCalls(delta.tool_calls as ToolCallDelta[], toolCalls);
                }
              } catch (_parseError) {
                // Ignore parsing errors
              }
            }
          }
        }
      } catch (error) {
        logger.error('Stream processing error', error);
        controller.error(error);
      }
    },
  });
}

interface ToolCallDelta {
  index: number;
  id?: string;
  type?: string;
  function?: {
    name?: string;
    arguments?: string;
  };
}

/**
 * Accumulate tool calls from delta chunks
 */
function accumulateToolCalls(toolCallDeltas: ToolCallDelta[], toolCalls: ToolCall[]) {
  for (const toolCallDelta of toolCallDeltas) {
    const index = toolCallDelta.index;

    // Initialize the tool call if necessary
    if (!toolCalls[index]) {
      toolCalls[index] = {
        id: toolCallDelta.id || '',
        type: toolCallDelta.type || 'function',
        function: {
          name: toolCallDelta.function?.name || '',
          arguments: '',
        },
      };
    }

    // Accumulate arguments
    if (toolCallDelta.function?.arguments) {
      toolCalls[index].function.arguments += toolCallDelta.function.arguments;
    }

    // Update name if present
    if (toolCallDelta.function?.name) {
      toolCalls[index].function.name = toolCallDelta.function.name;
    }
  }
}

/**
 * Execute tool calls and send results to client
 */
async function executeToolCalls(
  toolCalls: ToolCall[],
  baseUrl: string,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  fullText: string
): Promise<string> {
  let updatedText = fullText;

  for (const toolCall of toolCalls) {
    try {
      const actionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);

      // ✅ SÉCURITÉ : Vérifier si l'action nécessite une confirmation
      if (requiresConfirmation(actionName)) {
        const metadata = getActionMetadata(actionName);
        const confirmationMsg = getConfirmationMessage(actionName, args);

        // Log security event for critical actions
        if (isCriticalAction(actionName)) {
          logSecurityEvent(
            'Critical action attempted',
            'high',
            `User attempted to execute critical action: ${actionName}`,
            { action: actionName }
          );
        }

        // Pour l'instant, demander confirmation via le message
        // TODO Phase 2: Implémenter un vrai système de confirmation avec token
        const warningMessage = `\n\n⚠️ **Confirmation requise**\n\n${confirmationMsg}\n\n_Cette action nécessite une confirmation. Pour des raisons de sécurité, veuillez exécuter cette action manuellement depuis l'interface appropriée._`;
        updatedText += warningMessage;
        controller.enqueue(encoder.encode(warningMessage));

        logger.warn('Action blocked - requires confirmation', {
          action: actionName,
          riskLevel: metadata?.riskLevel
        });

        continue; // Skip execution
      }

      logger.info('Executing chatbot action', {
        functionName: actionName,
        argsLength: toolCall.function.arguments.length
      });

      const result = await executeAction(actionName, args, baseUrl);

      logger.debug('Action execution completed', {
        functionName: actionName,
        success: result.success
      });

      // Send result to client
      if (result.success) {
        // For navigation, send a special event
        const resultData = result.data as Record<string, unknown> | undefined;
        if (toolCall.function.name === 'navigate_to' && resultData?.path) {
          const navEvent = JSON.stringify({
            type: 'navigation',
            path: resultData.path,
          }) + '\n';
          controller.enqueue(encoder.encode(navEvent));
        }

        // Add success message to text
        const actionMessage = `\n\n✓ ${result.message || 'Action effectuée'}`;
        updatedText += actionMessage;
        controller.enqueue(encoder.encode(actionMessage));
      } else {
        const errorMessage = `\n\n✗ Erreur: ${result.error}`;
        updatedText += errorMessage;
        controller.enqueue(encoder.encode(errorMessage));
      }
    } catch (execError) {
      logger.error('Error executing chatbot action', execError, {
        action: toolCall.function.name
      });
      const errorMessage = `\n\n✗ Erreur lors de l'exécution: ${
        execError instanceof Error ? execError.message : 'Erreur inconnue'
      }`;
      updatedText += errorMessage;
      controller.enqueue(encoder.encode(errorMessage));
    }
  }

  return updatedText;
}
