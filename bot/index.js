const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal')
const { messageHandler } = require('./handler.js');
const startTime = Date.now();
const express = require('express');
const app = express();
const { setUserState, getUserState, clearUserState, setUserData, getUserData } = require('./state.js');
app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "fixcity-bot"
  })
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('client is ready');
  app.listen(3001, () => {
    console.log('Server is running on port 3001');
  })
});

client.on('message', msg => {
  console.log(msg.type);
  if (msg.from.endsWith('@g.us')) return;
  if(msg.type === 'album' || msg.type === 'e2e_notification' || msg.type === 'notification_template') return;
  if (msg.type !== 'chat' && msg.type !== 'location' && msg.type !== 'image') {
    client.sendMessage(msg.from, "Infelizmente não consigo entender esse tipo de mensagem");
    return;
  }
  const userData = getUserData(msg.from) || {};
  if (msg.type === 'image') {
    const currentCount = userData.imageCounter || 0;
    const newCount = currentCount + 1;
    setUserData(msg.from, 'imageCounter', newCount);
    if (newCount > 1) {
      setUserData(msg.from, 'imageCounter', 0);
      return;
    }
  } else {
    setUserData(msg.from, 'imageCounter', 0);
  }
  if (msg.timestamp * 1000 >= startTime) messageHandler(client, msg);
});


app.post('/notify', async (req, res) => {
  const { contact, sector, status } = req.body;
  await client.sendMessage(contact, `Olá! Sua demanda sobre ${sector} encontra-se atualmente ${status}`);
  res.send("ok");
});
client.initialize();
module.exports = client;