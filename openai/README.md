# Integração com a OpenAI

Esta pasta contém os arquivos necessários para integrar o bot do Discord com a API da OpenAI, permitindo enviar mensagens, manter contexto de conversas anteriores e personalizar instruções para a IA.

## Estrutura de Arquivos

- `index.js` - Exporta todas as funcionalidades da pasta OpenAI
- `openai-client.js` - Cliente para comunicação com a API da OpenAI
- `conversation-manager.js` - Gerenciador de conversas para manter o histórico e contexto
- `example.js` - Exemplo de uso da integração com a OpenAI

## Configuração

1. Instale a biblioteca da OpenAI:
   ```
   npm install openai
   ```

2. Adicione sua chave de API da OpenAI ao arquivo `.env`:
   ```
   OPENAI_API_KEY=sua_chave_api_aqui
   ```

3. Importe e utilize os módulos em seu código conforme necessário.

## Como Usar

### Inicialização Básica

```javascript
const { OpenAIClient, ConversationManager } = require('./openai');

// Inicializa o cliente da OpenAI com a chave de API
const openai = new OpenAIClient(process.env.OPENAI_API_KEY);

// Inicializa o gerenciador de conversas
const conversationManager = new ConversationManager();
```

### Envio de Mensagens Simples

```javascript
// Cria uma mensagem de usuário
const userMessage = OpenAIClient.createUserMessage('Olá, como você está?');

// Envia a mensagem para a API da OpenAI
const response = await openai.sendMessage([userMessage]);

// Extrai a resposta da IA
const assistantResponse = response.choices[0].message.content;
console.log('Resposta da IA:', assistantResponse);
```

### Gerenciamento de Conversas com Contexto

```javascript
// ID único para a conversa (pode ser ID do usuário ou canal)
const conversationId = 'user-123';

// Instrução de sistema para personalizar o comportamento da IA
const systemInstruction = 'Você é um assistente útil e amigável chamado LukeAI.';

// Adiciona uma mensagem do usuário à conversa
conversationManager.addUserMessage(
  conversationId, 
  'Olá! Como você pode me ajudar hoje?',
  systemInstruction // A instrução do sistema é passada apenas na primeira mensagem
);

// Obtém a conversa atual
const conversation = conversationManager.getConversation(conversationId);

// Envia a conversa para a API da OpenAI
const response = await openai.sendMessage(conversation);

// Extrai a resposta da IA
const assistantResponse = response.choices[0].message.content;

// Adiciona a resposta da IA à conversa para manter o contexto
conversationManager.addAssistantMessage(conversationId, assistantResponse);
```

### Personalização de Instruções para a IA

Você pode personalizar o comportamento da IA fornecendo instruções específicas na mensagem do sistema:

```javascript
const systemInstruction = `
Você é um assistente chamado LukeAI com as seguintes características:

1. Seja amigável e educado em todas as interações
2. Forneça respostas concisas e diretas
3. Quando não souber a resposta, admita isso em vez de inventar informações
4. Use emojis ocasionalmente para tornar a conversa mais amigável
5. Evite linguagem técnica complexa a menos que solicitado
6. Mantenha um tom conversacional e natural
`;

// Use esta instrução ao iniciar uma nova conversa
conversationManager.addUserMessage(conversationId, userMessage, systemInstruction);
```

### Exemplo Completo

Veja o arquivo `example.js` para um exemplo completo de como usar a integração com a OpenAI.

## Integração com o Bot do Discord

Para integrar com o bot do Discord, você pode adicionar um novo comando no arquivo `commands.js` que utilize a API da OpenAI para gerar respostas. Por exemplo:

```javascript
case 'perguntar':
  // Verifica se há uma pergunta
  if (args.length === 0) {
    return message.reply('Por favor, faça uma pergunta após o comando. Exemplo: `!perguntar como está o tempo hoje?`');
  }
  
  // Obtém a pergunta do usuário
  const question = args.join(' ');
  
  // Cria ou obtém a conversa para este usuário
  const conversationId = message.author.id;
  conversationManager.addUserMessage(conversationId, question, systemInstruction);
  
  // Envia a conversa para a API da OpenAI
  const conversation = conversationManager.getConversation(conversationId);
  const response = await openai.sendMessage(conversation);
  
  // Extrai e envia a resposta
  const answer = response.choices[0].message.content;
  conversationManager.addAssistantMessage(conversationId, answer);
  
  return message.reply(answer);
```

## Considerações sobre Tokens e Custos

A API da OpenAI cobra com base no número de tokens utilizados. Para controlar custos:

1. O `ConversationManager` limita automaticamente o número de mensagens armazenadas por conversa
2. Você pode ajustar este limite no arquivo `config.js` com a propriedade `messageLimit`
3. Use modelos mais econômicos como 'gpt-3.5-turbo' em vez de 'gpt-4'
4. Defina limites de tokens e outros parâmetros no arquivo `config.js`:

```javascript
// Exemplo de configurações no config.js
module.exports = {
  // Outras configurações...
  openai: {
    model: 'gpt-3.5-turbo',      // Modelo da OpenAI a ser utilizado
    temperature: 0.7,            // Controla a aleatoriedade das respostas (0-2)
    maxTokens: 500,              // Limite máximo de tokens na resposta
    messageLimit: 10,            // Número máximo de mensagens mantidas como contexto
    topP: 0.9,                   // Controla a diversidade via amostragem de núcleo (0-1)
    frequencyPenalty: 0.0,       // Penalidade para repetição de tokens (0-2)
    presencePenalty: 0.0,        // Penalidade para repetição de tópicos (0-2)
    systemInstruction: 'Você é um assistente útil chamado LukeAI.'
  }
};
```

Estas configurações são utilizadas automaticamente pelo `OpenAIClient` e `ConversationManager` quando importados no código:

## Documentação Adicional

Para mais informações sobre a API da OpenAI, consulte a [documentação oficial](https://platform.openai.com/docs/api-reference).