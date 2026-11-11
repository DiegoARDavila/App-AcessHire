// Dados dos planos das empresas (usados pelas telas Planos e PlanoDetalhe)

export const ORDEM_PLANOS = ['inicial', 'platinum', 'gold'];

export const PLANOS = {
  inicial: {
    id: 'inicial',
    nome: 'Plano Inicial',
    cor: '#1787d5',
    corTexto: '#ffffff',
    idealPara: 'Pequenas empresas que estão iniciando seus processos de recrutamento.',
    beneficios: [
      'Publicação de até 3 vagas ativas por mês.',
      'Acesso completo à plataforma.',
      'Recebimento de candidaturas ilimitadas.',
      'Gerenciamento básico de vagas e candidatos.',
      'Página da empresa personalizável.',
      'Suporte padrão.',
    ],
    preco: null,
    rodape: 'O Plano Inicial é totalmente gratuito.',
  },
  platinum: {
    id: 'platinum',
    nome: 'Plano Platinum',
    cor: '#8c8c8c',
    corTexto: '#ffffff',
    idealPara: 'Empresas de médio porte e startups em crescimento.',
    beneficios: [
      'Publicação de até 10 vagas por mês.',
      'Destaque moderado das vagas no algoritmo.',
      'Acesso a estatísticas básicas de visualização e candidaturas.',
      'Possibilidade de destacar uma vaga por mês.',
    ],
    preco: 'R$125,90/mês',
    rodape: 'Cancele sua assinatura a qualquer momento.',
  },
  gold: {
    id: 'gold',
    nome: 'Plano Gold',
    cor: '#e0b617',
    // texto escuro: branco sobre dourado tem pouco contraste
    corTexto: '#2b2b2b',
    idealPara: 'Empresas com recrutamento frequente e grande volume de contratações.',
    beneficios: [
      'Publicação de vagas ilimitadas.',
      'Maior prioridade no algoritmo de recomendação.',
      'Destaque visual para todas as vagas publicadas.',
      'Relatórios avançados de desempenho e perfil dos candidatos.',
    ],
    preco: 'R$297,90/mês',
    rodape: 'Cancele sua assinatura a qualquer momento.',
  },
};