import { completeProfile, getProfile } from './auth';

// Lei de Cotas (Lei 8.213/91, art. 93): percentual de PCD conforme o total de funcionários.
export function percentualExigido(total) {
  if (total < 100) return 0;
  if (total <= 200) return 0.02;
  if (total <= 500) return 0.03;
  if (total <= 1000) return 0.04;
  return 0.05;
}

export function calcularCota(total, pcd) {
  const t = Number(total);
  const p = Number(pcd);
  if (!Number.isFinite(t) || !Number.isFinite(p) || t <= 0 || p < 0) return null;

  const exigido = percentualExigido(t);
  if (exigido === 0) {
    return { isento: true, percentualExigido: 0, necessarias: 0, faltam: 0, cumprida: true, progresso: 100, percentualAtual: (p / t) * 100 };
  }

  const necessarias = Math.ceil(t * exigido);
  const faltam = Math.max(0, necessarias - p);
  const progresso = Math.min(100, Math.round((p / necessarias) * 100));
  return {
    isento: false,
    percentualExigido: exigido * 100,
    necessarias,
    faltam,
    cumprida: faltam === 0,
    progresso,
    percentualAtual: (p / t) * 100,
  };
}

export async function carregarCota(uid) {
  const perfil = await getProfile(uid, 'company');
  if (perfil?.cotaTotal == null || perfil?.cotaPCD == null) return null;
  return { total: perfil.cotaTotal, pcd: perfil.cotaPCD };
}

export async function salvarCota(uid, total, pcd) {
  await completeProfile(uid, 'company', { cotaTotal: total, cotaPCD: pcd });
}