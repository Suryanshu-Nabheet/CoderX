import { LLMManager } from '~/lib/modules/llm/manager';

export type EnvApiKeys = Record<string, string>;

/**
 * Load API keys from environment variables for all registered LLM providers.
 * Server-side only — loads API keys from process.env and LLMManager env.
 */
export function loadApiKeysFromEnv(env?: Record<string, string>): EnvApiKeys {
  const llmManager = LLMManager.getInstance(env ?? {});
  const apiKeys: EnvApiKeys = {};

  for (const provider of llmManager.getAllProviders()) {
    const envVarName = provider.config.apiTokenKey;

    if (!envVarName) {
      continue;
    }

    const envValue = env?.[envVarName] || process.env[envVarName] || llmManager.env[envVarName];

    if (typeof envValue === 'string' && envValue.trim().length > 0) {
      apiKeys[provider.name] = envValue;
    }
  }

  return apiKeys;
}

export function hasEnvApiKey(providerName: string, env?: Record<string, string>): boolean {
  const apiKeys = loadApiKeysFromEnv(env);
  return Boolean(apiKeys[providerName]);
}

export function getEnvApiKey(providerName: string, env?: Record<string, string>): string | undefined {
  return loadApiKeysFromEnv(env)[providerName];
}

export function getAvailableProvidersFromEnv(env?: Record<string, string>): string[] {
  return Object.keys(loadApiKeysFromEnv(env));
}
