import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSIONS_FILE = path.join(__dirname, '..', 'data', 'sessions.json');

const VALID_TESTES = ['disc', 'fit_cultural', 'logic'];
const VALID_ETAPAS = ['disc', 'fit_cultural', 'logic', 'completed'];

function ensureSessionsFile() {
  const dir = path.dirname(SESSIONS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(SESSIONS_FILE)) fs.writeFileSync(SESSIONS_FILE, '[]', 'utf-8');
}

function readSessions() {
  ensureSessionsFile();
  try {
    const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSessions(list) {
  ensureSessionsFile();
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

function normalizeEmail(email) {
  return String(email || '').toLowerCase().trim();
}

// Mirrors the SESSOES sheet columns (sessionId, nome, email, vaga, status,
// etapaAtual, questaoAtual, criadoEm, ultimaAtividade) plus the RESPOSTAS
// rows for this session, grouped by teste — kept shape-compatible with the
// Google Sheets backend so switching DATA_BACKEND is a drop-in.
function toPublicShape(session, isNew) {
  return {
    sessionId: session.sessionId,
    status: session.status,
    nome: session.nome,
    email: session.email,
    vaga: session.vaga,
    etapaAtual: session.etapaAtual,
    questaoAtual: session.questaoAtual,
    respostas: session.respostas,
    isNew,
  };
}

export function getOrCreateSession({ nome, email, vaga }) {
  const cleanEmail = normalizeEmail(email);
  const sessions = readSessions();
  const existing = sessions.find((s) => s.email === cleanEmail);

  if (existing) {
    if (existing.status === 'CONCLUIDA') {
      return { blocked: true };
    }
    return toPublicShape(existing, false);
  }

  const now = new Date().toISOString();
  const newSession = {
    sessionId: crypto.randomUUID(),
    nome,
    email: cleanEmail,
    vaga,
    status: 'EM_ANDAMENTO',
    etapaAtual: 'disc',
    questaoAtual: 0,
    criadoEm: now,
    ultimaAtividade: now,
    respostas: { disc: {}, fit_cultural: {}, logic: {} },
  };

  sessions.unshift(newSession);
  writeSessions(sessions);
  return toPublicShape(newSession, true);
}

export function getSession(sessionId) {
  const sessions = readSessions();
  const session = sessions.find((s) => s.sessionId === sessionId);
  return session ? toPublicShape(session, false) : null;
}

export function saveAnswer({ sessionId, teste, perguntaId, resposta }) {
  if (!VALID_TESTES.includes(teste)) {
    return { error: 'INVALID_TESTE' };
  }
  const sessions = readSessions();
  const session = sessions.find((s) => s.sessionId === sessionId);
  if (!session) return { error: 'NOT_FOUND' };
  if (session.status === 'CONCLUIDA') return { error: 'SESSION_LOCKED' };

  session.respostas[teste][perguntaId] = resposta;
  session.ultimaAtividade = new Date().toISOString();
  writeSessions(sessions);
  return { ok: true };
}

export function saveProgress({ sessionId, etapaAtual, questaoAtual }) {
  if (!VALID_ETAPAS.includes(etapaAtual)) {
    return { error: 'INVALID_ETAPA' };
  }
  const sessions = readSessions();
  const session = sessions.find((s) => s.sessionId === sessionId);
  if (!session) return { error: 'NOT_FOUND' };
  if (session.status === 'CONCLUIDA') return { error: 'SESSION_LOCKED' };

  session.etapaAtual = etapaAtual;
  session.questaoAtual = questaoAtual;
  session.ultimaAtividade = new Date().toISOString();
  writeSessions(sessions);
  return { ok: true };
}
