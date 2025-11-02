// ============================================
// STREAM HANDLER - OpenAI Streaming Logic
// ============================================

import { executeAction } from '../chatbot-executor';

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
            console.log('Stream done. Full text:', fullText.length, 'Tool calls:', toolCalls.length);

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
                  console.log('Content chunk:', delta.content.substring(0, 50));
                  controller.enqueue(encoder.encode(delta.content));
                }

                // Handle tool calls
                if (delta?.tool_calls) {
                  accumulateToolCalls(delta.tool_calls, toolCalls);
                }
              } catch (parseError) {
                // Ignore parsing errors
              }
            }
          }
        }
      } catch (error) {
        console.error('Stream error:', error);
        controller.error(error);
      }
    },
  });
}

/**
 * Accumulate tool calls from delta chunks
 */
function accumulateToolCalls(toolCallDeltas: any[], toolCalls: ToolCall[]) {
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
      console.log('Executing tool:', toolCall.function.name, toolCall.function.arguments);
      const args = JSON.parse(toolCall.function.arguments);
      const result = await executeAction(toolCall.function.name, args, baseUrl);

      console.log('Tool result:', result);

      // Send result to client
      if (result.success) {
        // For navigation, send a special event
        if (toolCall.function.name === 'navigate_to' && result.data?.path) {
          const navEvent = JSON.stringify({
            type: 'navigation',
            path: result.data.path,
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
      console.error('Error executing tool:', execError);
      const errorMessage = `\n\n✗ Erreur lors de l'exécution: ${
        execError instanceof Error ? execError.message : 'Erreur inconnue'
      }`;
      updatedText += errorMessage;
      controller.enqueue(encoder.encode(errorMessage));
    }
  }

  return updatedText;
}
