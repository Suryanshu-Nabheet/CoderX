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
export function loadApiKeysFromEnv(_env?: Record<string, string>): EnvApiKeys {
  return {};
}

/**
 * Check if a specific provider has an API key set in environment variables
 */
export function hasEnvApiKey(_providerName: string): boolean {
  return false;
}

/**
 * Get API key for a specific provider from environment variables
 */
export function getEnvApiKey(_providerName: string): string | undefined {
  return undefined;
}

/**
 * Get all available providers that have API keys set in environment variables
 */
export function getAvailableProvidersFromEnv(): string[] {
  return [];
}
