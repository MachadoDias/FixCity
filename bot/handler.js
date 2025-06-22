import { logError, generateDemandId } from './utils.js';
import { classifyText } from './api/classifier.js';
import { saveDemand } from './api/backend.js';
import { setUserState, getUserState, clearUserState } from './state.js';

export async function messageHandler(client, message) {
    try {
        if (message.type === 'image' && message.mimetype) {
            const media = await client.downloadMedia(message);

            const extension = message.mimetype.split('/')[1] || 'jpg';
            const filename = `uploads/${generateDemandId()}.${extension}`;
            const fs = await import('fs');
            const buffer = Buffer.from(media, 'base64');
            fs.writeFileSync(filename, buffer);

            await client.sendText(message.from, '🖼️ Imagem recebida! Ela será anexada à sua demanda.');

            const previousState = getUserState(message.from);
            if (previousState) {
                setUserState(message.from, {
                    ...previousState,
                    image_path: filename
                });
            } else {
                setUserState(message.from, {
                    originalText: '',
                    image_path: filename
                });
            }

            return;
        }

        if (message.isGroupMsg || !message.body) return;

        const userId = message.from;
        const previousState = getUserState(userId);

        // Usuário está em uma conversa de acompanhamento
        if (previousState) {
            const updatedText = previousState.originalText + ' ' + message.body;
            const updatedClassification = await classifyText(updatedText);

            const hasName = updatedClassification.nome_cidadao;
            const hasLocation = updatedClassification.local_demanda;

            if (hasName && hasLocation) {
                const previousState = getUserState(userId); // lá em cima

                const newDemand = {
                    id: generateDemandId(),
                    text: message.body,
                    image_path: previousState?.image_path || null,
                    ...classification,
                };

                await saveDemand(newDemand);
                await client.sendText(userId, 'Sua demanda foi registrada com sucesso!');
                clearUserState(userId);
            } else {
                // Ainda falta alguma coisa
                const missing = [];
                if (!hasName) missing.push('seu nome completo');
                if (!hasLocation) missing.push('o endereço da ocorrência');
                await client.sendText(userId, `Ainda preciso de ${missing.join(' e ')}.`);
                // Atualiza estado com novo texto
                setUserState(userId, {
                    originalText: updatedText
                });
            }

            return;
        }

        // Primeira interação: classifica normalmente
        console.log('Mensagem recebida:', message.body);
        const classification = await classifyText(message.body);

        const hasName = classification.nome_cidadao;
        const hasLocation = classification.local_demanda;

        if (hasName && hasLocation) {
            const newDemand = {
                id: generateDemandId(),
                text: message.body,
                image_path: previousState?.image_path || null,
                ...updatedClassification,
            };


            await saveDemand(newDemand);
            await client.sendText(userId, 'Sua demanda foi registrada com sucesso!');
        } else {
            const missing = [];
            if (!hasName) missing.push('seu nome completo');
            if (!hasLocation) missing.push('o endereço da ocorrência');
            const ajuda = `Entendi sua solicitação sobre '${classification.setor}'. Para registrar, me envie ${missing.join(' e ')}.`;
            await client.sendText(userId, ajuda);
            setUserState(userId, {
                originalText: message.body,
            });
        }
    } catch (error) {
        logError(error);
        await client.sendText(message.from, 'Ocorreu um erro ao processar sua solicitação');
    }
}
