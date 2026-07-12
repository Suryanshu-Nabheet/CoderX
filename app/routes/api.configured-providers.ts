import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { LLMManager } from '~/lib/modules/llm/manager';
import { LOCAL_PROVIDERS } from '~/lib/stores/settings';

interface ConfiguredProvider {
  name: string;
  isConfigured: boolean;
  configMethod: 'environment' | 'none';
}

interface ConfiguredProvidersResponse {
  providers: ConfiguredProvider[];
}

async function isLocalProviderReachable(baseUrl: string): Promise<boolean> {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
  const healthPath = normalizedBaseUrl.includes('/v1')
    ? `${normalizedBaseUrl}/models`
    : `${normalizedBaseUrl}/api/tags`;

  try {
    const response = await fetch(healthPath, {
      signal: AbortSignal.timeout(2000),
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * API endpoint that detects which local providers are configured via environment
 * variables or reachable at their default localhost URLs.
 */
export const loader: LoaderFunction = async () => {
  try {
    const llmManager = LLMManager.getInstance(process.env as Record<string, string>);
    const configuredProviders: ConfiguredProvider[] = [];

    // Check each local provider for environment configuration
    for (const providerName of LOCAL_PROVIDERS) {
      const providerInstance = llmManager.getProvider(providerName);
      let isConfigured = false;
      let configMethod: 'environment' | 'none' = 'none';

      if (providerInstance) {
        const config = providerInstance.config;

        /*
         * Check if required environment variables are set
         * For providers with baseUrlKey (Ollama, LMStudio, OpenAILike)
         */
        if (config.baseUrlKey) {
          const baseUrlEnvVar = config.baseUrlKey;
          const envBaseUrl = process.env[baseUrlEnvVar] || llmManager.env[baseUrlEnvVar];

          /*
           * Only consider configured if environment variable is explicitly set
           * Don't count default config.baseUrl values or placeholder values
           */
          const isValidEnvValue =
            envBaseUrl &&
            typeof envBaseUrl === 'string' &&
            envBaseUrl.trim().length > 0 &&
            !envBaseUrl.includes('your_') && // Filter out placeholder values like "your_openai_like_base_url_here"
            !envBaseUrl.includes('_here') &&
            envBaseUrl.startsWith('http'); // Must be a valid URL

          if (isValidEnvValue) {
            isConfigured = true;
            configMethod = 'environment';
          } else if (config.baseUrl) {
            isConfigured = await isLocalProviderReachable(config.baseUrl);
            configMethod = isConfigured ? 'environment' : 'none';
          }
        }

        // For providers that might need API keys as well (check this separately, not as fallback)
        if (config.apiTokenKey && !isConfigured) {
          const apiTokenEnvVar = config.apiTokenKey;
          const envApiToken = process.env[apiTokenEnvVar] || llmManager.env[apiTokenEnvVar];

          // Only consider configured if API key is set and not a placeholder
          const isValidApiToken =
            envApiToken &&
            typeof envApiToken === 'string' &&
            envApiToken.trim().length > 0 &&
            !envApiToken.includes('your_') && // Filter out placeholder values
            !envApiToken.includes('_here') &&
            envApiToken.length > 10; // API keys are typically longer than 10 chars

          if (isValidApiToken) {
            isConfigured = true;
            configMethod = 'environment';
          }
        }
      }

      configuredProviders.push({
        name: providerName,
        isConfigured,
        configMethod,
      });
    }

    return json<ConfiguredProvidersResponse>({
      providers: configuredProviders,
    });
  } catch (error) {
    console.error('Error detecting configured providers:', error);

    // Return default state on error
    return json<ConfiguredProvidersResponse>({
      providers: LOCAL_PROVIDERS.map((name) => ({
        name,
        isConfigured: false,
        configMethod: 'none' as const,
      })),
    });
  }
};
