const fetch = require('node-fetch');
const client = require('../index.js');

async function saveDemand(data) {
  const payload = {
    title: data.setor || 'Demanda',
    description: data.descricao,
    requester: data.nome_cidadao,
    requester_contact: data.contato_cidadao,
    location: data.local_demanda,
    image_path: data.image_path || null
  };

  try {
    const res = await fetch('http://localhost:5000/api/demands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Erro ao salvar demanda: ${res.status} - ${error}`);
    }

    const result = await res.json();
    console.log('✅ Demanda registrada na API:', result);
    return result;
  } catch (error) {
    console.error('❌ Erro ao salvar demanda na API:', error.message);
    throw error;
  }
}

function sendDemandUpdates(requester_contact, requester, sector, status){
  client.sendMessage(requester_contact, `Olá, sr(a) ${requester}! Sua demanda de ${sector} atualmente está ${status}`);
}

if(require.main === module){
  sendDemandUpdates(process.argv[1], process.argv[2], process.argv[3], process.argv[4]);
}

module.exports = { saveDemand, sendDemandUpdates };
