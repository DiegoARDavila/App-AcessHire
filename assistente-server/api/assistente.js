import { criarHandler } from '../lib/handler.js';

const handler = criarHandler({
  projectId: process.env.FIREBASE_PROJECT_ID,
  apiKey: process.env.GEMINI_API_KEY,
  modelo: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
});

export function POST(request) {
  return handler(request);
}
