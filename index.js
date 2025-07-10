const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect
  .create()
  .then((client) => start(client))
  .catch((error) => console.log(error));

function start(client)
{
    client.onMessage((message) => {
        if (message.body.toLowerCase() === 'oi' || message.body.toLowerCase() === 'ola' || message.body.toLowerCase() === 'olá')
        {
            client
                .sendText(message.from, 'Olá, como posso te ajudar?')
                .then((result) => {
                    console.log('Result: ', result); //return object success
                })
                .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                });
        }
  });
}