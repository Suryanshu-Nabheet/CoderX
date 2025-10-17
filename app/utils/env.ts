// Environment variables utility
export const getEnvVar = (key: string): string | undefined => {
  if (typeof window !== 'undefined') {
    // Client-side: return undefined for security
    return undefined;
  }

  // Server-side: return the actual environment variable
  return process.env[key];
};

export const getApiKey = (provider: string): string | undefined => {
  const keyMap: Record<string, string> = {
    openai: 'OPENAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    google: 'GOOGLE_API_KEY',
    cohere: 'COHERE_API_KEY',
    groq: 'GROQ_API_KEY',
    huggingface: 'HUGGINGFACE_API_KEY',
    together: 'TOGETHER_API_KEY',
    perplexity: 'PERPLEXITY_API_KEY',
    deepseek: 'DEEPSEEK_API_KEY',
    mistral: 'MISTRAL_API_KEY',
    moonshot: 'MOONSHOT_API_KEY',
    xai: 'XAI_API_KEY',
    'amazon-bedrock': 'AWS_ACCESS_KEY_ID',
    github: 'GITHUB_TOKEN',
    gitlab: 'GITLAB_TOKEN',
    supabase: 'SUPABASE_URL',
    netlify: 'NETLIFY_TOKEN',
    vercel: 'VERCEL_TOKEN',
  };

  const envKey = keyMap[provider.toLowerCase()];

  return envKey ? getEnvVar(envKey) : undefined;
};

export const hasApiKey = (provider: string): boolean => {
  const key = getApiKey(provider);
  return key !== undefined && key.trim() !== '';
};

export const getAvailableProviders = (): string[] => {
  const providers = [
    'openai',
    'anthropic',
    'google',
    'cohere',
    'groq',
    'huggingface',
    'together',
    'perplexity',
    'deepseek',
    'mistral',
    'moonshot',
    'xai',
    'amazon-bedrock',
    'github',
    'gitlab',
    'supabase',
    'netlify',
    'vercel',
  ];

  return providers.filter((provider) => hasApiKey(provider));
};
