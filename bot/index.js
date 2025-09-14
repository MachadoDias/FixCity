const venom = require('venom-bot');
const { messageHandler } = require('./handler.js');

venom
  .create({
    session: 'session-name',
    headless: 'new',
    puppeteerOptions: {
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    }
  })
  .then((client) => start(client))
  .catch((error) => console.error(error));

function start(client) {
  client.onMessage((message) =>{
    messageHandler(client, message);
    console.log("mensagem crua:", message);
    client.sendText(message.from, "bjseejhedj");
  }); 
}
