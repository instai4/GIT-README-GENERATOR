// Standard Node.js serverless function (more reliable than Edge on free tier)

const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro',
];

export default async function handler(req, res) {

  // CORS headers so browser can call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not set in Vercel environment variables.' });
  }

  const { prompt, model: requestedModel } = req.body || {};

  if (!prompt) return res.status(400).json({ error: 'No prompt provided.' });

  // Deduplicated model list
  const models = [requestedModel, ...MODELS].filter((v, i, a) => v && a.indexOf(v) === i);

  const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
  const geminiBody = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: 4096, temperature: 0.7 },
  });

  let lastError = '';

  for (const model of models) {
    try {
      const apiRes = await fetch(
        `${BASE}/${model}:generateContent?key=${API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: geminiBody }
      );

      const data = await apiRes.json();

      if (!apiRes.ok) {
        lastError = data?.error?.message || `HTTP ${apiRes.status}`;
        // quota/not-found → try next model
        if (apiRes.status === 429 || apiRes.status === 404 || apiRes.status === 400) continue;
        // other error → stop
        return res.status(apiRes.status).json({ error: lastError });
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text) { lastError = 'Empty response from model'; continue; }

      return res.status(200).json({ text, model });

    } catch (e) {
      lastError = e.message;
      continue;
    }
  }

  return res.status(500).json({ error: `All models failed. Last error: ${lastError}` });
}