function getCurrentTimestamp() {
  return new Date().toISOString();
}
function logError(error) {
  console.error(`[ERRO - ${getCurrentTimestamp()}]:`, error.message);
}

function generateDemandId() {
  return Date.now().toString();
}
module.exports = {getCurrentTimestamp, logError, generateDemandId};