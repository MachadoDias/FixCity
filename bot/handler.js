const { logError, generateDemandId, VerifyNumberOfTries } = require('./utils.js');
const { verifyDescription, verifyAddress, verifyName } = require('./api/classifier.js');
const { saveDemand } = require('./api/backend.js');
const { setUserState, getUserState, clearUserState, setUserData, getUserData } = require('./state.js');

const sectors = ["Iluminação", "Limpeza", "Obras", "Saúde"];

// msg inicial -> desc problema -> endereco -> nome -> foto

async function messageHandler(client, message) {
    try {
        const userId = message.from;
        const userState = getUserState(userId);
<<<<<<< Updated upstream
        if (message.fromMe) return;

         (!userState) {
=======
        const r = /[()\{\};]/;
        if (message.fromMe) return;
        
        if (!userState) {
>>>>>>> Stashed changes
            await client.sendMessage(userId, "👋 Olá, seja bem-vindo(a) ao nosso atendimento! Para começarmos, por favor, informe o setor da sua demanda: \n1 Iluminação (quedas constantes de energia, poste queimado)\n2 Limpeza (animal morto, lixos ou galhos na rua) \n3 Obras (árvore caída, ponte quebrada, esgoto, buraco na rua) \n4 Saúde (falta de vacinas, intoxicação alimentar) \nDigite o número do setor correspondente à sua solicitação");
            setUserData(userId, {});
            setUserState(userId, "waitingSector");
            setUserData(userId, "numeroDeTentativas", 0);
        }
        else {
            if(r.test(message.body)){
                        await client.sendMessage(userId, "⚠️ Caractere inválido detectado na mensagem. Por favor, evite usar os seguintes caracteres: ( ) { } ;");
            return;
        } if(message.body.lenght < 3){
                        await client.sendMessage(userId, "Preciso de mais informações para te ajudar. Pode detalhar mais?");
            return;
        }
            switch (userState) {
                case "waitingSector":
                    const choice = parseInt(message.body);
                    if (choice >= 1 && choice <= 4) {
                        setUserState(userId, "waitingDescription");
                        setUserData(userId, "setor", sectors[choice - 1]);
                        await client.sendMessage(userId, "Entendi! Agora descreva o problema");
                        setUserData(userId, "numeroDeTentativas", 0);
                    } 
                    else {
                        if(VerifyNumberOfTries(client, message))
                            await client.sendMessage(userId, "Opção inválida. Digite 1, 2, 3 ou 4.");
                    }
                    break;
                case "waitingDescription":
                    if(message.type !== 'chat') return;
                    const userData = getUserData(userId);
                    const descricaoValida = await verifyDescription(message.body, userData.setor);
                    if (!descricaoValida){
                        if(VerifyNumberOfTries(client, message))
                            await client.sendMessage(userId, "A descrição que você enviou não parece estar relacionada ao setor informado, pode tentar de novo?");
                    }
                    else {
                        await client.sendMessage(userId, "Certo! Agora me diga o endereço da demanda, você pode digitar ou compartilhar a localização (Ex.: Rua do Sol, 6918 - Jardim das Acácias)");
                        setUserState(userId, "waitingAddress");
                        setUserData(userId, "descricao", message.body);
                        setUserData(userId, "numeroDeTentativas", 0);
                    }
                    break;
                case "waitingAddress":
                    if(message.type !== 'location' && message.type !== 'chat') return;
                    const enderecoValido = message.type ==='location' || await verifyAddress(message.body);
                    if (!enderecoValido){
                        if(VerifyNumberOfTries(client, message))
                            await client.sendMessage(userId, "O endereço que você enviou parece estar errado, pode tentar de novo?");
                    }
                    else {
                        await client.sendMessage(userId, "Perfeito! Agora me diga seu nome completo. Por favor, envie apenas o nome nesta mensagem para que eu possa entender corretamente.");
                        setUserState(userId, "waitingName");
                        setUserData(userId, "endereco", message.type === 'location' ? message.location.address : message.body);
                        setUserData(userId, "numeroDeTentativas", 0);
                    }
                    break;
                case "waitingName":
                    if(message.type !== 'chat') return;
                    const nomeValido = await verifyName(message.body);
                    if (!nomeValido){
                        if(VerifyNumberOfTries(client, message))
                            await client.sendMessage(userId, "O nome que você enviou não parece estar certo, pode tentar de novo?");
                    }
                    else {
                        await client.sendMessage(userId, "Tudo certo! Deseja adicionar alguma imagem na sua solicitação? Digite 1 para sim e 2 para não");
                        setUserState(userId, "askingForImage");
                        setUserData(userId, "nome", message.body);
                        setUserData(userId, "numeroDeTentativas", 0);
                    }
                    break;
                case "askingForImage":
                    if (message.body == 1) {
                        setUserState(userId, "waitingImage");
                        client.sendMessage(userId, "Ok, envie sua imagem");
                        break;
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
                    VerifyNumberOfTries(client, message);
                case "waitingImage":
                    console.log("entrou no switch");
                    const fs = require('fs');
                    const mime = require('mime-types');
                    if (message.hasMedia) {
                        console.log("entrou no if");
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
                    VerifyNumberOfTries(client, message);
            }
        }
    }
    catch (error) {
        logError(error);
        await client.sendMessage(message.from, '⚠️ Ocorreu um erro ao processar sua solicitação');
    }
}

module.exports = { messageHandler };