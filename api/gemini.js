export const config = { runtime: 'edge' };

const MODELS_FALLBACK = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro',
];

export default async function handler(req) {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured on server.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { searchParams } = new URL(req.url);
  const requestedModel  = searchParams.get('model') || 'gemini-2.5-flash';
  const useStream       = searchParams.get('stream') !== 'false';

  const body = await req.json();
  const { prompt } = body;

  if (!prompt) {
    return new Response(JSON.stringify({ error: 'No prompt provided.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const geminiBody = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: 4096, temperature: 0.7 },
  });

  // Build deduplicated model list starting with the requested one
  const models = [requestedModel, ...MODELS_FALLBACK].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  for (const model of models) {
    try {
      const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

      if (useStream) {
        const res = await fetch(
          `${BASE}/${model}:streamGenerateContent?alt=sse&key=${API_KEY}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: geminiBody }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          // quota / not-found → try next model
          if (res.status === 429 || res.status === 404 || res.status === 400) continue;
          throw new Error(err?.error?.message || `HTTP ${res.status}`);
        }
        // Stream the SSE straight back to the browser
        return new Response(res.body, {
          status: 200,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'X-Model-Used': model,
          },
        });
      } else {
        const res = await fetch(
          `${BASE}/${model}:generateContent?key=${API_KEY}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: geminiBody }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          if (res.status === 429 || res.status === 404 || res.status === 400) continue;
          throw new Error(err?.error?.message || `HTTP ${res.status}`);
        }
        const data = await res.json();
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Model-Used': model,
          },
        });
      }
    } catch (e) {
      // last model - propagate error
      if (model === models[models.length - 1]) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }

  return new Response(JSON.stringify({ error: 'All models exhausted.' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}