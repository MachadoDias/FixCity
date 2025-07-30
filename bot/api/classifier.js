// api/classifier.js

async function classifyText(text) {
  // Simulação básica com base no conteúdo do texto
  const textLower = text.toLowerCase();

  const setor =
    textLower.includes('posto') || textLower.includes('remédio') ? 'Saúde' :
    textLower.includes('buraco') || textLower.includes('asfalto') ? 'Obras' :
    textLower.includes('lixo') || textLower.includes('coleta') ? 'Limpeza' :
    textLower.includes('poste') || textLower.includes('luz') ? 'Iluminação' :
    'Desconhecido';

  const nome_cidadao = textLower.includes('joão') ? 'João Silva' : null;
  const local_demanda = textLower.includes('rua') ? 'Rua das Flores, 123' : null;

  return {
    setor,
    nome_cidadao,
    local_demanda
  };
}
module.exports = {classifyText};
