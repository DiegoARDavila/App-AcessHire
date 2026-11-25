import { getProfile } from './auth';

// Dados básicos (nome e detalhe) do outro lado de uma conversa ou candidatura,
// com cache para não ler o Firestore de novo a cada tela.
// tipo: 'candidate' | 'company'

const cache = new Map();

export function nomePadrao(tipo) {
  return tipo === 'company' ? 'Empresa' : 'Candidato';
}

export async function obterPerfilBasico(uid, tipo) {
  if (!uid) return { nome: nomePadrao(tipo), detalhe: null };

  const chave = `${tipo}:${uid}`;
  if (cache.has(chave)) return cache.get(chave);

  try {
    const perfil = await getProfile(uid, tipo);
    const basico =
      tipo === 'company'
        ? { nome: perfil?.nomeEmpresa || nomePadrao(tipo), detalhe: perfil?.setor || null }
        : { nome: perfil?.nome || nomePadrao(tipo), detalhe: perfil?.areaAtuacao || null };
    cache.set(chave, basico);
    return basico;
  } catch (e) {
    // não guarda no cache: na próxima tentativa pode funcionar
    console.log('Erro ao carregar perfil:', e);
    return { nome: nomePadrao(tipo), detalhe: null };
  }
}
