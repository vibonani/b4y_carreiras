// Proxies the same store interface as jsonStore.js to a Google Apps Script
// web app backed by the SESSOES/RESPOSTAS/RESULTADOS/VAGAS Google Sheet.
// See apps-script/Code.gs for the corresponding server-side implementation.

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const APPS_SCRIPT_SECRET = process.env.APPS_SCRIPT_SECRET;

async function callAppsScript(action, payload) {
  let res;
  try {
    res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: APPS_SCRIPT_SECRET, action, payload }),
    });
  } catch (err) {
    throw new Error(`Não foi possível contatar o Google Apps Script: ${err.message}`);
  }
  if (!res.ok) {
    throw new Error(`Google Apps Script respondeu com status ${res.status}`);
  }
  return res.json();
}

export function getOrCreateSession({ nome, email, vaga }) {
  return callAppsScript('getOrCreateSession', { nome, email, vaga });
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
