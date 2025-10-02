const { execFile } = require('child_process');
const path = require('path');

const Piii = require('piii');
const {inappropriateNames, ...piiiFilters} = require("piii-filters");
const piii = new Piii({
  filters: [
    ...Object.values(piiiFilters)
  ]
});

const fetch = require("node-fetch");

class SimpleQueue {
  constructor() {
    this.tasks = [];
    this.running = false;
  }
  
  async add(task) {
    return new Promise((resolve, reject) => {
      this.tasks.push({ task, resolve, reject });
      this.process();
    });
  }
  
  async process() {
    if (this.running || this.tasks.length === 0) return;
    this.running = true;
    
    while (this.tasks.length > 0) {
      const { task, resolve, reject } = this.tasks.shift();
      try {
        const result = await task();
        resolve(result);
      } catch (error) {
        reject(error);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    this.running = false;
  }
}

const queue = new SimpleQueue();

function runModel(script, text, sector = null) {
  if(piii.has(text) || hasInappropriateNames(text)) return false;
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../../classifier', script);

    execFile('python', [pythonScript, text, sector], { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        console.error(`Erro no modelo ${script}:`, stderr);
        return reject(err);
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (e) {
        reject(e);
      }
    });
  });
}

async function checkAddress(message) {
  const url = "https://nominatim.openstreetmap.org/search";
  const params = new URLSearchParams({
    q: message,
    format: "json",
    addressdetails: 1,
    limit: 1
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      headers: {
        "User-Agent": "FixCityBot/1.0 (https://github.com/MachadoDias/FixCity; contato: gabrielgabriel181007@gmail.com@gmail.com)"
      },
      timeout: 6000
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return false;
    }

    const addr = data[0].address || {};
    const addressKeys = new Set([
      "road",
      "house_number",
      "street",
      "postcode",
      "city",
      "suburb",
      "neighbourhood",
      "state"
    ]);
    const city = addr.town.toLowerCase();
    if(!city.includes('santa rita'))
      return false;
    const hasAddressKey = Object.keys(addr).some(key =>
      addressKeys.has(key)
    );

    return hasAddressKey;

  } catch (err) {
    console.error("Erro ao consultar Nominatim:", err.message);
    return false;
  }
}

function verifyName(text){
  return runModel('nome_checker.py', text);
}
function verifyDescription(text, sector){
  return runModel('setor_checker.py', text, sector);
}


function hasInappropriateNames(text){
  return inappropriateNames.some(name => text.toLowerCase().includes(name));
}

module.exports = {verifyName, verifyDescription, verifyAddress: (message) => queue.add(() => checkAddress(message)), queue};
