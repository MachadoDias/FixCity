const { setUserState, getUserState, clearUserState, setUserData, getUserData } = require('./state.js');
function getCurrentTimestamp() {
  return new Date().toISOString();
}
function logError(error) {
  console.error(`[ERRO - ${getCurrentTimestamp()}]:`, error.message);
}

function generateDemandId() {
  return Date.now().toString();
}
function VerifyNumberOfTries(client, message){
  const userId = message.from;
  const userData = getUserData(userId);
  if(userData.numeroDeTentativas > 3){
    client.sendMessage(userId, "Infelizmente não foi possível registrar sua demanda");
    clearUserState(userId);
    return;
  }
  setUserData(userId, "numeroDeTentativas", userData.numeroDeTentativas + 1);
}
module.exports = {getCurrentTimestamp, logError, generateDemandId, VerifyNumberOfTries};