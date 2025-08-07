// api/classifier.js
const { spawn } = require('child_process');
const path = require('path');

async function classifyText(text) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../../classifier/api_wrapper.py');
    const python = spawn('python', [pythonScript, text]);
    
    let output = '';
    let error = '';
    
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        console.error('Erro no classificador Python:', error);
        // Fallback para classificação simples
        resolve(fallbackClassify(text));
      } else {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (e) {
          console.error('Erro ao parsear resultado:', e);
          resolve(fallbackClassify(text));
        }
      }
    });
  });
}

function fallbackClassify(text) {
  const textLower = text.toLowerCase();
  
  const setor =
    textLower.includes('posto') || textLower.includes('remédio') || textLower.includes('saude') ? 'Saude' :
    textLower.includes('buraco') || textLower.includes('asfalto') || textLower.includes('obra') ? 'Obras' :
    textLower.includes('lixo') || textLower.includes('coleta') || textLower.includes('limpe') ? 'Limpeza' :
    textLower.includes('poste') || textLower.includes('luz') || textLower.includes('lampada') ? 'Iluminacao' :
    'Obras';
    
  return {
    setor,
    nome_cidadao: null,
    local_demanda: null,
    confidence: 0.5
  };
}

module.exports = {classifyText};
