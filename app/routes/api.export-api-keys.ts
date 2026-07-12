import { json } from '@remix-run/node';
import { LLMManager } from '~/lib/modules/llm/manager';
import { getApiKeysFromCookie } from '~/lib/api/cookies';
import { withSecurity } from '~/lib/security';

async function exportApiKeysLoader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get('Cookie');
  const apiKeysFromCookie = getApiKeysFromCookie(cookieHeader);
  const llmManager = LLMManager.getInstance(process.env as Record<string, string>);
  const providers = llmManager.getAllProviders();
  const apiKeys: Record<string, string> = { ...apiKeysFromCookie };

  for (const provider of providers) {
    if (!provider.config.apiTokenKey) {
      continue;
    }

    const envVarName = provider.config.apiTokenKey;

    if (apiKeys[provider.name]) {
      continue;
    }

    const envValue = process.env?.[envVarName] || process.env[envVarName] || llmManager.env[envVarName];

    if (envValue) {
      apiKeys[provider.name] = envValue;
    }
  }

  return json(apiKeys);
}

export const loader = withSecurity(exportApiKeysLoader, {
  rateLimit: true,
  allowedMethods: ['GET'],
});
