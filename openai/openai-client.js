// Cliente para comunicação com a API da OpenAI
const { OpenAI } = require('openai');
const config = require('../config');
const { openai: openaiConfig } = config;

class OpenAIClient {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('API Key da OpenAI não fornecida');
    }
    
    this.client = new OpenAI({
      apiKey: apiKey
    });
  }

  /**
   * Envia uma mensagem para a API da OpenAI e retorna a resposta
   * @param {Array} messages - Array de mensagens no formato da OpenAI
   * @param {Object} options - Opções adicionais para a requisição
   * @returns {Promise<Object>} - Resposta da API da OpenAI
   */
  async sendMessage(messages, options = {}) {
    try {
      const defaultOptions = {
        model: openaiConfig.model || 'gpt-3.5-turbo',
        temperature: openaiConfig.temperature || 0.7,
        max_tokens: openaiConfig.maxTokens || 1000,
        top_p: openaiConfig.topP || 1,
        frequency_penalty: openaiConfig.frequencyPenalty || 0,
        presence_penalty: openaiConfig.presencePenalty || 0
      };

      const requestOptions = {
        ...defaultOptions,
        ...options,
        messages: messages
      };

      const response = await this.client.chat.completions.create(requestOptions);
      return response;
    } catch (error) {
      console.error('Erro ao enviar mensagem para a OpenAI:', error);
      throw error;
    }
  }

  /**
   * Cria uma mensagem no formato esperado pela API da OpenAI
   * @param {string} role - Papel do remetente (system, user, assistant)
   * @param {string} content - Conteúdo da mensagem
   * @returns {Object} - Mensagem formatada
   */
  static createMessage(role, content) {
    return { role, content };
  }

  /**
   * Cria uma mensagem de sistema para definir o comportamento da IA
   * @param {string} instruction - Instrução para a IA
   * @returns {Object} - Mensagem de sistema formatada
   */
  static createSystemMessage(instruction) {
    return this.createMessage('system', instruction);
  }

  /**
   * Cria uma mensagem de usuário
   * @param {string} content - Conteúdo da mensagem do usuário
   * @returns {Object} - Mensagem de usuário formatada
   */
  static createUserMessage(content) {
    return this.createMessage('user', content);
  }

  /**
   * Cria uma mensagem de assistente (resposta anterior da IA)
   * @param {string} content - Conteúdo da mensagem do assistente
   * @returns {Object} - Mensagem de assistente formatada
   */
  static createAssistantMessage(content) {
    return this.createMessage('assistant', content);
  }
}

module.exports = OpenAIClient;