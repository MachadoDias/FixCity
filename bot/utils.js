require("dotenv").config();
const fetch = require("node-fetch");

const { clearUserState, setUserData, getUserData } = require('./state.js');
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
  if(userData.numeroDeTentativas > 2){
    client.sendMessage(userId, "Infelizmente não foi possível registrar sua demanda");
    clearUserState(userId);
    return false;
  }
  setUserData(userId, "numeroDeTentativas", userData.numeroDeTentativas + 1);
  return true;
}

async function getAddress(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

  const res = await fetch(url, {
    headers: { "User-Agent": "FixCity" }
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  const data = await res.json();

  const parse = parseAddress(data);
  return `${parse.street}, ${parse.number}, ${parse.neighborhood}`;
}

function parseAddress(nominatimData) {
  if (!nominatimData) return null;
  const addr = nominatimData.address || {};
  const display = nominatimData.display_name || "";

  const street = addr.road || addr.pedestrian || addr.cycleway || addr.residential || addr.footway || "";

  const neighborhood = addr.neighbourhood || addr.suburb || addr.city_district || addr.village || "";

  let number = addr.house_number || "";
  if (!number) {
    const m = display.match(/\b(\d{1,6}[A-Za-z]?)\b/);
    if (m) number = m[1];
  }

  return {
    street: street || null,
    neighborhood: neighborhood || null,
    number: number || null
  };
}

getAddress(-23.55052, -46.633308).then(console.log);

module.exports = {getCurrentTimestamp, logError, generateDemandId, VerifyNumberOfTries, getAddress};