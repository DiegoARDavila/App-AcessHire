import { createPublicKey, verify } from 'node:crypto';

// Valida o ID token do Firebase (JWT RS256) sem precisar de chave de serviço:
// confere assinatura com as chaves públicas do Google, emissor, público e validade.

const JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

let cache = { chaves: null, ate: 0 };

export async function buscarChavesGoogle(forcar = false, fetchFn = fetch) {
  const agora = Date.now();
  if (!forcar && cache.chaves && agora < cache.ate) return cache.chaves;

  const resp = await fetchFn(JWKS_URL);
  if (!resp.ok) throw new Error('jwks-indisponivel');
  const { keys } = await resp.json();
  cache = { chaves: keys, ate: agora + 60 * 60 * 1000 };
  return keys;
}

function decodificar(parte) {
  return JSON.parse(Buffer.from(parte, 'base64url').toString('utf8'));
}

export async function verificarTokenFirebase(
  token,
  { projectId, buscarJwks = buscarChavesGoogle, agora = () => Math.floor(Date.now() / 1000) }
) {
  if (!projectId) throw new Error('projeto-nao-configurado');
  if (typeof token !== 'string') throw new Error('token-invalido');

  const partes = token.split('.');
  if (partes.length !== 3) throw new Error('token-invalido');

  let header, payload;
  try {
    header = decodificar(partes[0]);
    payload = decodificar(partes[1]);
  } catch {
    throw new Error('token-invalido');
  }

  if (header.alg !== 'RS256' || !header.kid) throw new Error('token-invalido');

  let chaves = await buscarJwks();
  let jwk = chaves.find((k) => k.kid === header.kid);
  if (!jwk) {
    chaves = await buscarJwks(true); // o Google troca as chaves de tempos em tempos
    jwk = chaves.find((k) => k.kid === header.kid);
  }
  if (!jwk) throw new Error('token-invalido');

  const assinaturaOk = verify(
    'RSA-SHA256',
    Buffer.from(`${partes[0]}.${partes[1]}`),
    createPublicKey({ key: jwk, format: 'jwk' }),
    Buffer.from(partes[2], 'base64url')
  );
  if (!assinaturaOk) throw new Error('token-invalido');

  const t = agora();
  const folga = 300; // 5 min de tolerância de relógio
  if (typeof payload.exp !== 'number' || payload.exp <= t - folga) throw new Error('token-expirado');
  if (typeof payload.iat !== 'number' || payload.iat > t + folga) throw new Error('token-invalido');
  if (payload.aud !== projectId) throw new Error('token-invalido');
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error('token-invalido');
  if (typeof payload.sub !== 'string' || payload.sub.length === 0) throw new Error('token-invalido');

  return payload;
}
