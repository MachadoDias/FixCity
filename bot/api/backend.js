const fetch = require('node-fetch');

async function saveDemand(data) {
  const payload = {
    title: data.setor || 'Demanda',
    description: data.text,
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

module.exports = { saveDemand };
