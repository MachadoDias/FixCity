const axios = require('axios');

const GEMINI_API_KEY = ''; 
async function classifyWithGemini(text) {
  try {
    console.log('Chamando Gemini...');
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      contents: [{
        parts: [{
          text: `Analise este texto e retorne JSON válido:
{"setor":"obras","nome_cidadao":null,"local_demanda":null}

Regras:
- setor: "obras", "saude", "iluminacao" ou "limpeza"
- nome_cidadao: extrair nome completo ou null
- local_demanda: extrair endereço/rua ou null

Texto: "${text}"`
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 100
      }
    });

    const result = response.data.candidates[0].content.parts[0].text;
    console.log('Resposta Gemini:', result);
    
    const cleanResult = result.replace(/```json|```|`/g, '').trim();
    return JSON.parse(cleanResult);
  } catch (error) {
    console.error('Erro Gemini:', error.response?.data || error.message);
    return { setor: 'obras', nome_cidadao: null, local_demanda: null };
  }
}

module.exports = { classifyWithGemini };