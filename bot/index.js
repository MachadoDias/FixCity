const {Client, LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal')
const { messageHandler } = require('./handler.js');
const startTime = Date.now();
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "fixcity-bot"
  })
});
client.on('qr', (qr) => {
  qrcode.generate(qr, {small: true});
});
client.on('ready', () => {
  console.log('client is ready');
});
client.on('message', msg => {
  if(msg.from.endsWith('@g.us')) return;
  if(msg.type !== 'chat' && msg.type !== 'location' && msg.type !== 'image') return;
  if(msg.timestamp * 1000 >= startTime) messageHandler(client, msg);
});
client.initialize();
