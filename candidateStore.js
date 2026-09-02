// Selects the active session storage backend based on DATA_BACKEND.
// Both implementations (jsonStore, sheetsStore) expose the same functions,
// so server.js's routes never need to know which one is active.
import * as jsonStore from './stores/jsonStore.js';
import * as sheetsStore from './stores/sheetsStore.js';
import * as supabaseStore from './stores/supabaseStore.js';

const DATA_BACKEND = process.env.DATA_BACKEND || 'json';
const store =
  DATA_BACKEND === 'sheets' ? sheetsStore :
  DATA_BACKEND === 'supabase' ? supabaseStore :
  jsonStore;

export const getOrCreateSession = (payload) => store.getOrCreateSession(payload);
export const getSession = (sessionId) => store.getSession(sessionId);
export const saveAnswer = (payload) => store.saveAnswer(payload);
export const saveProgress = (payload) => store.saveProgress(payload);
export const completeSession = (payload) => store.completeSession(payload);
export const deleteSessionByEmail = (payload) => store.deleteSessionByEmail(payload);
export const getResults = () => store.getResults();
export const saveResult = (result) => store.saveResult(result);
export const deleteResult = (id) => store.deleteResult(id);
export const checkDuplicateResult = (payload) => store.checkDuplicateResult(payload);
export const getJobPositions = () => store.getJobPositions();
export const addJobPosition = (payload) => store.addJobPosition(payload);
