const conversationStates = new Map();

function setUserState(userId, state) {
  conversationStates.set(userId, state);
}

function getUserState(userId) {
  return conversationStates.get(userId);
}

function clearUserState(userId) {
  conversationStates.delete(userId);
}
module.exports = {setUserState, getUserState, clearUserState};