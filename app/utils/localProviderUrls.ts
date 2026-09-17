/**
 * Normalize a local provider base URL before appending its API path.
 *
 * Ollama accepts both `http://host:11434` and `http://host:11434/api` in
 * configuration. Keeping the stored value flexible while normalizing at the
 * request boundary prevents accidental `/api/api/...` URLs.
 */
export function normalizeOllamaBaseUrl(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, '');

  return trimmed.replace(/\/api$/i, '');
}
