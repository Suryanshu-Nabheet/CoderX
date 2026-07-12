import { describe, expect, it } from 'vitest';
import { createOllamaCompatibleFetch, patchOllamaResponse } from './ollama-compatible-fetch';

describe('patchOllamaResponse', () => {
  it('adds missing eval fields on done chunks', () => {
    const patched = patchOllamaResponse({
      done: true,
      eval_count: 118,
      message: { role: 'assistant', content: '' },
    });

    expect(patched.eval_duration).toBe(0);
    expect(patched.eval_count).toBe(118);
  });

  it('leaves in-progress chunks unchanged', () => {
    const chunk = {
      done: false,
      message: { role: 'assistant', content: 'Hi' },
    };

    expect(patchOllamaResponse(chunk)).toEqual(chunk);
  });
});

describe('createOllamaCompatibleFetch', () => {
  it('patches non-streaming responses', async () => {
    const payload = {
      model: 'minimax-m3',
      done: true,
      done_reason: 'stop',
      total_duration: 100,
      prompt_eval_count: 10,
      eval_count: 1,
      message: { role: 'assistant', content: '' },
    };

    const baseFetch = async () =>
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    const response = await createOllamaCompatibleFetch(baseFetch as typeof fetch)('http://127.0.0.1:11434/api/chat', {
      method: 'POST',
      body: JSON.stringify({ model: 'minimax-m3', stream: false }),
    });

    const json = (await response.json()) as { eval_duration: number };
    expect(json.eval_duration).toBe(0);
  });

  it('patches streaming final chunks', async () => {
    const streamBody = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            `${JSON.stringify({
              done: true,
              eval_count: 2,
              total_duration: 100,
              model: 'minimax-m3',
            })}\n`,
          ),
        );
        controller.close();
      },
    });

    const baseFetch = async () =>
      new Response(streamBody, {
        status: 200,
        headers: { 'Content-Type': 'application/x-ndjson' },
      });

    const response = await createOllamaCompatibleFetch(baseFetch as typeof fetch)('http://127.0.0.1:11434/api/chat', {
      method: 'POST',
      body: JSON.stringify({ model: 'minimax-m3' }),
    });

    const text = await response.text();
    const json = JSON.parse(text.trim()) as { eval_duration: number };
    expect(json.eval_duration).toBe(0);
  });
});
