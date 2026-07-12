import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAvailableProvidersFromEnv, getEnvApiKey, hasEnvApiKey, loadApiKeysFromEnv } from '~/lib/utils/env-api-keys';

describe('env-api-keys', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('loads provider API keys from process.env', () => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-test-openai');
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test-anthropic');

    const keys = loadApiKeysFromEnv(process.env as Record<string, string>);

    expect(keys.OpenAI).toBe('sk-test-openai');
    expect(keys.Anthropic).toBe('sk-test-anthropic');
  });

  it('ignores empty env values', () => {
    vi.stubEnv('OPENAI_API_KEY', '   ');

    const keys = loadApiKeysFromEnv(process.env as Record<string, string>);

    expect(keys.OpenAI).toBeUndefined();
  });

  it('checks whether a provider has an env key', () => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-test-openai');

    expect(hasEnvApiKey('OpenAI', process.env as Record<string, string>)).toBe(true);
    expect(hasEnvApiKey('Anthropic', process.env as Record<string, string>)).toBe(false);
  });

  it('returns a single provider env key', () => {
    vi.stubEnv('GROQ_API_KEY', 'gsk-test');

    expect(getEnvApiKey('Groq', process.env as Record<string, string>)).toBe('gsk-test');
  });

  it('lists providers with configured env keys', () => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-test-openai');
    vi.stubEnv('GROQ_API_KEY', 'gsk-test');

    const providers = getAvailableProvidersFromEnv(process.env as Record<string, string>);

    expect(providers).toContain('OpenAI');
    expect(providers).toContain('Groq');
  });
});
