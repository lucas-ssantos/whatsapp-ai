# WhatsApp AI Chat Interativo

Esta é uma aplicação Node.js que utiliza o pacote `wppconnect` para criar um chat interativo com o WhatsApp integrado com a API da OpenAI para gerar respostas inteligentes.

## Estrutura do Projeto

```
whatsapp-ai/
├── index.js           # Arquivo principal da aplicação
├── package.json       # Configurações e dependências do projeto
├── config.js          # Configurações da aplicação e da API da OpenAI
├── .env               # Arquivo de variáveis de ambiente (chaves de API)
├── openai/            # Pasta dedicada para integração com a OpenAI
│   ├── index.js       # Exporta as funcionalidades da OpenAI
│   ├── openai-client.js # Cliente para comunicação com a API da OpenAI
│   ├── conversation-manager.js # Gerenciador de conversas para manter contexto
│   ├── example.js     # Exemplo de uso da integração com a OpenAI
│   └── README.md      # Documentação específica da integração com a OpenAI
└── README.md          # Este arquivo
```

## Requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Um smartphone com WhatsApp instalado para escanear o QR code
- Conta na OpenAI e uma chave de API válida

## Instalação

1. Clone este repositório ou baixe os arquivos
2. Instale as dependências:

```bash
npm install
```

Ou se você usa Yarn:

```bash
yarn install
```

3. Configure a chave da API da OpenAI:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione sua chave de API da OpenAI ao arquivo:
   ```
   OPENAI_API_KEY=sua_chave_api_aqui
   ```
   - Você pode obter uma chave de API em [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## Como Usar

1. Inicie a aplicação:

```bash
npm start
```

Ou com Yarn:

```bash
yarn start
```

2. Um QR code será exibido no terminal. Escaneie-o com seu WhatsApp (Configurações > WhatsApp Web/Desktop)

3. Após a conexão bem-sucedida, a aplicação estará pronta para receber e responder mensagens

4. Envie qualquer mensagem pelo WhatsApp e a aplicação irá:
   - Processar sua mensagem
   - Enviar para a API da OpenAI
   - Retornar a resposta gerada pela IA
   - Manter o contexto da conversa para respostas mais coerentes

A aplicação utiliza a API da OpenAI para gerar respostas contextuais e inteligentes para qualquer mensagem recebida.

## Personalização da IA

Você pode personalizar o comportamento da IA editando o arquivo `config.js`. Este arquivo contém várias configurações para a API da OpenAI:

```javascript
openai: {
  // Modelo da OpenAI a ser utilizado
  model: 'gpt-4.1-nano',
  
  // Temperatura para controlar a aleatoriedade das respostas (0-1)
  temperature: 0.3,
  
  // Limite máximo de tokens para a resposta
  maxTokens: 1000,
  
  // Limite de mensagens por conversa para manter como contexto
  messageLimit: 10,
  
  // Instrução padrão do sistema para a IA
  systemInstruction: 'Você é um atendente de concessionária útil e amigável...',
  
  // Outras configurações...
}
```

A instrução do sistema (`systemInstruction`) é especialmente importante, pois define a personalidade e o comportamento da IA. Você pode modificá-la para adaptar a IA ao seu caso de uso específico.

## Observações

- A primeira vez que você executar a aplicação, será necessário escanear o QR code
- As sessões do WhatsApp são salvas na pasta `tokens` que será criada automaticamente
- O histórico de conversas é mantido em memória durante a execução da aplicação
- A API da OpenAI tem limites de uso e custos associados, verifique sua conta para mais detalhes
- Para encerrar a aplicação, pressione `Ctrl+C` no terminal

## Módulo OpenAI

Para mais detalhes sobre a implementação da integração com a OpenAI, consulte o arquivo `openai/README.md`.

## Licença

ISC