import { afterEach, describe, expect, it } from 'vitest';
import { LLMManager } from '~/lib/modules/llm/manager';

describe('LLMManager', () => {
  afterEach(() => {
    (LLMManager as unknown as { _instance?: LLMManager })._instance = undefined;
  });

  it('registers built-in providers', () => {
    const manager = LLMManager.getInstance({});

    const providerNames = manager.getAllProviders().map((provider) => provider.name);

    expect(providerNames).toContain('OpenAI');
    expect(providerNames).toContain('Anthropic');
    expect(providerNames).toContain('Google');
    expect(providerNames).toContain('Ollama');
  });

  it('returns static models for registered providers', () => {
    const manager = LLMManager.getInstance({});

    expect(manager.getModelList().length).toBeGreaterThan(0);
  });

  it('uses env values passed at initialization', () => {
    const manager = LLMManager.getInstance({ OPENAI_API_KEY: 'sk-test' });

    expect(manager.env.OPENAI_API_KEY).toBe('sk-test');
  });

  it('returns a default provider', () => {
    const manager = LLMManager.getInstance({});

    expect(manager.getDefaultProvider().name).toBeTruthy();
  });
});
