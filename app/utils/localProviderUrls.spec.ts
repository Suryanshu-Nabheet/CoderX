import { describe, expect, it } from 'vitest';
import { normalizeOllamaBaseUrl } from './localProviderUrls';

describe('normalizeOllamaBaseUrl', () => {
  it('keeps a standard base URL unchanged', () => {
    expect(normalizeOllamaBaseUrl('http://127.0.0.1:11434')).toBe('http://127.0.0.1:11434');
  });

  it('removes a trailing API path and slash', () => {
    expect(normalizeOllamaBaseUrl('http://localhost:11434/api/')).toBe('http://localhost:11434');
  });

  it('handles whitespace and uppercase API paths', () => {
    expect(normalizeOllamaBaseUrl('  http://localhost:11434/API  ')).toBe('http://localhost:11434');
  });
});
