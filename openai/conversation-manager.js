// Gerenciador de conversas para manter o histórico e contexto
const OpenAIClient = require('./openai-client');
const config = require('../config');
const { openai: openaiConfig } = config;

class ConversationManager {
  constructor() {
    // Mapa para armazenar conversas por ID de usuário ou canal
    this.conversations = new Map();
    
    // Limite de mensagens por conversa para evitar tokens excessivos
    // Usa o valor configurado em config.js ou o valor padrão 10
    this.messageLimit = openaiConfig.messageLimit || 10;
  }

  /**
   * Obtém ou cria uma conversa para um determinado ID
   * @param {string} conversationId - ID único da conversa (pode ser ID do usuário ou canal)
   * @param {string} systemInstruction - Instrução de sistema para definir comportamento da IA
   * @returns {Array} - Array de mensagens da conversa
   */
  getOrCreateConversation(conversationId, systemInstruction = null) {
    if (!this.conversations.has(conversationId)) {
      const conversation = [];
      
      // Adiciona a instrução do sistema se fornecida
      if (systemInstruction) {
        conversation.push(OpenAIClient.createSystemMessage(systemInstruction));
      }
      
      this.conversations.set(conversationId, conversation);
    }
    
    return this.conversations.get(conversationId);
  }

  /**
   * Adiciona uma mensagem do usuário à conversa
   * @param {string} conversationId - ID único da conversa
   * @param {string} userMessage - Mensagem do usuário
   * @param {string} systemInstruction - Instrução de sistema (opcional)
   * @returns {Array} - Array atualizado de mensagens da conversa
   */
  addUserMessage(conversationId, userMessage, systemInstruction = null) {
    const conversation = this.getOrCreateConversation(conversationId, systemInstruction);
    
    // Adiciona a mensagem do usuário
    conversation.push(OpenAIClient.createUserMessage(userMessage));
    
    // Limita o tamanho da conversa se necessário
    this._limitConversationSize(conversation);
    
    return conversation;
  }

  /**
   * Adiciona uma resposta da IA à conversa
   * @param {string} conversationId - ID único da conversa
   * @param {string} assistantMessage - Resposta da IA
   * @returns {Array} - Array atualizado de mensagens da conversa
   */
  addAssistantMessage(conversationId, assistantMessage) {
    const conversation = this.getOrCreateConversation(conversationId);
    
    // Adiciona a resposta da IA
    conversation.push(OpenAIClient.createAssistantMessage(assistantMessage));
    
    // Limita o tamanho da conversa se necessário
    this._limitConversationSize(conversation);
    
    return conversation;
  }

  /**
   * Limita o tamanho da conversa para evitar exceder o limite de tokens
   * @param {Array} conversation - Array de mensagens da conversa
   * @private
   */
  _limitConversationSize(conversation) {
    // Mantém a mensagem do sistema (se existir)
    const systemMessage = conversation.find(msg => msg.role === 'system');
    
    // Remove mensagens antigas se exceder o limite (preservando a mensagem do sistema)
    if (conversation.length > this.messageLimit) {
      // Determina quantas mensagens remover
      const excessMessages = conversation.length - this.messageLimit;
      
      // Remove as mensagens mais antigas (exceto a mensagem do sistema)
      const messagesToKeep = conversation.filter(msg => msg.role === 'system' || 
                                                 conversation.indexOf(msg) >= excessMessages);
      
      // Limpa o array e adiciona as mensagens a manter
      conversation.length = 0;
      messagesToKeep.forEach(msg => conversation.push(msg));
    }
  }

  /**
   * Limpa o histórico de uma conversa específica
   * @param {string} conversationId - ID único da conversa
   * @param {boolean} keepSystemMessage - Se deve manter a mensagem do sistema
   * @returns {boolean} - true se a conversa foi limpa, false se não existia
   */
  clearConversation(conversationId, keepSystemMessage = true) {
    if (!this.conversations.has(conversationId)) {
      return false;
    }
    
    if (keepSystemMessage) {
      // Preserva apenas a mensagem do sistema, se existir
      const conversation = this.conversations.get(conversationId);
      const systemMessage = conversation.find(msg => msg.role === 'system');
      
      if (systemMessage) {
        this.conversations.set(conversationId, [systemMessage]);
      } else {
        this.conversations.set(conversationId, []);
      }
    } else {
      // Remove completamente a conversa
      this.conversations.delete(conversationId);
    }
    
    return true;
  }

  /**
   * Define o limite de mensagens por conversa
   * @param {number} limit - Novo limite de mensagens
   */
  setMessageLimit(limit) {
    if (typeof limit === 'number' && limit > 0) {
      this.messageLimit = limit;
    }
  }

  /**
   * Obtém todas as mensagens de uma conversa
   * @param {string} conversationId - ID único da conversa
   * @returns {Array|null} - Array de mensagens ou null se a conversa não existir
   */
  getConversation(conversationId) {
    return this.conversations.has(conversationId) 
      ? [...this.conversations.get(conversationId)] 
      : null;
  }
}

module.exports = ConversationManager;