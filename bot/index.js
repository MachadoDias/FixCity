const venom = require('venom-bot');
import {messageHandler} from './handler.js';
venom
    .create({
  session: "session-name",
  puppeteerOptions: {
    headless: 'new',
    executablePath: '/opt/google/chrome/chrome'
  }
})
    .then(client => start(client))
    .catch(error => console.error(error))

function start(client){
    client.onMessage(messageHandler);
}
