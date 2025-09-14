const { logError, generateDemandId } = require('./utils.js');
const { verifyDescription, verifyAddress, verifyName } = require('./api/classifier.js');
const { saveDemand } = require('./api/backend.js');
const { setUserState, getUserState, clearUserState, setUserData, getUserData } = require('./state.js');

const sectors = ["iluminacao", "limpeza", "obras", "saude"];

// msg inicial -> desc problema -> endereco -> nome -> foto

async function messageHandler(client, message) {
    try {
        const userId = message.from;
        const userState = getUserState(userId);

        if (message.fromMe || !message.body) return;

        if (!userState) {
            await client.sendMessage(userId, "👋 Olá, seja bem-vindo(a) ao nosso atendimento! Para começarmos, por favor, informe o setor da sua demanda: \n1 Iluminação \n2 Limpeza \n3 Obras \n4 Saúde \nDigite o número do setor correspondente à sua solicitação");
            setUserData(userId, {});
            setUserState(userId, "waitingSector");
        }
        else {
            switch (userState) {
                case "waitingSector":
                    const choice = parseInt(message.body);
                    if (choice >= 1 && choice <= 4) {
                        setUserState(userId, "waitingDescription");
                        setUserData(userId, "setor", sectors[choice - 1]);
                        await client.sendMessage(userId, "Entendi! Agora descreva o problema");
                    } 
                    else {
                        await client.sendMessage(userId, "Opção inválida. Digite 1, 2, 3 ou 4.");
                    }
                    break;
                case "waitingDescription":
                    const userData = getUserData(userId);
                    const descricaoValida = await verifyDescription(message.body, userData.setor);
                    if (!descricaoValida)
                        await client.sendMessage(userId, "A descrição que você enviou não parece estar relacionada ao setor informado, pode tentar de novo?");
                    else {
                        await client.sendMessage(userId, "Certo! Agora me diga o endereço da demanda");
                        setUserState(userId, "waitingAddress");
                        setUserData(userId, "descricao", message.body);
                    }
                    break;
                case "waitingAddress":
                    const enderecoValido = await verifyAddress(message.body);
                    if (!enderecoValido)
                        await client.sendMessage(userId, "O endereço que você enviou parece estar errado, pode tentar de novo?");
                    else {
                        await client.sendMessage(userId, "Perfeito! Agora me diga seu nome completo. Por favor, envie apenas o nome nesta mensagem para que eu possa entender corretamente.");
                        setUserState(userId, "waitingName");
                        setUserData(userId, "endereco", message.body);
                    }
                    break;
                case "waitingName":
                    const nomeValido = await verifyName(message.body);
                    if (!nomeValido)
                        await client.sendMessage(userId, "O nome que você enviou não parece estar certo, pode tentar de novo?");
                    else {
                        await client.sendMessage(userId, "Tudo certo! Deseja adicionar alguma imagem na sua solicitação? Digite 1 para sim e 2 para não");
                        setUserState(userId, "askingForImage");
                        setUserData(userId, "nome", message.body);
                    }
                    break;
                case "askingForImage":
                    if (message.body == 1) {
                        setUserState(userId, "waitingImage");
                    }
                    else if (message.body == 2) {
                        const userData = getUserData(userId);
                        const demand = {
                            setor: userData.setor,
                            descricao: userData.descricao,
                            nome_cidadao: userData.nome,
                            contato_cidadao: userId,
                            local_demanda: userData.endereco
                        };
                        saveDemand(demand);
                        clearUserState(userId);
                        await client.sendMessage(userId, '✅ Sua demanda foi registrada com sucesso!');
                        break;
                    }
                case "waitingImage":
                    const fs = require('fs');
                    const mime = require('mime-types');
                    if (message.type === 'image' && message.hasMedia) {
                        const media = await message.downloadMedia();
                        const buffer = Buffer.from(media.data, 'base64');
                        const extension = mime.extension(message.mimetype) || 'jpg';
                        const filename = `data/uploads/${generateDemandId()}.${extension}`;

                        await fs.promises.writeFile(filename, buffer);
                        console.log('🖼️ Imagem salva em:', filename);
                        await client.sendMessage(userId, '🖼️ Imagem recebida! Ela será anexada à sua demanda.');

                        const userData = getUserData(userId);
                        const demand = {
                            setor: userData.setor,
                            descricao: userData.descricao,
                            nome_cidadao: userData.nome,
                            contato_cidadao: userId,
                            local_demanda: userData.endereco,
                            image_path: filename
                        };
                        saveDemand(demand);
                        clearUserState(userId);
                        await client.sendMessage(userId, '✅ Sua demanda foi registrada com sucesso!');
                        return;
                    }
            }
        }
    }
    catch (error) {
        logError(error);
        await client.sendMessage(message.from, '⚠️ Ocorreu um erro ao processar sua solicitação');
    }
}

module.exports = { messageHandler };