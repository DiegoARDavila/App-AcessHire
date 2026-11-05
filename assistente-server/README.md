# Servidor do Assistente AccessHire

Recebe as mensagens do app, confere o login do Firebase e pergunta ao Gemini.
A chave do Gemini fica só aqui (variável de ambiente), nunca dentro do app.

## Variáveis de ambiente (no painel do Vercel)

| Nome | Valor |
|---|---|
| `GEMINI_API_KEY` | chave criada em https://aistudio.google.com/apikey |
| `FIREBASE_PROJECT_ID` | `accesshire2026` |
| `GEMINI_MODEL` | (opcional) modelo a usar. Padrão: `gemini-3.5-flash-lite` |

## Publicar

1. Suba esta pasta (`assistente-server`) no GitHub junto com o projeto.
2. No Vercel: Add New > Project > escolha o repositório.
3. Em **Root Directory**, escolha `assistente-server`.
4. Em Environment Variables, cadastre as variáveis acima e clique em Deploy.
5. Copie o endereço do projeto (algo como `https://seu-projeto.vercel.app`) e coloque em
   `constants/api.js` do app, terminando com `/api/assistente`.

## Testar o servidor

Sem login o servidor deve recusar (resposta 401):

    curl -i -X POST https://SEU-PROJETO.vercel.app/api/assistente \
      -H "Content-Type: application/json" \
      -d '{"mensagens":[{"role":"user","text":"oi"}]}'
