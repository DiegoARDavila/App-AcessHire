import * as AuthModular from '@react-native-firebase/auth';
import * as FileSystem from 'expo-file-system/legacy';
import { URL_ASSISTENTE } from '../constants/api';
import { getUserRole } from './auth';
import { auth } from './firebase';

const MAX_HISTORICO = 100;
const MAX_ENVIADAS = 16;

// O histórico fica no aparelho, um arquivo por usuário (contas diferentes no
// mesmo celular não misturam conversas).
const arquivo = (uid) => `${FileSystem.documentDirectory}assistente_${uid}.json`;

export async function carregarHistorico(uid) {
  try {
    const info = await FileSystem.getInfoAsync(arquivo(uid));
    if (!info.exists) return [];
    const lista = JSON.parse(await FileSystem.readAsStringAsync(arquivo(uid)));
    return Array.isArray(lista)
      ? lista.filter(
          (m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string'
        )
      : [];
  } catch (e) {
    console.log('Erro ao carregar histórico do assistente:', e);
    return [];
  }
}

export async function salvarHistorico(uid, mensagens) {
  try {
    await FileSystem.writeAsStringAsync(
      arquivo(uid),
      JSON.stringify(mensagens.slice(-MAX_HISTORICO))
    );
  } catch (e) {
    console.log('Erro ao salvar histórico do assistente:', e);
  }
}

export async function limparHistorico(uid) {
  try {
    await FileSystem.deleteAsync(arquivo(uid), { idempotent: true });
  } catch (e) {
    console.log('Erro ao limpar histórico do assistente:', e);
  }
}

async function obterToken(user) {
  // API modular do React Native Firebase; se não existir nessa versão, usa a antiga
  if (typeof AuthModular.getIdToken === 'function') return AuthModular.getIdToken(user);
  return user.getIdToken();
}

export async function perguntarAssistente(uid, mensagens) {
  const user = auth.currentUser;
  if (!user) throw new Error('Faça login novamente para usar o assistente.');

  const [token, role] = await Promise.all([obterToken(user), getUserRole(uid)]);

  const controlador = new AbortController();
  const timer = setTimeout(() => controlador.abort(), 35000);

  try {
    const resposta = await fetch(URL_ASSISTENTE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        perfil: role === 'company' ? 'company' : 'candidate',
        mensagens: mensagens
          .slice(-MAX_ENVIADAS)
          .map((m) => ({ role: m.role, text: m.text })),
      }),
      signal: controlador.signal,
    });

    const dados = await resposta.json().catch(() => ({}));
    if (!resposta.ok) {
      throw new Error(dados.erro || 'Não foi possível falar com o assistente agora.');
    }
    return dados.texto;
  } catch (e) {
    if (e?.name === 'AbortError') {
      throw new Error('O assistente demorou para responder. Tente de novo.');
    }
    if (String(e?.message).includes('Network request failed')) {
      throw new Error('Sem conexão com a internet. Verifique e tente de novo.');
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}