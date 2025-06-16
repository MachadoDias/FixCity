export function getCurrentTimestamp() {
  return new Date().toISOString();
}
export function logError(error) {
  console.error(`[ERRO - ${getCurrentTimestamp()}]:`, error.message);
}

export function generateDemandId() {
  return Date.now().toString();
}