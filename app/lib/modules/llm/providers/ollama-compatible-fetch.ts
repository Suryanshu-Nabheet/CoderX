type OllamaResponseChunk = Record<string, unknown> & {
  done?: boolean;
  eval_count?: number;
  eval_duration?: number;
};

/**
 * Ollama occasionally omits `eval_duration` (and sometimes `eval_count`) on final
 * stream chunks — especially for empty assistant content or cloud models.
 * ollama-ai-provider validates these fields as required, so we normalize them here.
 *
 * @see https://github.com/sgomez/ollama-ai-provider/issues/38
 * @see https://github.com/ollama/ollama/issues/8553
 */
export function patchOllamaResponse(chunk: OllamaResponseChunk): OllamaResponseChunk {
  if (chunk.done !== true) {
    return chunk;
  }

  const patched = { ...chunk };

  if (patched.eval_duration === undefined) {
    patched.eval_duration = 0;
  }

  if (patched.eval_count === undefined) {
    patched.eval_count = 0;
  }

  return patched;
}

function isOllamaStreamingRequest(init?: RequestInit): boolean {
  if (!init?.body || typeof init.body !== 'string') {
    return true;
  }

  try {
    const body = JSON.parse(init.body) as { stream?: boolean };
    return body.stream !== false;
  } catch {
    return true;
  }
}

function patchOllamaResponseText(text: string): string {
  try {
    const json = JSON.parse(text) as OllamaResponseChunk;
    return JSON.stringify(patchOllamaResponse(json));
  } catch {
    return text;
  }
}

function createOllamaStreamingBody(source: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = source.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();

      if (done) {
        if (buffer.length > 0) {
          controller.enqueue(encoder.encode(`${patchOllamaResponseText(buffer)}\n`));
        }

        controller.close();
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.trim()) {
          continue;
        }

        controller.enqueue(encoder.encode(`${patchOllamaResponseText(line)}\n`));
      }
    },
  });
}

export function createOllamaCompatibleFetch(baseFetch: typeof fetch = fetch): typeof fetch {
  return async (input, init) => {
    const response = await baseFetch(input, init);

    if (!response.body || !response.ok) {
      return response;
    }

    if (!isOllamaStreamingRequest(init)) {
      const text = await response.text();

      return new Response(patchOllamaResponseText(text), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    return new Response(createOllamaStreamingBody(response.body), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  };
}
