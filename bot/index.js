const venom = require('venom-bot');
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
    client.sendText("5535997286802@c.us", "ejdjeifjiemjdwimj")
    .then(result => console.log(result))
    .catch(error => console.error(error))
}
