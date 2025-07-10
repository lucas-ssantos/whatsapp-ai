require('dotenv').config();

//INICIA WPPCONNECT
const wppconnect = require('@wppconnect-team/wppconnect');

//INICIA OPENAI API
const { OpenAIClient, ConversationManager } = require('./openai');
const config = require('./config');
const { openai: openaiConfig } = config;

// Inicializa o cliente da OpenAI e o gerenciador de conversas
let openai;
let conversationManager;

// Inicializa a integração com a OpenAI se a chave de API estiver disponível
try
{
    if(process.env.OPENAI_API_KEY)
    {
        openai = new OpenAIClient(process.env.OPENAI_API_KEY);
        conversationManager = new ConversationManager();
        console.log('Integração com a OpenAI inicializada com sucesso!');
    }
    else
    {
        console.error('OPENAI_API_KEY não configurada ou inválida.');
        process.exit(1);
    }
}
catch (error)
{
    console.error('Erro ao inicializar a integração com a OpenAI:', error);
    process.exit(1);
}

// Instrução de sistema para personalizar o comportamento da IA (usando a configuração do config.js)
const systemInstruction = openaiConfig.systemInstruction;

const wppcliente = wppconnect.create({
	session: 'Whatsapp',
	catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {},
	statusFind: (statusSession, session) => {
		console.log('Status da Sessão: ', statusSession, '\n')
		console.log('Nome da Sessão: ', session, '\n')
	},
	folderNameToken: 'tokens',
	headless: true,
    useChrome: true,
	disableWelcome: true,
	autoClose: 60000,
	createPathFileToken: true,
})

wppconnect
  .create()
  .then((wppconnect) => start(wppconnect))
  .catch((error) => console.log(error));

wppconnect.defaultLogger.level = 'silly';
  
async function start(client)
{
    client.onIncomingCall(async (call) => {
		console.log(call)
		client.sendText(
			call.peerJid,
			'Desculpe, mas no momento não estamos atendendo a ligações!'
		)
	})

    client.onMessage(async (message) => {

        //ENVIA COMANDO DE DIGITANDO
        client.startTyping(message.from);

        //PEGA O ID DO USUÁRIO QUE MANDOU A MENSSAGEM
        let userId = message.from;

        // ID único para a conversa
        let conversationId = 'cliente-'+userId;

        // Adiciona uma mensagem do usuário à conversa
        conversationManager.addUserMessage(
            conversationId, 
            message.body,
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

        //PARA DE DIGITAR...
        client.stopTyping(message.from);

        //RESPONDE A MENSSAGEM COM A RESPOTA DA IA
        client
            .sendText(message.from, assistantResponse)
            .then((result) => {
                console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
            });
  });
}