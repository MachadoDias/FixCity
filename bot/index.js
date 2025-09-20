const {Client, LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal')
const { messageHandler } = require('./handler.js');
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
  if(msg.hasMedia) console.log("bjhbdkedkw");
  messageHandler(client, msg);
});
client.initialize();

module.exports = client;