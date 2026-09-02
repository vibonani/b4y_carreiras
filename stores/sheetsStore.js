// Proxies the same store interface as jsonStore.js to a Google Apps Script
// web app backed by the SESSOES/RESPOSTAS/RESULTADOS/VAGAS Google Sheet.
// See apps-script/Code.gs for the corresponding server-side implementation.

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const APPS_SCRIPT_SECRET = process.env.APPS_SCRIPT_SECRET;
const REQUEST_TIMEOUT_MS = 20000;

// Without a timeout, a slow or stuck Apps Script execution (LockService
// contention, a cold start, a quota hiccup) hangs this fetch indefinitely —
// which left the dashboard's "loading" spinner spinning forever with no
// error ever surfacing, since nothing ever rejected.
async function callAppsScript(action, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: APPS_SCRIPT_SECRET, action, payload }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Tempo esgotado ao contatar o Google Apps Script.');
    }
    throw new Error(`Não foi possível contatar o Google Apps Script: ${err.message}`);
  } finally {
    clearTimeout(timeout);
  }
  if (!res.ok) {
    throw new Error(`Google Apps Script respondeu com status ${res.status}`);
  }
  return res.json();
}

export function getOrCreateSession({ nome, email, telefone, vaga }) {
  return callAppsScript('getOrCreateSession', { nome, email, telefone, vaga });
}

export function getSession(sessionId) {
  return callAppsScript('getSession', { sessionId });
}

export function saveAnswer({ sessionId, teste, perguntaId, resposta }) {
  return callAppsScript('saveAnswer', { sessionId, teste, perguntaId, resposta });
}

export function saveProgress({ sessionId, etapaAtual, questaoAtual }) {
  return callAppsScript('updateProgress', { sessionId, etapaAtual, questaoAtual });
}

export function completeSession({ sessionId }) {
  return callAppsScript('completeSession', { sessionId });
}

export function deleteSessionByEmail({ email }) {
  return callAppsScript('deleteSessionByEmail', { email });
}

export function getResults() {
  return callAppsScript('getResults', {});
}

export function saveResult(result) {
  return callAppsScript('saveResult', { result });
}

export function deleteResult(id) {
  return callAppsScript('deleteResult', { id });
}

export function checkDuplicateResult({ email, phone }) {
  return callAppsScript('checkDuplicateResult', { email, phone });
}

export function getJobPositions() {
  return callAppsScript('getJobPositions', {});
}

export function addJobPosition({ nome }) {
  return callAppsScript('addJobPosition', { nome });
}
