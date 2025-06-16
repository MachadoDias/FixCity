import { logError, generateDemandId } from './utils.js';
import { classifyText } from './api/classifier.js';
import { saveDemand } from './api/backend.js';

export async function messageHandler(message){
    try {
        if(message.isGroupMsg || !message.body) return;
        console.log('Mensagem recebida:', message.body);
        const classification = await classifyText(message.body);
        
        const newDemand = {
            id: generateDemandId(),
            text: message.body,
            ...classification, // Adiciona o resultado da IA
        };
        await saveDemand(newDemand);
        await client.sendText(message.from, 'Sua demanda foi registrada com sucesso!');
    }
    catch {
        logError(error);
        await client.sendText(message.from, 'Ocorreu um erro ao processar sua solicitação');
    }
}