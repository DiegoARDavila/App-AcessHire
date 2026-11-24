import { CommonActions } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getUserRole } from '../services/auth';
import { auth } from '../services/firebase';

// Rotas de cada tipo de conta para as abas da barra inferior.
// 'chat' e 'notificacoes' são telas compartilhadas entre candidato e empresa.
const ROTAS = {
  candidate: {
    inicio: 'MenuUser',
    vagas: 'VagasUser',
    menu: 'ConfigUser',
    chat: 'Chat',
    notificacoes: 'Notificacoes',
  },
  company: {
    inicio: 'MenuEmp',
    vagas: 'VagasEmp',
    menu: 'ConfigEmp',
    chat: 'Chat',
    notificacoes: 'Notificacoes',
  },
};

// papel (candidate | company) por uid, para não consultar o Firestore a cada toque
const cachePapel = new Map();

export async function obterPapel(uid) {
  if (!uid) return null;
  if (cachePapel.has(uid)) return cachePapel.get(uid);
  const papel = await getUserRole(uid);
  if (papel) cachePapel.set(uid, papel);
  return papel;
}

// Papel da conta logada, para telas usadas pelos dois tipos de conta (Chat, Notificações).
export function usePapel() {
  const uid = auth.currentUser?.uid;
  const [papel, setPapel] = useState(uid ? (cachePapel.get(uid) ?? null) : null);

  useEffect(() => {
    let ativo = true;
    if (!uid) {
      setPapel(null);
      return undefined;
    }
    obterPapel(uid)
      .then((p) => {
        if (ativo) setPapel(p);
      })
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, [uid]);

  return papel;
}

// Troca a pilha inteira por uma nova (sem animação de volta para o histórico antigo).
export function resetPara(navigation, nome, params) {
  navigation.dispatch(
    CommonActions.reset({ index: 0, routes: [{ name: nome, params }] })
  );
}

// Navegação da barra inferior. Em vez de empilhar uma tela nova a cada toque
// (o que fazia o botão "voltar" percorrer todas as abas já visitadas), a pilha
// é refeita como [Início] ou [Início, aba], com no máximo duas telas.
// aba: 'inicio' | 'chat' | 'vagas' | 'notificacoes' | 'menu'
// papel: 'candidate' | 'company'. Se vier vazio, é descoberto pela conta logada.
export async function irParaAba(navigation, aba, papel) {
  const tipo = papel ?? (await obterPapel(auth.currentUser?.uid).catch(() => null));
  const rotas = ROTAS[tipo] ?? ROTAS.candidate;
  const destino = rotas[aba];
  if (!destino) return;

  // já está nessa aba: não recria a tela à toa
  const estado = navigation.getState?.();
  if (estado && estado.routes?.[estado.index]?.name === destino) return;

  const inicio = rotas.inicio;
  const routes =
    destino === inicio ? [{ name: inicio }] : [{ name: inicio }, { name: destino }];

  navigation.dispatch(CommonActions.reset({ index: routes.length - 1, routes }));
}
