import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSIONS_FILE = path.join(__dirname, '..', 'data', 'sessions.json');
const RESULTS_FILE = path.join(__dirname, '..', 'data', 'candidates.json');
const JOB_POSITIONS_FILE = path.join(__dirname, '..', 'data', 'jobPositions.json');

// Seeded into jobPositions.json only if that file doesn't exist yet — in
// practice it already does (migrated from the Sheets backend), so this only
// matters for a from-scratch install.
const DEFAULT_JOB_POSITIONS = ['Social Media'];

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

// Mirrors the SESSOES sheet columns (sessionId, nome, email, telefone, vaga,
// status, etapaAtual, questaoAtual, criadoEm, ultimaAtividade) plus the
// RESPOSTAS rows for this session, grouped by teste — kept shape-compatible
// with the Google Sheets backend so switching DATA_BACKEND is a drop-in.
function toPublicShape(session, isNew) {
  return {
    sessionId: session.sessionId,
    status: session.status,
    nome: session.nome,
    email: session.email,
    telefone: session.telefone || '',
    vaga: session.vaga,
    etapaAtual: session.etapaAtual,
    questaoAtual: session.questaoAtual,
    respostas: session.respostas,
    isNew,
  };
}

export function getOrCreateSession({ nome, email, telefone, vaga }) {
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
    telefone: telefone || '',
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

// Marks a session CONCLUIDA once the candidate finishes all tests. Idempotent:
// calling it again on an already-CONCLUIDA session is a no-op, not an error.
export function completeSession({ sessionId }) {
  const sessions = readSessions();
  const session = sessions.find((s) => s.sessionId === sessionId);
  if (!session) return { error: 'NOT_FOUND' };
  if (session.status === 'CONCLUIDA') return { ok: true };

  session.status = 'CONCLUIDA';
  session.etapaAtual = 'completed';
  session.ultimaAtividade = new Date().toISOString();
  writeSessions(sessions);
  return { ok: true };
}

// Removes a candidate's session entirely so they can start a brand-new
// assessment. Used by the admin "excluir candidato" action.
export function deleteSessionByEmail({ email }) {
  const cleanEmail = normalizeEmail(email);
  const sessions = readSessions();
  writeSessions(sessions.filter((s) => s.email !== cleanEmail));
  return { ok: true };
}

function ensureResultsFile() {
  const dir = path.dirname(RESULTS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(RESULTS_FILE)) fs.writeFileSync(RESULTS_FILE, '[]', 'utf-8');
}

function readResults() {
  ensureResultsFile();
  try {
    const raw = fs.readFileSync(RESULTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeResults(list) {
  ensureResultsFile();
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

export function getResults() {
  return readResults();
}

// Idempotent on result.id: the app retries a failed save with the same id,
// so a matching row already present means an earlier attempt actually
// succeeded and only the response was lost — appending again would duplicate it.
export function saveResult(result) {
  const list = readResults();
  if (list.some((r) => r.id === result.id)) return { ok: true };
  list.unshift(result);
  writeResults(list);
  return { ok: true };
}

// Used by the admin "excluir candidato" action, alongside deleteSessionByEmail.
export function deleteResult(id) {
  const list = readResults();
  const found = list.find((r) => r.id === id);
  if (!found) return { error: 'NOT_FOUND' };
  writeResults(list.filter((r) => r.id !== id));
  return { ok: true, email: found.email };
}

function ensureJobPositionsFile() {
  const dir = path.dirname(JOB_POSITIONS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(JOB_POSITIONS_FILE)) {
    fs.writeFileSync(JOB_POSITIONS_FILE, JSON.stringify(DEFAULT_JOB_POSITIONS, null, 2), 'utf-8');
  }
}

function readJobPositions() {
  ensureJobPositionsFile();
  try {
    const raw = fs.readFileSync(JOB_POSITIONS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_JOB_POSITIONS;
  } catch {
    return DEFAULT_JOB_POSITIONS;
  }
}

function writeJobPositions(list) {
  ensureJobPositionsFile();
  fs.writeFileSync(JOB_POSITIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

export function getJobPositions() {
  return { jobPositions: readJobPositions() };
}

// Adds a new vaga if it isn't already present (case-insensitive), so
// management can create one from the dashboard when a new position opens up.
export function addJobPosition({ nome }) {
  const trimmed = String(nome || '').trim();
  if (!trimmed) return { error: 'INVALID_NAME' };

  const list = readJobPositions();
  const exists = list.some((p) => p.toLowerCase() === trimmed.toLowerCase());
  if (!exists) {
    list.push(trimmed);
    writeJobPositions(list);
  }
  return { jobPositions: list };
}

export function checkDuplicateResult({ email, phone }) {
  const cleanEmail = normalizeEmail(email);
  const cleanPhone = String(phone || '').replace(/\D/g, '');
  const list = readResults();

  for (const c of list) {
    if (c.email && cleanEmail && c.email.toLowerCase().trim() === cleanEmail) {
      return { isDuplicate: true, reason: 'email' };
    }
    if (c.phone) {
      const existingDigits = c.phone.replace(/\D/g, '');
      if (cleanPhone && cleanPhone.length >= 8 && existingDigits.includes(cleanPhone)) {
        return { isDuplicate: true, reason: 'phone' };
      }
    }
  }
  return { isDuplicate: false };
}
