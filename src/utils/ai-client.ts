import { type AIProvider, AI_PROVIDERS } from '../types/ai';

interface AIRequestOptions {
  provider: AIProvider;
  apiKey: string;
  prompt: string;
  maxTokens?: number;
}

/**
 * Send a prompt to the selected AI provider and return the text response.
 */
export async function aiGenerate({ provider, apiKey, prompt, maxTokens = 1024 }: AIRequestOptions): Promise<string> {
  const config = AI_PROVIDERS.find(p => p.id === provider);
  if (!config) throw new Error(`Unknown provider: ${provider}`);

  switch (provider) {
    case 'anthropic':
      return callAnthropic(apiKey, config.model, prompt, maxTokens);
    case 'google':
      return callGoogle(apiKey, config.model, prompt, maxTokens);
    case 'openai':
      return callOpenAI('https://api.openai.com', apiKey, config.model, prompt, maxTokens);
    case 'xai':
      return callOpenAI('https://api.x.ai', apiKey, config.model, prompt, maxTokens);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Test an API key by sending a minimal request.
 */
export async function testAIKey(provider: AIProvider, apiKey: string): Promise<{ ok: boolean; message: string }> {
  try {
    const text = await aiGenerate({ provider, apiKey, prompt: 'Say "ok"', maxTokens: 16 });
    return { ok: !!text, message: text ? 'API key is valid!' : 'Empty response' };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ---- Provider implementations ----

async function callAnthropic(apiKey: string, model: string, prompt: string, maxTokens: number): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error?.message ?? `Anthropic API error: ${res.status}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

async function callGoogle(apiKey: string, model: string, prompt: string, maxTokens: number): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: maxTokens },
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error?.message ?? `Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

async function callOpenAI(baseUrl: string, apiKey: string, model: string, prompt: string, maxTokens: number): Promise<string> {
  const res = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error?.message ?? `API error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}
