# AccessHire

App de vagas de emprego voltado para pessoas com deficiência (PCD), conectando candidatos PCD a empresas comprometidas com inclusão.

## Tecnologias utilizadas

- **React Native + Expo** (Dev Client / EAS Build)
- **Firebase Authentication** — login e cadastro
- **Cloud Firestore** — banco de dados em tempo real
- **React Navigation** — navegação entre telas

## Requisitos atendidos

| Requisito | Status |
|---|---|
| Navegação entre telas | ✅ |
| Splash Screen com identidade visual | ✅ |
| Cadastro com diferentes perfis de acesso (Candidato / Empresa) | ✅ |
| Autenticação (login) | ✅ |
| Integração com banco de dados (Firestore) | ✅ |
| Tela inicial (Home) | ✅ |
| Funcionalidades principais | ✅ Publicação de vagas, candidatura, chat, notificações |

## Como rodar o projeto

### Pré-requisitos
- [Node.js](https://nodejs.org) (LTS)
- Conta no [Expo](https://expo.dev) e [EAS CLI](https://docs.expo.dev/eas/) instalado (`npm install -g eas-cli`)
- Celular Android com o build de desenvolvimento instalado (ou emulador)

### Passos

```bash
git clone https://github.com/Gustavowrkdev09/AccessHireApp.git
cd AccessHireApp
npm install
```

O projeto já inclui o `google-services.json` necessário para a integração com Firebase.

Para rodar:

```bash
npx expo start --dev-client
```

Escaneie o QR Code com o app de desenvolvimento instalado no celular (gerado via `eas build --profile development --platform android`), certificando-se de que o celular e o computador estão na mesma rede.

## Funcionalidades principais

### Candidato
- Cadastro com envio de laudo médico (verificação por e-mail, ver limitações abaixo)
- Onboarding de perfil (data de nascimento, área de atuação)
- Visualização de vagas disponíveis, com filtro por recursos de acessibilidade
- Candidatura a vagas
- Chat com empresas
- Notificações
- Visualização do próprio perfil

### Empresa
- Cadastro com validação de CNPJ
- Onboarding de perfil (setor, porte, sede)
- Publicação e exclusão de vagas
- Visualização de candidatos interessados por vaga
- Chat com candidatos
- Notificações
- Cálculo de conformidade com a Lei de Cotas (Lei 8.213/91)

## Limitações conhecidas

- **Upload de laudo médico**: a verificação de elegibilidade PCD é feita manualmente via e-mail, não por upload direto no app. Isso ocorre porque o armazenamento de arquivos (Firebase Storage) exige o plano pago (Blaze) do Firebase, não contratado neste projeto.
- **Notificações são in-app**, não push — não aparecem se o aplicativo estiver fechado, pelo mesmo motivo (Cloud Functions também exige o plano Blaze).
- **Compatibilidade candidato-vaga**: ainda não há algoritmo de pontuação de compatibilidade implementado.
- **Sistema de planos pagos** para empresas está modelado, mas sem integração de pagamento real.

## Autores

- Diego André Rantes Davila
- Guilherme Akira Suma
- Guilherme Isaac de Oliveira Almeida
- Guilherme Pereira Maciel
- Gustavo dos Santos Ferreira
