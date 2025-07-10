//Configurações do Projeto
module.exports = {
  // Configurações da OpenAI
  openai: {
    // Modelo padrão da OpenAI
    //model: 'gpt-3.5-turbo',
    model: 'gpt-4.1-nano',
    
    // Temperatura para controlar a aleatoriedade das respostas (0-1)
    temperature: 0.3,
    
    // Limite máximo de tokens para a resposta
    maxTokens: 1000,
    
    // Limite de mensagens por conversa para manter como contexto
    messageLimit: 10,
    
    // Frequência de penalidade (-2.0 a 2.0)
    // Valores positivos penalizam tokens que já apareceram, diminuindo repetições
    frequencyPenalty: 1.0,
    
    // Penalidade de presença (-2.0 a 2.0)
    // Valores positivos penalizam tokens que já apareceram no texto, aumentando a probabilidade
    // de falar sobre novos tópicos
    presencePenalty: 0.0,
    
    // Top P (0-1)
    // Controla a diversidade das respostas, valores menores = mais focado
    topP: 1.0,
    
    // Instrução padrão do sistema para a IA
    systemInstruction: 'Você é um atendente de concessionária útil e amigável que trabalha para SantosDealership. ' +
                       'A concessionária trabalha com os caros mais populares brasileiros. ' +
                       'Responda de forma concisa e educada. ' +
                       'Quando não souber a resposta, admita isso em vez de inventar informações.'
  }
};