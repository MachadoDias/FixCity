const { logError, generateDemandId } = require('./utils.js');
const { classifyText } = require('./api/classifier.js');
const { saveDemand } = require('./api/backend.js');
const { setUserState, getUserState, clearUserState } = require('./state.js');

async function messageHandler(client, message) {
  try {
    const userId = message.from;
    const previousState = getUserState(userId);

    const fs = require('fs');
    const mime = require('mime-types');

    // Recepção de imagem
    if (message.type === 'image' && message.mimetype) {
      const buffer = await client.decryptFile(message);
      const extension = mime.extension(message.mimetype) || 'jpg';
      const filename = `data/uploads/${generateDemandId()}.${extension}`;

      await fs.promises.writeFile(filename, buffer);
      console.log('🖼️ Imagem salva em:', filename);
      await client.sendText(userId, '🖼️ Imagem recebida! Ela será anexada à sua demanda.');

      const updatedState = {
        ...previousState,
        image_path: filename,
        originalText: previousState?.originalText || '',
      };
      setUserState(userId, updatedState);
      return;
    }

    if (message.isGroupMsg || !message.body) return;

    // Usuário está em acompanhamento
    if (previousState) {
      const updatedText = (previousState.originalText || '') + ' ' + message.body;
      const classification = await classifyText(updatedText);

      // Prioriza modelo Python, usa regex como fallback
      const hasName = classification.nome_cidadao || 
        (classification.confidence < 0.7 ? updatedText.match(/(?:meu nome é|nome é|me chamo|sou)\s+([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][a-záàâãéêíóôõúç]+)(?:\s+([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][a-záàâãéêíóôõúç]+))?/i) : null);
      
      const hasLocation = classification.local_demanda || 
        (classification.confidence < 0.7 ? updatedText.match(/(?:na\s+)?(?:rua|av|avenida|praça|r\.)\s+([a-záàâãéêíóôõúç\s]+?)(?:\s+\d+|$|\s+foi|\s+tem|\s+está)/i) : null);
      
      const finalName = typeof hasName === 'string' ? hasName : 
        (hasName && hasName[1] ? (hasName[1] + (hasName[2] ? ' ' + hasName[2] : '')).trim() : null);
      const finalLocation = typeof hasLocation === 'string' ? hasLocation : 
        (hasLocation && hasLocation[1] ? hasLocation[1].trim() : null);

      if (finalName && finalLocation) {
        const newDemand = {
          id: generateDemandId(),
          text: updatedText,
          image_path: previousState?.image_path || null,
          contato_cidadao: userId,
          setor: classification.setor,
          nome_cidadao: finalName,
          local_demanda: finalLocation,
          confidence: classification.confidence
        };

        await saveDemand(newDemand);
        await client.sendText(userId, '✅ Sua demanda foi registrada com sucesso!');
        clearUserState(userId);
      } else {
        const missing = [];
        if (!finalName) missing.push('seu nome completo');
        if (!finalLocation) missing.push('o endereço da ocorrência');
        await client.sendText(userId, `Ainda preciso de ${missing.join(' e ')}.`);
        setUserState(userId, {
          ...previousState,
          originalText: updatedText,
        });
      }

      return;
    }

    // Primeira mensagem
    console.log('Mensagem recebida:', message.body);
    const classification = await classifyText(message.body);

    // Prioriza modelo Python, usa regex apenas se confiança baixa
    const hasName = classification.nome_cidadao || 
      (classification.confidence < 0.7 ? message.body.match(/(?:meu nome é|nome é|me chamo|sou)\s+([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][a-záàâãéêíóôõúç]+)(?:\s+([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][a-záàâãéêíóôõúç]+))?/i) : null);
    
    const hasLocation = classification.local_demanda || 
      (classification.confidence < 0.7 ? message.body.match(/(?:na\s+)?(?:rua|av|avenida|praça|r\.)\s+([a-záàâãéêíóôõúç\s]+?)(?:\s+\d+|$|\s+foi|\s+tem|\s+está)/i) : null);
    
    const finalName = typeof hasName === 'string' ? hasName : 
      (hasName && hasName[1] ? (hasName[1] + (hasName[2] ? ' ' + hasName[2] : '')).trim() : null);
    const finalLocation = typeof hasLocation === 'string' ? hasLocation : 
      (hasLocation && hasLocation[1] ? hasLocation[1].trim() : null);

    if (finalName && finalLocation) {
      const state = getUserState(userId);

      const newDemand = {
        id: generateDemandId(),
        text: message.body,
        image_path: state?.image_path || null,
        contato_cidadao: userId,
        setor: classification.setor,
        nome_cidadao: finalName,
        local_demanda: finalLocation,
        confidence: classification.confidence
      };

      await saveDemand(newDemand);
      await client.sendText(userId, '✅ Sua demanda foi registrada com sucesso!');
      clearUserState(userId);
    } else {
      const missing = [];
      if (!finalName) missing.push('seu nome completo');
      if (!finalLocation) missing.push('o endereço da ocorrência');
      const ajuda = `Entendi sua solicitação sobre '${classification.setor}'. Para registrar, me envie ${missing.join(' e ')}.`;
      await client.sendText(userId, ajuda);
      setUserState(userId, {
        originalText: message.body,
      });
    }
  } catch (error) {
    logError(error);
    await client.sendText(message.from, '⚠️ Ocorreu um erro ao processar sua solicitação');
  }
}

module.exports = { messageHandler };