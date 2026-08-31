// Selects the active session storage backend based on DATA_BACKEND.
// Both implementations (jsonStore, sheetsStore) expose the same functions,
// so server.js's routes never need to know which one is active.
import * as jsonStore from './stores/jsonStore.js';
import * as sheetsStore from './stores/sheetsStore.js';

const DATA_BACKEND = process.env.DATA_BACKEND || 'json';
const store = DATA_BACKEND === 'sheets' ? sheetsStore : jsonStore;

export const getOrCreateSession = (payload) => store.getOrCreateSession(payload);
export const getSession = (sessionId) => store.getSession(sessionId);
export const saveAnswer = (payload) => store.saveAnswer(payload);
export const saveProgress = (payload) => store.saveProgress(payload);
