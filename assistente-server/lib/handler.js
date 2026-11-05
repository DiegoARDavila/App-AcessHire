import { verificarTokenFirebase } from './firebaseAuth.js';
import { montarPrompt } from './prompt.js';

const MAX_MENSAGENS = 16;
const MAX_TEXTO = 2000;
const MAX_TOTAL = 12000;
const MAX_POR_MINUTO = 12;
const MAX_POR_DIA = 150;

function json(corpo, status = 200) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

// Limite simples por usuário, guardado na memória da instância. Não é perfeito
// (cada instância tem o seu contador), mas segura abuso básico.
function criarLimitador(agora) {
  const usos = new Map(); // uid -> { minuto: number[], dia: { chave, n } }
  return function permitir(uid) {
    const t = agora();
    const diaChave = new Date(t).toISOString().slice(0, 10);
    const u = usos.get(uid) ?? { minuto: [], dia: { chave: diaChave, n: 0 } };
    u.minuto = u.minuto.filter((x) => t - x < 60_000);
    if (u.dia.chave !== diaChave) u.dia = { chave: diaChave, n: 0 };
    if (u.minuto.length >= MAX_POR_MINUTO || u.dia.n >= MAX_POR_DIA) {
      usos.set(uid, u);
      return false;
    }
    u.minuto.push(t);
    u.dia.n += 1;
    usos.set(uid, u);
    return true;
  };
}

export function validarMensagens(bruto) {
  if (!Array.isArray(bruto) || bruto.length === 0) return null;

  const limpas = [];
  for (const m of bruto.slice(-MAX_MENSAGENS)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.text !== 'string') return null;
    const texto = m.text.trim().slice(0, MAX_TEXTO);
    if (!texto) continue;
    limpas.push({ role: m.role === 'assistant' ? 'model' : 'user', text: texto });
  }

  // o Gemini espera começar e terminar numa fala da pessoa
  while (limpas.length && limpas[0].role !== 'user') limpas.shift();
  if (limpas.length === 0 || limpas[limpas.length - 1].role !== 'user') return null;

  const total = limpas.reduce((soma, m) => soma + m.text.length, 0);
  if (total > MAX_TOTAL) return null;

  return limpas.map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
}

export async function chamarGemini({ apiKey, modelo, sistema, contents, fetchFn = fetch }) {
  const resp = await fetchFn(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sistema }] },
        contents,
        generationConfig: { maxOutputTokens: 900 },
      }),
      signal: AbortSignal.timeout(25_000),
    }
  );

  if (resp.status === 429) throw Object.assign(new Error('gemini-429'), { codigo: 429 });
  if (!resp.ok) {
    // não registramos o corpo inteiro para não vazar dados de conversas nos logs
    throw Object.assign(new Error(`gemini-${resp.status}`), { codigo: resp.status });
  }

  const dados = await resp.json();
  if (dados.promptFeedback?.blockReason) return { bloqueada: true };

  const texto = (dados.candidates?.[0]?.content?.parts ?? [])
    .map((p) => p.text ?? '')
    .join('')
    .trim();
  if (!texto) return { vazia: true };
  return { texto };
}

export function criarHandler({
  projectId,
  apiKey,
  modelo,
  verificar = verificarTokenFirebase,
  gemini = chamarGemini,
  agora = () => Date.now(),
}) {
  const permitir = criarLimitador(agora);

  return async function handler(request) {
    if (!apiKey || !projectId) return json({ erro: 'Servidor não configurado.' }, 500);

    const cabecalho = request.headers.get('authorization') ?? '';
    const token = cabecalho.startsWith('Bearer ') ? cabecalho.slice(7) : '';
    let uid;
    try {
      const payload = await verificar(token, { projectId });
      uid = payload.sub;
    } catch {
      return json({ erro: 'Faça login novamente para usar o assistente.' }, 401);
    }

    let corpo;
    try {
      corpo = await request.json();
    } catch {
      return json({ erro: 'Pedido inválido.' }, 400);
    }

    const contents = validarMensagens(corpo?.mensagens);
    if (!contents) return json({ erro: 'Mensagem inválida ou grande demais.' }, 400);

    if (!permitir(uid)) {
      return json({ erro: 'Muitas mensagens em pouco tempo. Aguarde um pouco e tente de novo.' }, 429);
    }

    const perfil = corpo?.perfil === 'company' ? 'company' : 'candidate';

    try {
      const r = await gemini({ apiKey, modelo, sistema: montarPrompt(perfil), contents });
      if (r.bloqueada) {
        return json({ texto: 'Não consegui responder a essa mensagem. Pode reformular de outro jeito?' });
      }
      if (r.vazia) return json({ erro: 'O assistente não conseguiu responder. Tente de novo.' }, 502);
      return json({ texto: r.texto });
    } catch (e) {
      console.log('Erro ao chamar o Gemini:', e?.message);
      if (e?.codigo === 429) {
        return json({ erro: 'O assistente está muito ocupado agora. Tente de novo em instantes.' }, 429);
      }
      return json({ erro: 'Não foi possível falar com o assistente agora.' }, 502);
    }
  };
}
