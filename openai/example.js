// Exemplo de uso da integração com a OpenAI
const { OpenAIClient, ConversationManager } = require('./index');
const config = require('../config');
const { openai: openaiConfig } = config;

// Função de exemplo para demonstrar o uso da integração
async function exampleUsage() {
  try {
    // Inicializa o cliente da OpenAI com a chave de API
    const openai = new OpenAIClient(process.env.OPENAI_API_KEY);
    
    // Inicializa o gerenciador de conversas
    const conversationManager = new ConversationManager();
    
    // ID único para a conversa (pode ser ID do usuário ou canal)
    const conversationId = 'example-conversation';
    
    // Instrução de sistema para personalizar o comportamento da IA (usando a configuração do config.js)
    const systemInstruction = openaiConfig.systemInstruction;
    
    // Adiciona uma mensagem do usuário à conversa
    conversationManager.addUserMessage(
      conversationId, 
      'Olá! Como você pode me ajudar hoje?',
      systemInstruction // A instrução do sistema é passada apenas na primeira mensagem
    );
    
    // Obtém a conversa atual
    const conversation = conversationManager.getConversation(conversationId);
    
    // Envia a conversa para a API da OpenAI com as configurações do config.js
    const response = await openai.sendMessage(conversation, {
      model: openaiConfig.model,
      temperature: openaiConfig.temperature,
      max_tokens: openaiConfig.maxTokens,
      top_p: openaiConfig.topP,
      frequency_penalty: openaiConfig.frequencyPenalty,
      presence_penalty: openaiConfig.presencePenalty
    });
    
    // Extrai a resposta da IA
    const assistantResponse = response.choices[0].message.content;
    console.log('Resposta da IA:', assistantResponse);
    
    // Adiciona a resposta da IA à conversa para manter o contexto
    conversationManager.addAssistantMessage(conversationId, assistantResponse);
    
    // Adiciona outra mensagem do usuário para continuar a conversa
    conversationManager.addUserMessage(conversationId, 'Quais são suas funcionalidades principais?');
    
    // Obtém a conversa atualizada
    const updatedConversation = conversationManager.getConversation(conversationId);
    
    // Envia a conversa atualizada para a API da OpenAI com as configurações do config.js
    const secondResponse = await openai.sendMessage(updatedConversation, {
      model: openaiConfig.model,
      temperature: openaiConfig.temperature,
      max_tokens: openaiConfig.maxTokens,
      top_p: openaiConfig.topP,
      frequency_penalty: openaiConfig.frequencyPenalty,
      presence_penalty: openaiConfig.presencePenalty
    });
    
    // Extrai a segunda resposta da IA
    const secondAssistantResponse = secondResponse.choices[0].message.content;
    console.log('Segunda resposta da IA:', secondAssistantResponse);
    
    // Adiciona a segunda resposta da IA à conversa
    conversationManager.addAssistantMessage(conversationId, secondAssistantResponse);
    
    // Exibe a conversa completa
    console.log('\nConversa completa:');
    const fullConversation = conversationManager.getConversation(conversationId);
    fullConversation.forEach(message => {
      console.log(`[${message.role}]: ${message.content}`);
    });
    
    // Limpa a conversa, mantendo apenas a instrução do sistema
    conversationManager.clearConversation(conversationId, true);
    console.log('\nConversa limpa (mantendo instrução do sistema):');
    console.log(conversationManager.getConversation(conversationId));
    
  } catch (error) {
    console.error('Erro no exemplo:', error);
  }
}

// Executa o exemplo se este arquivo for executado diretamente
if (require.main === module) {
  // Carrega as variáveis de ambiente
  require('dotenv').config({ path: '../.env' });
  
  // Verifica se a chave da API está definida
  if (!process.env.OPENAI_API_KEY) {
    console.error('Erro: OPENAI_API_KEY não está definida nas variáveis de ambiente');
    process.exit(1);
  }
  
  // Executa o exemplo
  exampleUsage().catch(console.error);
}

module.exports = { exampleUsage };