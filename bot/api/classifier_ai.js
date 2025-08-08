const { classifyWithGemini } = require('./gemini_classifier');

const CLASSIFIER_TYPE = 'gemini';

async function classifyText(text) {
  try {
    switch (CLASSIFIER_TYPE) {
      case 'gemini':
        return await classifyWithGemini(text);
      default:
        return await classifyWithLocal(text);
    }
  } catch (error) {
    console.error('Erro na classificação:', error);
    return { setor: 'obras', nome_cidadao: null, local_demanda: null };
  }
}

// Classificador local (fallback)
async function classifyWithLocal(text) {
  const { spawn } = require('child_process');
  const path = require('path');
  
  return new Promise((resolve) => {
    const pythonScript = path.join(__dirname, '../../classifier/api_wrapper.py');
    const process = spawn('python', [pythonScript, text]);
    
    let output = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.on('close', (code) => {
      if (code !== 0) {
        resolve(fallbackClassify(text));
      } else {
        try {
          resolve(JSON.parse(output.trim()));
        } catch (e) {
          resolve(fallbackClassify(text));
        }
      }
    });
  });
}

function fallbackClassify(text) {
  const textLower = text.toLowerCase();
  
  const setor =
    textLower.includes('posto') || textLower.includes('remédio') || textLower.includes('saude') ? 'saude' :
    textLower.includes('buraco') || textLower.includes('asfalto') || textLower.includes('obra') ? 'obras' :
    textLower.includes('lixo') || textLower.includes('coleta') || textLower.includes('limpe') ? 'limpeza' :
    textLower.includes('poste') || textLower.includes('luz') || textLower.includes('lampada') ? 'iluminacao' :
    'obras';
    
  return {
    setor,
    nome_cidadao: null,
    local_demanda: null
  };
}

module.exports = { classifyText };