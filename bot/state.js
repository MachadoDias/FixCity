const conversationStates = new Map();
const conversationData = new Map();

function setUserState(userId, state) {
  conversationStates.set(userId, state);
}

function getUserState(userId) {
  return conversationStates.get(userId);
}

function clearUserState(userId) {
  conversationStates.delete(userId);
  conversationData.delete(userId);
}

function setUserData(userId, key, value){
  const currentData = conversationData.get(userId) || {};
  conversationData.set(userId, {...currentData, [key]: value});
}

function getUserData(userId){
  return conversationData.get(userId) || {};
}
module.exports = {setUserState, getUserState, clearUserState, setUserData, getUserData};