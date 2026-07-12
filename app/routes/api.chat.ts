import { type ActionFunctionArgs } from '@remix-run/node';
import { createDataStream, generateId } from 'ai';
import { MAX_RESPONSE_SEGMENTS, MAX_TOKENS, type FileMap } from '~/lib/.server/llm/constants';
import { CONTINUE_PROMPT } from '~/lib/common/prompts/prompts';
import { streamText, type Messages, type StreamingOptions } from '~/lib/.server/llm/stream-text';
import SwitchableStream from '~/lib/.server/llm/switchable-stream';
import type { IProviderSetting } from '~/types/model';
import { createScopedLogger } from '~/utils/logger';
import { getFilePaths, selectContext } from '~/lib/.server/llm/select-context';
import type { ContextAnnotation, ProgressAnnotation } from '~/types/context';
import { WORK_DIR } from '~/utils/constants';
import { createSummary } from '~/lib/.server/llm/create-summary';
import { extractPropertiesFromMessage, extractTextContent } from '~/lib/.server/llm/utils';
import type { DesignScheme } from '~/types/design-scheme';
import { MCPService } from '~/lib/services/mcpService';
import { StreamRecoveryManager } from '~/lib/.server/llm/stream-recovery';
import { loadApiKeysFromEnv } from '~/lib/utils/env-api-keys';
import { generateDefaultResponse } from '~/lib/default-chatbot';

export async function action(args: ActionFunctionArgs) {
  return chatAction(args);
}

const logger = createScopedLogger('api.chat');

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};

  const items = cookieHeader.split(';').map((cookie) => cookie.trim());

  items.forEach((item) => {
    const [name, ...rest] = item.split('=');

    if (name && rest) {
      const decodedName = decodeURIComponent(name.trim());
      const decodedValue = decodeURIComponent(rest.join('=').trim());
      cookies[decodedName] = decodedValue;
    }
  });

  return cookies;
}

async function chatAction({ request }: ActionFunctionArgs) {
  const streamRecovery = new StreamRecoveryManager({
    timeout: 45000,
    maxRetries: 2,
    onTimeout: () => {
      logger.warn('Stream timeout - attempting recovery');
    },
  });

  let requestData;

  try {
    requestData = (await request.json()) as {
      messages: Messages;
      files: any;
      promptId?: string;
      contextOptimization: boolean;
      chatMode: 'discuss' | 'build';
      designScheme?: DesignScheme;
      maxLLMSteps: number;
    };
  } catch (error) {
    logger.error('Failed to parse request JSON:', error);
    return new Response(
      JSON.stringify({
        error: true,
        message: 'Invalid request format. Please check your input and try again.',
        statusCode: 400,
        isRetryable: false,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        statusText: 'Bad Request',
      },
    );
  }

  const { messages, files, promptId, contextOptimization, chatMode, designScheme, maxLLMSteps } = requestData;

  // Validate required fields
  if (!messages || !Array.isArray(messages)) {
    logger.error('Invalid messages field:', { messages });
    return new Response(
      JSON.stringify({
        error: true,
        message: 'Invalid messages format. Messages must be an array.',
        statusCode: 400,
        isRetryable: false,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        statusText: 'Bad Request',
      },
    );
  }

  if (typeof contextOptimization !== 'boolean') {
    logger.error('Invalid contextOptimization field:', { contextOptimization });
    return new Response(
      JSON.stringify({
        error: true,
        message: 'Invalid contextOptimization format. Must be a boolean.',
        statusCode: 400,
        isRetryable: false,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        statusText: 'Bad Request',
      },
    );
  }

  if (typeof maxLLMSteps !== 'number' || maxLLMSteps < 1) {
    logger.error('Invalid maxLLMSteps field:', { maxLLMSteps });
    return new Response(
      JSON.stringify({
        error: true,
        message: 'Invalid maxLLMSteps format. Must be a positive number.',
        statusCode: 400,
        isRetryable: false,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        statusText: 'Bad Request',
      },
    );
  }

  const cookieHeader = request.headers.get('Cookie');
  let cookieApiKeys: Record<string, string> = {};
  let providerSettings: Record<string, IProviderSetting> = {};

  try {
    cookieApiKeys = JSON.parse(parseCookies(cookieHeader || '').apiKeys || '{}');
  } catch (error) {
    logger.warn('Failed to parse API keys from cookies:', error);
    cookieApiKeys = {};
  }

  try {
    providerSettings = JSON.parse(parseCookies(cookieHeader || '').providers || '{}');
  } catch (error) {
    logger.warn('Failed to parse provider settings from cookies:', error);
    providerSettings = {};
  }

  const envApiKeys = loadApiKeysFromEnv(process.env as any);
  const apiKeys: Record<string, string> = { ...envApiKeys, ...cookieApiKeys };

  logger.info(
    `Resolved API Keys: ${Object.keys(apiKeys)
      .map((k) => `${k}:${apiKeys[k] ? 'SET' : 'UNSET'}`)
      .join(', ')}`,
  );

  const stream = new SwitchableStream();

  const cumulativeUsage = {
    completionTokens: 0,
    promptTokens: 0,
    totalTokens: 0,
  };
  const encoder: TextEncoder = new TextEncoder();
  let progressCounter: number = 1;

  try {
    const mcpService = MCPService.getInstance();
    const totalMessageContent = messages.reduce((acc, message) => acc + message.content, '');
    logger.debug(`Total message length: ${totalMessageContent.split(' ').length}, words`);

    let lastChunk: string | undefined = undefined;

    const dataStream = createDataStream({
      async execute(dataStream) {
        streamRecovery.startMonitoring();

        const filePaths = getFilePaths(files || {});
        let filteredFiles: FileMap | undefined = undefined;
        let summary: string | undefined = undefined;
        let messageSliceId = 0;

        const processedMessages = await mcpService.processToolInvocations(messages, dataStream);

        if (processedMessages.length > 3) {
          messageSliceId = processedMessages.length - 3;
        }

        if (filePaths.length > 0 && contextOptimization) {
          logger.debug('Generating Chat Summary');
          dataStream.writeData({
            type: 'progress',
            label: 'summary',
            status: 'in-progress',
            order: progressCounter++,
            message: 'Analysing Request',
          } satisfies ProgressAnnotation);

          // Create a summary of the chat
          console.log(`Messages count: ${processedMessages.length}`);

          summary = await createSummary({
            messages: [...processedMessages],
            env: process.env,
            apiKeys,
            providerSettings,
            promptId,
            contextOptimization,
            onFinish(resp) {
              if (resp.usage) {
                logger.debug('createSummary token usage', JSON.stringify(resp.usage));
                cumulativeUsage.completionTokens += resp.usage.completionTokens || 0;
                cumulativeUsage.promptTokens += resp.usage.promptTokens || 0;
                cumulativeUsage.totalTokens += resp.usage.totalTokens || 0;
              }
            },
          });
          dataStream.writeData({
            type: 'progress',
            label: 'summary',
            status: 'complete',
            order: progressCounter++,
            message: 'Analysis Complete',
          } satisfies ProgressAnnotation);

          dataStream.writeMessageAnnotation({
            type: 'chatSummary',
            summary,
            chatId: processedMessages.slice(-1)?.[0]?.id,
          } as ContextAnnotation);

          // Update context buffer
          logger.debug('Updating Context Buffer');
          dataStream.writeData({
            type: 'progress',
            label: 'context',
            status: 'in-progress',
            order: progressCounter++,
            message: 'Determining Files to Read',
          } satisfies ProgressAnnotation);

          // Select context files
          console.log(`Messages count: ${processedMessages.length}`);
          filteredFiles = await selectContext({
            messages: [...processedMessages],
            env: process.env,
            apiKeys,
            files,
            providerSettings,
            promptId,
            contextOptimization,
            summary,
            onFinish(resp) {
              if (resp.usage) {
                logger.debug('selectContext token usage', JSON.stringify(resp.usage));
                cumulativeUsage.completionTokens += resp.usage.completionTokens || 0;
                cumulativeUsage.promptTokens += resp.usage.promptTokens || 0;
                cumulativeUsage.totalTokens += resp.usage.totalTokens || 0;
              }
            },
          });

          if (filteredFiles) {
            logger.debug(`files in context : ${JSON.stringify(Object.keys(filteredFiles))}`);
          }

          dataStream.writeMessageAnnotation({
            type: 'codeContext',
            files: Object.keys(filteredFiles).map((key) => {
              let path = key;

              if (path.startsWith(WORK_DIR)) {
                path = path.replace(WORK_DIR, '');
              }

              return path;
            }),
          } as ContextAnnotation);

          dataStream.writeData({
            type: 'progress',
            label: 'context',
            status: 'complete',
            order: progressCounter++,
            message: 'Code Files Selected',
          } satisfies ProgressAnnotation);

          // logger.debug('Code Files Selected');
        }

        const options: StreamingOptions = {
          toolChoice: 'auto',
          tools: mcpService.toolsWithoutExecute,
          maxSteps: maxLLMSteps,
          onStepFinish: ({ toolCalls }) => {
            // add tool call annotations for frontend processing
            toolCalls.forEach((toolCall) => {
              mcpService.processToolCall(toolCall, dataStream);
            });
          },
          onFinish: async ({ text: content, finishReason, usage }) => {
            logger.debug('usage', JSON.stringify(usage));

            if (usage) {
              cumulativeUsage.completionTokens += usage.completionTokens || 0;
              cumulativeUsage.promptTokens += usage.promptTokens || 0;
              cumulativeUsage.totalTokens += usage.totalTokens || 0;
            }

            if (finishReason !== 'length') {
              dataStream.writeMessageAnnotation({
                type: 'usage',
                value: {
                  completionTokens: cumulativeUsage.completionTokens,
                  promptTokens: cumulativeUsage.promptTokens,
                  totalTokens: cumulativeUsage.totalTokens,
                },
              });
              dataStream.writeData({
                type: 'progress',
                label: 'response',
                status: 'complete',
                order: progressCounter++,
                message: 'Response Generated',
              } satisfies ProgressAnnotation);
              await new Promise((resolve) => setTimeout(resolve, 0));

              // stream.close();
              return;
            }

            if (stream.switches >= MAX_RESPONSE_SEGMENTS) {
              throw Error('Cannot continue message: Maximum segments reached');
            }

            const switchesLeft = MAX_RESPONSE_SEGMENTS - stream.switches;

            logger.info(`Reached max token limit (${MAX_TOKENS}): Continuing message (${switchesLeft} switches left)`);

            const lastUserMessage = processedMessages.filter((x) => x.role == 'user').slice(-1)[0];
            const { model, provider } = extractPropertiesFromMessage(lastUserMessage);
            processedMessages.push({ id: generateId(), role: 'assistant', content });
            processedMessages.push({
              id: generateId(),
              role: 'user',
              content: `[Model: ${model}]\n\n[Provider: ${provider}]\n\n${CONTINUE_PROMPT}`,
            });

            // Continue prompt also goes through LLM (no hardcoded responses)
            const result = await streamText({
              messages: [...processedMessages],
              env: process.env,
              options,
              apiKeys,
              files,
              providerSettings,
              promptId,
              contextOptimization,
              contextFiles: filteredFiles,
              chatMode,
              designScheme,
              summary,
              messageSliceId,
            });

            result.mergeIntoDataStream(dataStream);

            (async () => {
              for await (const part of result.fullStream) {
                if (part.type === 'error') {
                  const error: any = part.error;
                  logger.error(`${error}`);

                  return;
                }
              }
            })();

            return;
          },
        };

        dataStream.writeData({
          type: 'progress',
          label: 'response',
          status: 'in-progress',
          order: progressCounter++,
          message: 'Generating Response',
        } satisfies ProgressAnnotation);

        // Check if we have an API key - only use default responses if NO API key is available
        const hasApiKey =
          Object.keys(apiKeys).length > 0 &&
          Object.values(apiKeys).some((key) => key && typeof key === 'string' && key.trim() !== '');

        /**
         * Only use default chatbot if NO API key is available (fallback mode).
         * ALL queries with API keys will go through the LLM, including founder questions.
         */
        if (!hasApiKey) {
          const lastMessage = processedMessages[processedMessages.length - 1];
          const messageText = lastMessage ? extractTextContent(lastMessage) : '';
          const defaultResponse = generateDefaultResponse(messageText);

          if (defaultResponse && typeof defaultResponse === 'string' && defaultResponse.trim().length > 0) {
            // Write response in word chunks for fallback mode
            const words = defaultResponse.split(/(\s+)/);

            for (let i = 0; i < words.length; i++) {
              const chunk = words[i];

              if (chunk.length > 0) {
                dataStream.writeData({
                  type: 'text-delta',
                  textDelta: chunk,
                });

                if (i % 5 === 0) {
                  await new Promise((resolve) => setTimeout(resolve, 0));
                }
              }
            }

            dataStream.writeData({
              type: 'progress',
              label: 'response',
              status: 'complete',
              order: progressCounter++,
              message: 'Response Complete',
            } satisfies ProgressAnnotation);

            return;
          }
        }

        // All queries with API keys OR when default response fails will go through LLM

        let result;

        try {
          result = await streamText({
            messages: [...processedMessages],
            env: process.env,
            options,
            apiKeys,
            files,
            providerSettings,
            promptId,
            contextOptimization,
            contextFiles: filteredFiles,
            chatMode,
            designScheme,
            summary,
            messageSliceId,
          });
        } catch (error: any) {
          // Handle billing errors by falling back to default chatbot
          const errorMessage = error.message || 'Unknown error';
          const errorCode = error.code || error.status || 'UNKNOWN';

          logger.error('Inner try-catch error:', {
            message: errorMessage,
            code: errorCode,
            status: error.status,
            statusCode: error.statusCode,
            type: error.type,
          });

          if (
            errorMessage.includes('Payment Required') ||
            errorMessage.includes('payment') ||
            errorMessage.includes('billing') ||
            errorMessage.includes('quota') ||
            errorMessage.includes('credit') ||
            errorMessage.includes('insufficient') ||
            errorMessage.includes('exceeded') ||
            errorMessage.includes('limit') ||
            errorCode === 402 ||
            error.status === 402 ||
            error.statusCode === 402
          ) {
            logger.warn('Billing error detected, falling back to default chatbot:', {
              message: errorMessage,
              code: errorCode,
              status: error.status,
              statusCode: error.statusCode,
            });

            // Use default chatbot response (fallback when billing error occurs)
            const fallbackLastMessage = processedMessages[processedMessages.length - 1];
            const fallbackMessageText = fallbackLastMessage ? extractTextContent(fallbackLastMessage) : '';
            const defaultResponse = generateDefaultResponse(fallbackMessageText);

            // Write the response as a single chunk
            dataStream.writeData({
              type: 'text-delta',
              textDelta: defaultResponse,
            });

            dataStream.writeData({
              type: 'progress',
              label: 'response',
              status: 'complete',
              order: progressCounter++,
              message: 'Response Complete (Fallback Mode)',
            } satisfies ProgressAnnotation);

            return;
          }

          // Re-throw other errors to be handled by the outer catch block
          throw error;
        }

        (async () => {
          for await (const part of result.fullStream) {
            streamRecovery.updateActivity();

            if (part.type === 'error') {
              const error: any = part.error;
              logger.error('Streaming error:', error);
              streamRecovery.stop();

              // Enhanced error handling for common streaming issues
              if (error.message?.includes('Invalid JSON response')) {
                logger.error('Invalid JSON response detected - likely malformed API response');
              } else if (error.message?.includes('token')) {
                logger.error('Token-related error detected - possible token limit exceeded');
              }

              return;
            }
          }
          streamRecovery.stop();
        })();
        result.mergeIntoDataStream(dataStream);
      },
      onError: (error: any) => {
        // Provide more specific error messages for common issues
        const errorMessage = error.message || 'Unknown error';
        const errorCode = error.code || error.status || 'UNKNOWN';

        // Log the full error for debugging
        logger.error('Stream error details:', {
          message: errorMessage,
          code: errorCode,
          stack: error.stack,
          type: error.type,
        });

        if (errorMessage.includes('model') && errorMessage.includes('not found')) {
          return `Model Error: The selected model "${error.model || 'unknown'}" is not available through OpenRouter. Please check your model selection and try again. Available models include Grok, Qwen, Claude, GPT, and many others through OpenRouter.`;
        }

        if (errorMessage.includes('Invalid JSON response')) {
          return `API Response Error: The AI service returned malformed data. This could be due to model issues, API rate limiting, or server problems. Try selecting a different model or check your API key configuration.`;
        }

        const lowerErrorMessage = errorMessage.toLowerCase();

        if (
          lowerErrorMessage.includes('api key') ||
          lowerErrorMessage.includes('unauthorized') ||
          lowerErrorMessage.includes('authentication') ||
          errorCode === 401
        ) {
          return `Authentication Error: Invalid or missing OpenRouter API key. Please check your API key configuration in the settings. You can get your API key from https://openrouter.ai/settings/keys`;
        }

        if ((errorMessage.includes('token') && errorMessage.includes('limit')) || errorCode === 400) {
          return `Token Limit Error: The conversation has exceeded the token limit for the selected model. Try using a model with a larger context window or start a new conversation.`;
        }

        if (errorMessage.includes('rate limit') || errorMessage.includes('429') || errorCode === 429) {
          return `Rate Limit Error: Too many requests to the AI service. Please wait a moment before trying again. Consider upgrading your API plan if this persists.`;
        }

        if (errorMessage.includes('network') || errorMessage.includes('timeout') || errorCode === 'NETWORK_ERROR') {
          return `Network Error: Unable to connect to the AI service. Please check your internet connection and try again.`;
        }

        if (errorMessage.includes('Bad Request') || errorCode === 400) {
          // Only show this error for actual malformed requests, not for token limits
          if (!errorMessage.includes('token') && !errorMessage.includes('limit')) {
            return `Request Error: The request format is invalid. This might be due to malformed input or unsupported parameters. Please try rephrasing your request.`;
          }
        }

        if (errorCode === 500) {
          return `Server Error: The AI service is experiencing internal issues. Please try again in a few moments.`;
        }

        // Provide more context for unknown errors, but be more helpful
        if (errorMessage.includes('timeout') || errorMessage.includes('connection')) {
          return `Connection Error: The request timed out or failed to connect. Please try again in a moment.`;
        }

        // For any other unknown errors, provide a generic but helpful message
        return `An error occurred: ${errorMessage}. Please try again or contact support if the issue persists.`;
      },
    }).pipeThrough(
      new TransformStream({
        transform: (chunk, controller) => {
          if (!lastChunk) {
            lastChunk = ' ';
          }

          if (typeof chunk === 'string') {
            if (chunk.startsWith('g') && !lastChunk.startsWith('g')) {
              controller.enqueue(encoder.encode(`0: "<div class=\\"__coderxThought__\\">"\n`));
            }

            if (lastChunk.startsWith('g') && !chunk.startsWith('g')) {
              controller.enqueue(encoder.encode(`0: "</div>\\n"\n`));
            }
          }

          lastChunk = chunk;

          let transformedChunk = chunk;

          if (typeof chunk === 'string' && chunk.startsWith('g')) {
            let content = chunk.split(':').slice(1).join(':');

            if (content.endsWith('\n')) {
              content = content.slice(0, content.length - 1);
            }

            transformedChunk = `0:${content}\n`;
          }

          // Convert the string stream to a byte stream
          const str = typeof transformedChunk === 'string' ? transformedChunk : JSON.stringify(transformedChunk);
          controller.enqueue(encoder.encode(str));
        },
      }),
    );

    return new Response(dataStream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
        'Text-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    logger.error('Main catch block error:', {
      message: error.message,
      statusCode: error.statusCode,
      status: error.status,
      code: error.code,
      type: error.type,
      stack: error.stack,
    });

    const errorResponse = {
      error: true,
      message: error.message || 'An unexpected error occurred',
      statusCode: error.statusCode || 500,
      isRetryable: error.isRetryable !== false, // Default to retryable unless explicitly false
      provider: error.provider || 'unknown',
    };

    if (error.message?.includes('API key')) {
      return new Response(
        JSON.stringify({
          ...errorResponse,
          message: 'Invalid or missing API key',
          statusCode: 401,
          isRetryable: false,
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
          statusText: 'Unauthorized',
        },
      );
    }

    // Handle billing errors in outer catch block as well
    if (
      error.message?.includes('Payment Required') ||
      error.message?.includes('payment') ||
      error.message?.includes('billing') ||
      error.message?.includes('quota') ||
      error.message?.includes('credit') ||
      error.message?.includes('insufficient') ||
      error.message?.includes('exceeded') ||
      error.message?.includes('limit') ||
      error.statusCode === 402 ||
      error.status === 402 ||
      error.code === 402
    ) {
      logger.warn('Billing error detected in outer catch, falling back to default chatbot:', {
        message: error.message,
        statusCode: error.statusCode,
        status: error.status,
        code: error.code,
      });

      // Create a simple response stream with default chatbot response
      const defaultResponse = generateDefaultResponse('Hello');
      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`0: ${defaultResponse}\n`));
          controller.close();
        },
      });

      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          Connection: 'keep-alive',
          'Cache-Control': 'no-cache',
        },
      });
    }

    return new Response(JSON.stringify(errorResponse), {
      status: errorResponse.statusCode,
      headers: { 'Content-Type': 'application/json' },
      statusText: 'Error',
    });
  }
}
