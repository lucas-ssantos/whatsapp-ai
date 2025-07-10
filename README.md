# WhatsApp AI Chat Interativo

Esta é uma aplicação Node.js que utiliza o pacote `wppconnect` para criar um chat interativo com o WhatsApp.

## Estrutura do Projeto

```
whatsapp-ai/
├── index.js           # Arquivo principal da aplicação
├── package.json       # Configurações e dependências do projeto
└── README.md          # Este arquivo
```

## Requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Um smartphone com WhatsApp instalado para escanear o QR code

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

Além disso, a aplicação responde a saudações simples como "oi" ou "olá".

## Observações

- A primeira vez que você executar a aplicação, será necessário escanear o QR code
- As sessões são salvas na pasta `tokens` que será criada automaticamente
- Para encerrar a aplicação, pressione `Ctrl+C` no terminal

## Licença

ISC