/**
 * Environment API Key Manager
 * Handles loading API keys from environment variables
 */

export interface EnvApiKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
  azure_openai?: string;
  azure_openai_endpoint?: string;
  cohere?: string;
  huggingface?: string;
  groq?: string;
  mistral?: string;
  perplexity?: string;
  deepseek?: string;
  ollama_base_url?: string;
  supabase_url?: string;
  supabase_anon_key?: string;
  netlify_access_token?: string;
  vercel_access_token?: string;
  github_token?: string;
  gitlab_token?: string;
  mcp_server_url?: string;
  mcp_server_token?: string;
}

/**
 * Load API keys from environment variables
 * This function should be called on the server side
 */
export function loadApiKeysFromEnv(): EnvApiKeys {
  return {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    google: process.env.GOOGLE_API_KEY,
    azure_openai: process.env.AZURE_OPENAI_API_KEY,
    azure_openai_endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    cohere: process.env.COHERE_API_KEY,
    huggingface: process.env.HUGGINGFACE_API_KEY,
    groq: process.env.GROQ_API_KEY,
    mistral: process.env.MISTRAL_API_KEY,
    perplexity: process.env.PERPLEXITY_API_KEY,
    deepseek: process.env.DEEPSEEK_API_KEY,
    ollama_base_url: process.env.OLLAMA_BASE_URL,
    supabase_url: process.env.SUPABASE_URL,
    supabase_anon_key: process.env.SUPABASE_ANON_KEY,
    netlify_access_token: process.env.NETLIFY_ACCESS_TOKEN,
    vercel_access_token: process.env.VERCEL_ACCESS_TOKEN,
    github_token: process.env.GITHUB_TOKEN,
    gitlab_token: process.env.GITLAB_TOKEN,
    mcp_server_url: process.env.MCP_SERVER_URL,
    mcp_server_token: process.env.MCP_SERVER_TOKEN,
  };
}

/**
 * Check if a specific provider has an API key set in environment variables
 */
export function hasEnvApiKey(providerName: string): boolean {
  const envKeys = loadApiKeysFromEnv();

  const providerKeyMap: Record<string, keyof EnvApiKeys> = {
    openai: 'openai',
    anthropic: 'anthropic',
    google: 'google',
    'azure-openai': 'azure_openai',
    cohere: 'cohere',
    huggingface: 'huggingface',
    groq: 'groq',
    mistral: 'mistral',
    perplexity: 'perplexity',
    deepseek: 'deepseek',
    ollama: 'ollama_base_url',
  };

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

  const providerKeyMap: Record<string, keyof EnvApiKeys> = {
    openai: 'openai',
    anthropic: 'anthropic',
    google: 'google',
    'azure-openai': 'azure_openai',
    cohere: 'cohere',
    huggingface: 'huggingface',
    groq: 'groq',
    mistral: 'mistral',
    perplexity: 'perplexity',
    deepseek: 'deepseek',
    ollama: 'ollama_base_url',
  };

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
  const providers = [
    'openai',
    'anthropic',
    'google',
    'azure-openai',
    'cohere',
    'huggingface',
    'groq',
    'mistral',
    'perplexity',
    'deepseek',
    'ollama',
  ];

  return providers.filter((provider) => hasEnvApiKey(provider));
}
