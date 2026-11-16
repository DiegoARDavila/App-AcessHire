// Textos dos Termos de Uso e do Aviso de Privacidade (LGPD) do AccessHire.
// Ao alterar o conteúdo, aumente VERSAO_TERMOS: a versão aceita fica gravada no cadastro.

export const VERSAO_TERMOS = '1.0';
export const DATA_TERMOS = 'Novembro de 2026';
// Canal de contato e de solicitações dos titulares. Troque se a equipe tiver um e-mail próprio para isso.
export const EMAIL_CONTATO = 'verificacao@accesshire.com';

export const TERMOS_DE_USO = [
  {
    titulo: '1. O que é o AccessHire',
    paragrafos: [
      'O AccessHire é um aplicativo de vagas de emprego voltado a pessoas com deficiência (PCD) e a empresas comprometidas com a inclusão. Nosso objetivo é aproximar candidatos e empresas com base nas competências profissionais e nos requisitos de cada vaga.',
    ],
  },
  {
    titulo: '2. Responsabilidades dos candidatos',
    itens: [
      'Informar dados verdadeiros, completos e atualizados no cadastro e no perfil.',
      'Manter a senha em sigilo e não permitir que outras pessoas usem a sua conta.',
      'Enviar apenas documentos e informações seus, e apenas o que for necessário ao processo seletivo.',
      'Tratar empresas e demais usuários com respeito nas conversas e candidaturas.',
    ],
  },
  {
    titulo: '3. Responsabilidades das empresas',
    itens: [
      'Informar o CNPJ e os dados da empresa de forma verdadeira e manter o cadastro atualizado.',
      'Publicar apenas vagas reais, com descrição clara das atividades, requisitos e condições.',
      'Usar os dados dos candidatos somente para o processo de recrutamento da vaga em que eles se candidataram.',
      'Não compartilhar perfis ou candidaturas com terceiros sem uma finalidade legítima de recrutamento.',
      'Informar com honestidade as condições de acessibilidade do ambiente de trabalho. Essas informações não são garantia de adequação absoluta do ambiente.',
    ],
  },
  {
    titulo: '4. Regras para publicação de vagas',
    paragrafos: ['O AccessHire não aceita anúncios fraudulentos ou discriminatórios. É proibido publicar vagas que:'],
    itens: [
      'sejam falsas, enganosas ou usadas para coletar dados dos candidatos sem oferecer uma oportunidade real;',
      'cobrem qualquer valor do candidato para participar do processo seletivo ou ser contratado;',
      'discriminem por deficiência, raça, cor, gênero, idade, religião, origem ou qualquer outro critério sem relação com a função;',
      'excluam candidatos por sua deficiência quando ela não impedir o exercício das atividades da vaga;',
      'tenham conteúdo ilegal, ofensivo ou que viole direitos de terceiros.',
    ],
  },
  {
    titulo: '5. Verificação de contas',
    paragrafos: [
      'Para manter a plataforma segura, podemos pedir a verificação da conta. No caso de candidatos, isso pode incluir o envio de laudo médico para o e-mail de verificação informado no cadastro, e, no caso de empresas, a conferência do CNPJ.',
    ],
  },
  {
    titulo: '6. Suspensão e encerramento de contas',
    paragrafos: ['Podemos suspender ou encerrar uma conta, com aviso sempre que possível, nos seguintes casos:'],
    itens: [
      'descumprimento destes Termos;',
      'publicação de vagas fraudulentas ou discriminatórias;',
      'informações falsas ou uso da conta por outra pessoa;',
      'ofensas, assédio ou uso indevido dos dados de outros usuários.',
    ],
    depois: 'Você pode pedir o encerramento da sua conta a qualquer momento pelos canais de contato abaixo.',
  },
  {
    titulo: '7. Uso responsável e inteligência artificial',
    itens: [
      'O AccessHire busca valorizar a compatibilidade entre competências e requisitos da vaga e evita decisões automatizadas que excluam candidatos por sua deficiência.',
      'A Nexi, assistente de inteligência artificial do app, oferece dicas de emprego e simulação de entrevistas. Ela pode errar e não substitui orientação profissional ou jurídica.',
      'O acesso a perfis e candidaturas deve se limitar às finalidades legítimas do recrutamento.',
    ],
  },
  {
    titulo: '8. Contato',
    paragrafos: [
      'Dúvidas, denúncias de vagas suspeitas ou discriminatórias e solicitações sobre seus dados podem ser enviadas para',
    ],
    destaque: EMAIL_CONTATO,
  },
  {
    titulo: '9. Alterações destes Termos',
    paragrafos: [
      'Podemos atualizar estes Termos. Quando houver mudanças importantes, avisaremos no aplicativo. O uso do app depois do aviso significa que você está de acordo com a nova versão.',
    ],
  },
];

export const PRIVACIDADE = [
  {
    titulo: '1. Quais dados tratamos',
    itens: [
      'Dados de cadastro: nome, e-mail, telefone e, para empresas, nome e CNPJ.',
      'Dados do perfil e das candidaturas: formação, experiência, vagas em que você se candidatou e mensagens trocadas no chat.',
      'Dados sobre deficiência e saúde, quando você os informa ou envia laudo para verificação (veja o item 3).',
      'Preferências de acessibilidade escolhidas no app.',
      'Conversas com a Nexi, nossa assistente de IA (veja o item 4).',
    ],
  },
  {
    titulo: '2. Para que usamos seus dados',
    paragrafos: ['Usamos os dados com finalidade específica e apenas no que for necessário para:'],
    itens: [
      'criar e proteger a sua conta;',
      'conectar candidatos e empresas e permitir candidaturas, conversas e processos seletivos;',
      'verificar contas e prevenir fraudes e anúncios discriminatórios;',
      'adaptar o app às suas necessidades de acessibilidade;',
      'cumprir obrigações legais.',
    ],
  },
  {
    titulo: '3. Dados sensíveis (deficiência e saúde)',
    paragrafos: [
      'Informações sobre deficiência e saúde são dados pessoais sensíveis pela Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018). Coletamos somente o necessário para verificar sua conta e aproximar você de vagas inclusivas.',
      'Esses dados não são vendidos nem usados para excluir você de vagas. O acesso interno a eles é restrito. Você pode retirar o seu consentimento a qualquer momento, sabendo que isso pode limitar o uso de recursos que dependem dessas informações.',
    ],
  },
  {
    titulo: '4. Com quem compartilhamos',
    itens: [
      'Empresas: quando você se candidata, a empresa da vaga recebe os dados da candidatura e do seu perfil para fins de recrutamento.',
      'Provedores de tecnologia: usamos serviços do Google/Firebase para autenticação e armazenamento dos dados do app.',
      'Nexi: as mensagens que você envia à assistente são processadas por um serviço de inteligência artificial (Google Gemini) para gerar a resposta. Evite escrever dados sensíveis desnecessários nessa conversa.',
      'Autoridades, quando houver obrigação legal.',
    ],
  },
  {
    titulo: '5. Como protegemos seus dados',
    paragrafos: ['Nosso compromisso de segurança inclui:'],
    itens: [
      'autenticação por serviço apropriado, sem guardar senhas em texto simples;',
      'controle de acesso conforme o tipo de perfil (candidato ou empresa), com regras de autorização no servidor e no banco de dados;',
      'conexão criptografada e proteção das chaves e configurações do ambiente;',
      'coleta mínima de dados e acesso interno restrito às informações sensíveis;',
      'validação dos dados recebidos e tratamento de erros sem expor informações internas;',
      'correção de vulnerabilidades e resposta a incidentes de segurança.',
    ],
    depois: 'Nenhum sistema é totalmente imune a falhas. Se ocorrer um incidente que possa afetar você, avisaremos conforme a lei.',
  },
  {
    titulo: '6. Por quanto tempo guardamos',
    paragrafos: [
      'Mantemos seus dados enquanto sua conta estiver ativa e pelo tempo necessário para cumprir obrigações legais. Ao pedir a exclusão da conta, os dados serão apagados ou anonimizados, salvo os que a lei exigir guardar.',
    ],
  },
  {
    titulo: '7. Seus direitos',
    paragrafos: ['Pela LGPD, você pode, a qualquer momento, solicitar:'],
    itens: [
      'confirmação de que tratamos seus dados e acesso a eles;',
      'correção de dados incompletos ou desatualizados;',
      'anonimização, bloqueio ou eliminação de dados desnecessários;',
      'portabilidade dos dados;',
      'informação sobre com quem compartilhamos seus dados;',
      'revogação do consentimento e exclusão da conta.',
    ],
    depois: 'Envie sua solicitação para o contato abaixo. Responderemos em prazo razoável.',
    destaque: EMAIL_CONTATO,
  },
  {
    titulo: '8. Quem é responsável pelos dados',
    paragrafos: [
      'A equipe do AccessHire é responsável pelo tratamento dos dados de cadastro e pelo funcionamento da plataforma. As empresas são responsáveis pelo uso que fazem dos dados dos candidatos que recebem nas vagas, e só podem usá-los para recrutamento.',
    ],
  },
];