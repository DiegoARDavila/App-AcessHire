import { isValidCNPJ } from './cnpj';

// Mensagens de erro de login, cadastro e salvamento de perfil.
// A ideia é sempre dizer ao usuário o que deu errado e o que fazer.

const MENSAGENS_POR_CODIGO = {
  // Firebase Auth
  'auth/invalid-email': 'Email inválido. Confere se digitou no formato nome@exemplo.com.',
  'auth/email-already-in-use': 'Esse email já tem cadastro. Tenta entrar ou usa outro email.',
  'auth/weak-password': 'Senha muito fraca. Usa pelo menos 6 caracteres.',
  'auth/user-disabled': 'Essa conta foi desativada. Fala com o suporte.',
  'auth/user-not-found': 'Não existe conta com esse email. Confere o email ou faz o cadastro.',
  'auth/wrong-password': 'Senha incorreta. Confere a senha e tenta de novo.',
  'auth/invalid-credential': 'Email ou senha incorretos. Confere os dados e tenta de novo.',
  'auth/too-many-requests': 'Muitas tentativas seguidas. Espera alguns minutos e tenta de novo.',
  'auth/network-request-failed': 'Sem conexão com a internet. Confere sua rede e tenta de novo.',
  'auth/operation-not-allowed': 'O acesso por email e senha não está habilitado. Fala com o suporte.',
  // Firestore
  'firestore/permission-denied': 'Sem permissão para salvar ou ler seus dados. Fala com o suporte.',
  'firestore/unavailable': 'Não foi possível conectar ao servidor. Confere a internet e tenta de novo.',
  'firestore/deadline-exceeded': 'O servidor demorou para responder. Confere a internet e tenta de novo.',
};

const MENSAGEM_PADRAO = {
  login: 'Não foi possível entrar agora. Tenta de novo em instantes.',
  cadastro: 'Não foi possível concluir o cadastro agora. Tenta de novo em instantes.',
  salvar: 'Não foi possível salvar seus dados agora. Tenta de novo em instantes.',
};

// acao: 'login' | 'cadastro' | 'salvar'
export function mensagemErro(e, acao = 'login') {
  const codigo = e?.code;
  if (codigo && MENSAGENS_POR_CODIGO[codigo]) return MENSAGENS_POR_CODIGO[codigo];
  // erro inesperado: mostra o código para facilitar o suporte
  const base = MENSAGEM_PADRAO[acao] ?? MENSAGEM_PADRAO.login;
  return codigo ? `${base} (código: ${codigo})` : base;
}

export function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((email ?? '').trim());
}

// ['nome', 'email', 'senha'] -> "nome, email e senha"
export function listaPt(itens) {
  if (itens.length <= 1) return itens.join('');
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`;
}

// Devolve o motivo específico pelo qual o CNPJ é inválido, ou null se estiver ok.
export function motivoCNPJInvalido(valor) {
  const digitos = (valor ?? '').replace(/\D/g, '');
  if (digitos.length !== 14) {
    return `O CNPJ precisa ter 14 números (você digitou ${digitos.length}).`;
  }
  if (/^(\d)\1{13}$/.test(digitos)) {
    return 'CNPJ inválido: não pode ter todos os números iguais.';
  }
  if (!isValidCNPJ(digitos)) {
    return 'CNPJ inválido: os dígitos verificadores não conferem. Confere os números.';
  }
  return null;
}

// Devolve o motivo específico pelo qual a data de nascimento é inválida, ou null se estiver ok.
// Segue as mesmas regras de isValidDataNascimento (idade entre 14 e 120 anos).
export function motivoDataInvalida(valor) {
  const texto = (valor ?? '').trim();
  if (!texto) return 'Preenche a data de nascimento (DD/MM/AAAA).';

  const m = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return 'Digita a data completa no formato DD/MM/AAAA.';

  const [, dia, mes, ano] = m.map(Number);
  if (mes < 1 || mes > 12) return 'Mês inválido na data de nascimento. Usa um número de 01 a 12.';

  const diasNoMes = new Date(ano, mes, 0).getDate();
  if (dia < 1 || dia > diasNoMes) {
    return `Dia inválido: o mês ${String(mes).padStart(2, '0')}/${ano} tem ${diasNoMes} dias.`;
  }

  const anoAtual = new Date().getFullYear();
  if (ano > anoAtual) return 'A data de nascimento não pode estar no futuro.';

  const idade = anoAtual - ano;
  if (idade < 14) return 'É preciso ter pelo menos 14 anos para se cadastrar.';
  if (idade > 120) return 'Confere o ano de nascimento: a data informada é muito antiga.';

  return null;
}
