/**
 * Environment API Key Manager
 * Handles loading API keys from environment variables
 */

export interface EnvApiKeys {
  openrouter?: string;
}

/**
 * Load API keys from environment variables
 * This function should be called on the server side
 */
export function loadApiKeysFromEnv(env?: Record<string, string>): EnvApiKeys {
  return {
    openrouter: env?.OPEN_ROUTER_API_KEY || process.env.OPEN_ROUTER_API_KEY,
  };
}

/**
 * Check if a specific provider has an API key set in environment variables
 */
export function hasEnvApiKey(providerName: string): boolean {
  const envKeys = loadApiKeysFromEnv();

  const providerKeyMap: Record<string, keyof EnvApiKeys> = { openrouter: 'openrouter' };

  const envKey = providerKeyMap[providerName.toLowerCase()];

  if (!envKey) {
    return false;
  }

  const keyValue = envKeys[envKey];

  return Boolean(keyValue && keyValue.trim() !== '');
}

/**
 * Get API key for a specific provider from environment variables
 */
export function getEnvApiKey(providerName: string): string | undefined {
  const envKeys = loadApiKeysFromEnv();

  const providerKeyMap: Record<string, keyof EnvApiKeys> = { openrouter: 'openrouter' };

  const envKey = providerKeyMap[providerName.toLowerCase()];

  if (!envKey) {
    return undefined;
  }

  return envKeys[envKey];
}

/**
 * Get all available providers that have API keys set in environment variables
 */
export function getAvailableProvidersFromEnv(): string[] {
  const providers = ['openrouter'];

  return providers.filter((provider) => hasEnvApiKey(provider));
}
