import * as FileSystem from 'expo-file-system/legacy';
import { useSyncExternalStore } from 'react';

// Configurações de acessibilidade do app (valem para o aparelho todo e ficam
// salvas num arquivo local, então continuam depois de fechar o app).

const ARQUIVO = `${FileSystem.documentDirectory}acessibilidade.json`;

export const PADRAO = Object.freeze({
  fontStep: 1, // 0 = Pequena, 1 = Média, 2 = Grande
  altoContraste: false,
  leitorTelas: false,
  feedbackTatil: false,
});

// Proporcional à prévia da tela (13, 17 e 22)
export const FATORES_FONTE = [13 / 17, 1, 22 / 17];

let estado = PADRAO;
const ouvintes = new Set();

export function getAcessibilidade() {
  return estado;
}

function assinar(fn) {
  ouvintes.add(fn);
  return () => ouvintes.delete(fn);
}

function avisar() {
  ouvintes.forEach((fn) => fn());
}

export function useAcessibilidade() {
  return useSyncExternalStore(assinar, getAcessibilidade, getAcessibilidade);
}

function sanitizar(salvo) {
  const s = salvo && typeof salvo === 'object' ? salvo : {};
  return {
    fontStep: [0, 1, 2].includes(s.fontStep) ? s.fontStep : PADRAO.fontStep,
    altoContraste: s.altoContraste === true,
    leitorTelas: s.leitorTelas === true,
    feedbackTatil: s.feedbackTatil === true,
  };
}

export async function carregarAcessibilidade() {
  try {
    const info = await FileSystem.getInfoAsync(ARQUIVO);
    if (info.exists) {
      const texto = await FileSystem.readAsStringAsync(ARQUIVO);
      estado = sanitizar(JSON.parse(texto));
    }
  } catch (e) {
    console.log('Erro ao carregar acessibilidade:', e);
  }
  avisar();
}

export function atualizarAcessibilidade(parcial) {
  const novo = sanitizar({ ...estado, ...parcial });
  const igual = Object.keys(novo).every((k) => novo[k] === estado[k]);
  if (igual) return;

  estado = novo;
  avisar();
  FileSystem.writeAsStringAsync(ARQUIVO, JSON.stringify(estado)).catch((e) =>
    console.log('Erro ao salvar acessibilidade:', e)
  );
}