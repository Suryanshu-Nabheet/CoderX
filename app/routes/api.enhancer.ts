import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { streamText } from '~/lib/.server/llm/stream-text';
import { stripIndents } from '~/utils/stripIndent';
import type { ProviderInfo } from '~/types/model';
import { getApiKeysFromCookie, getProviderSettingsFromCookie } from '~/lib/api/cookies';
import { loadApiKeysFromEnv } from '~/lib/utils/env-api-keys';
import { createScopedLogger } from '~/utils/logger';

export async function action(args: ActionFunctionArgs) {
  return enhancerAction(args);
}

const logger = createScopedLogger('api.enhancher');

/**
 * Simple prompt enhancement fallback when no API keys are available
 */
function enhancePromptFallback(message: string): string {
  // Basic prompt enhancement rules
  let enhanced = message.trim();

  // Add context if the prompt is too short
  if (enhanced.length < 20) {
    enhanced = `Please provide more details about: ${enhanced}`;
    return enhanced;
  }

  // Add specificity if the prompt lacks detail
  if (
    !enhanced.includes('?') &&
    !enhanced.includes('please') &&
    !enhanced.includes('how') &&
    !enhanced.includes('what')
  ) {
    enhanced = `Please explain: ${enhanced}`;
    return enhanced;
  }

  // Add action-oriented language if missing
  if (
    !enhanced.toLowerCase().includes('create') &&
    !enhanced.toLowerCase().includes('build') &&
    !enhanced.toLowerCase().includes('make') &&
    !enhanced.toLowerCase().includes('generate')
  ) {
    if (
      enhanced.toLowerCase().includes('app') ||
      enhanced.toLowerCase().includes('website') ||
      enhanced.toLowerCase().includes('project')
    ) {
      enhanced = `Create a ${enhanced}`;
    }
  }

  return enhanced;
}

async function enhancerAction({ context, request }: ActionFunctionArgs) {
  const { message, model, provider } = await request.json<{
    message: string;
    model: string;
    provider: ProviderInfo;
    apiKeys?: Record<string, string>;
  }>();

  const { name: providerName } = provider;

  // validate 'model' and 'provider' fields
  if (!model || typeof model !== 'string') {
    throw new Response('Invalid or missing model', {
      status: 400,
      statusText: 'Bad Request',
    });
  }

  if (!providerName || typeof providerName !== 'string') {
    throw new Response('Invalid or missing provider', {
      status: 400,
      statusText: 'Bad Request',
    });
  }

  const cookieHeader = request.headers.get('Cookie');
  const cookieApiKeys = getApiKeysFromCookie(cookieHeader);
  const providerSettings = getProviderSettingsFromCookie(cookieHeader);

  // Merge environment API keys as fallback
  const envApiKeys = loadApiKeysFromEnv();
  const apiKeys = { ...envApiKeys, ...cookieApiKeys };

  // Check if we have any API keys available
  const hasApiKey =
    Object.keys(apiKeys).length > 0 &&
    Object.values(apiKeys).some((key) => key && typeof key === 'string' && key.trim() !== '');

  // If no API keys are available, provide a simple enhancement fallback
  if (!hasApiKey) {
    const enhancedPrompt = enhancePromptFallback(message);
    return new Response(enhancedPrompt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  try {
    const result = await streamText({
      messages: [
        {
          role: 'user',
          content:
            `[Model: ${model}]\n\n[Provider: ${providerName}]\n\n` +
            stripIndents`
            You are a professional prompt engineer specializing in crafting precise, effective prompts.
            Your task is to enhance prompts by making them more specific, actionable, and effective.

            I want you to improve the user prompt that is wrapped in \`<original_prompt>\` tags.

            For valid prompts:
            - Make instructions explicit and unambiguous
            - Add relevant context and constraints
            - Remove redundant information
            - Maintain the core intent
            - Ensure the prompt is self-contained
            - Use professional language

            For invalid or unclear prompts:
            - Respond with clear, professional guidance
            - Keep responses concise and actionable
            - Maintain a helpful, constructive tone
            - Focus on what the user should provide
            - Use a standard template for consistency

            IMPORTANT: Your response must ONLY contain the enhanced prompt text.
            Do not include any explanations, metadata, or wrapper tags.

            <original_prompt>
              ${message}
            </original_prompt>
          `,
        },
      ],
      env: context.cloudflare?.env as any,
      apiKeys,
      providerSettings,
      options: {
        system:
          'You are a senior software principal architect, you should help the user analyse the user query and enrich it with the necessary context and constraints to make it more specific, actionable, and effective. You should also ensure that the prompt is self-contained and uses professional language. Your response should ONLY contain the enhanced prompt text. Do not include any explanations, metadata, or wrapper tags.',

        /*
         * onError: (event) => {
         *   throw new Response(null, {
         *     status: 500,
         *     statusText: 'Internal Server Error',
         *   });
         * }
         */
      },
    });

    // Handle streaming errors in a non-blocking way
    (async () => {
      try {
        for await (const part of result.fullStream) {
          if (part.type === 'error') {
            const error: any = part.error;
            logger.error('Streaming error:', error);
            break;
          }
        }
      } catch (error) {
        logger.error('Error processing stream:', error);
      }
    })();

    // Return the text stream directly since it's already text data
    return new Response(result.textStream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    console.log(error);

    if (error instanceof Error) {
      // Handle specific error types with helpful messages
      if (error.message?.includes('API key')) {
        throw new Response('Invalid or missing API key', {
          status: 401,
          statusText: 'Unauthorized',
        });
      }

      if (error.message?.includes('rate limit') || error.message?.includes('429')) {
        throw new Response('Rate limit exceeded. Please try again in a moment.', {
          status: 429,
          statusText: 'Too Many Requests',
        });
      }

      if (
        error.message?.includes('Payment Required') ||
        error.message?.includes('payment') ||
        error.message?.includes('billing') ||
        error.message?.includes('quota') ||
        error.message?.includes('credit') ||
        error.message?.includes('402')
      ) {
        // Fall back to simple enhancement when billing issues occur
        logger.warn('Billing error detected, falling back to simple enhancement:', error.message);

        const enhancedPrompt = enhancePromptFallback(message);

        return new Response(enhancedPrompt, {
          status: 200,
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      }

      if (error.message?.includes('token') || error.message?.includes('limit')) {
        throw new Response('Token limit exceeded. Please try with a shorter prompt.', {
          status: 400,
          statusText: 'Bad Request',
        });
      }

      if (error.message?.includes('network') || error.message?.includes('timeout')) {
        throw new Response('Network error. Please check your connection and try again.', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      }
    }

    // Generic error fallback
    throw new Response('An error occurred while enhancing your prompt. Please try again.', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}
