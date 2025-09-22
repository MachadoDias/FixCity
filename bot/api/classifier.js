const { execFile } = require('child_process');
const path = require('path');

const Piii = require('piii');
const {inappropriateNames, ...piiiFilters} = require("piii-filters");
const piii = new Piii({
  filters: [
    ...Object.values(piiiFilters)
  ]
});

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

function verifyAddress(text){
  return runModel('endereco_checker.py', text);
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

module.exports = {verifyAddress, verifyName, verifyDescription};
