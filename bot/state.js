const conversationStates = new Map();

export function setUserState(userId, state) {
  conversationStates.set(userId, state);
}

export function getUserState(userId) {
  return conversationStates.get(userId);
}

export function clearUserState(userId) {
  conversationStates.delete(userId);
}
