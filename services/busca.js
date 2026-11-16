import { collection, getDocs, limit, query, where } from '@react-native-firebase/firestore';
import { db } from './firebase';
import { getUserRole } from './auth';

export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

// Empresa pesquisa candidatos; candidato pesquisa empresas.
// Só traz o mínimo necessário para a lista (nome, área/setor, cidade). Nada de dados sensíveis.
export async function carregarPerfisPesquisaveis(uid) {
  const role = await getUserRole(uid);
  const buscaCandidatos = role === 'company';
  const colecao = buscaCandidatos ? 'candidates' : 'companies';

  const snap = await getDocs(
    query(collection(db, colecao), where('profileCompleted', '==', true), limit(300))
  );

  const itens = snap.docs.map((d) => {
    const p = d.data();
    return buscaCandidatos
      ? {
          id: d.id,
          tipo: 'candidate',
          nome: p.nome ?? 'Candidato',
          linha1: p.areaAtuacao ?? '',
          linha2: p.formacao ?? '',
        }
      : {
          id: d.id,
          tipo: 'company',
          nome: p.nomeEmpresa ?? 'Empresa',
          linha1: p.setor ?? '',
          linha2: p.sede ?? '',
        };
  });

  itens.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  return { role, buscaCandidatos, itens };
}

export function filtrarPerfis(itens, texto) {
  const t = normalizar(texto);
  if (!t) return itens;
  return itens.filter((i) => normalizar(`${i.nome} ${i.linha1} ${i.linha2}`).includes(t));
}