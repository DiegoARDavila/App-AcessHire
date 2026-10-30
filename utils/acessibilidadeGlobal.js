import { StyleSheet } from 'react-native';
import { FATORES_FONTE, getAcessibilidade } from '../services/acessibilidade';

// IMPORTANTE: este arquivo precisa ser o PRIMEIRO import de app/index.tsx.
// Ele intercepta StyleSheet.create para que o tamanho da fonte e o alto
// contraste valham para o app inteiro, sem mexer tela por tela.

const PRETO = '#000000';
const BRANCO = '#ffffff';
const AZUL_ESCURO = '#00467F';

const CHAVES_BORDA = new Set([
  'borderColor',
  'borderTopColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderRightColor',
]);

function hexParaRgb(hex) {
  let h = hex.slice(1);
  if (h.length === 3 || h.length === 4) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (h.length !== 6 && h.length !== 8) return null;
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function luminancia({ r, g, b }) {
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// azul "da marca" (#45c5f3, #54c3ea, #00bcd4...), que tem texto branco por cima
function ehAzul({ r, b }) {
  return b > r + 40;
}

export function contrasteCor(chave, valor) {
  if (typeof valor !== 'string' || valor[0] !== '#') return valor;
  const rgb = hexParaRgb(valor);
  if (!rgb) return valor;
  const L = luminancia(rgb);

  if (chave === 'color') return L > 0.8 ? BRANCO : PRETO;

  if (chave === 'backgroundColor') {
    if (ehAzul(rgb) && L < 0.75) return AZUL_ESCURO;
    if (L >= 0.45) return BRANCO;
    return L < 0.05 ? valor : PRETO;
  }

  if (CHAVES_BORDA.has(chave)) return L > 0.95 ? valor : PRETO;

  return valor;
}

export function transformarEstilo(estilo) {
  if (!estilo || typeof estilo !== 'object') return estilo;

  const { fontStep, altoContraste } = getAcessibilidade();
  const fator = FATORES_FONTE[fontStep] ?? 1;
  if (fator === 1 && !altoContraste) return estilo;

  const novo = { ...estilo };
  for (const chave of Object.keys(novo)) {
    const valor = novo[chave];
    if ((chave === 'fontSize' || chave === 'lineHeight') && typeof valor === 'number') {
      novo[chave] = fator === 1 ? valor : Math.round(valor * fator * 10) / 10;
    } else if (altoContraste) {
      novo[chave] = contrasteCor(chave, valor);
    }
  }
  return novo;
}

if (!StyleSheet.__acessibilidadeAplicada) {
  const criarOriginal = StyleSheet.create;

  StyleSheet.create = function create(estilos) {
    const base = criarOriginal.call(StyleSheet, estilos);
    const saida = {};
    // getters: o valor é calculado no momento em que a tela lê styles.x,
    // então reflete sempre a configuração atual
    Object.keys(base).forEach((chave) => {
      Object.defineProperty(saida, chave, {
        enumerable: true,
        get: () => transformarEstilo(base[chave]),
      });
    });
    return saida;
  };

  StyleSheet.__acessibilidadeAplicada = true;
}