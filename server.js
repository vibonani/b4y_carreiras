import 'dotenv/config';
import express from 'express';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import * as candidateStore from './candidateStore.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 8787;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const COOKIE_NAME = 'b4y_session';
const isProd = process.env.NODE_ENV === 'production';

// DATA_BACKEND controls where session/answer/progress data is stored.
// 'json' (default) uses the local candidateStore (data/sessions.json).
// 'sheets' proxies to Google Apps Script (see apps-script/Code.gs).
// 'supabase' uses a Supabase Postgres project (see supabase/schema.sql).
const DATA_BACKEND = process.env.DATA_BACKEND || 'json';
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const APPS_SCRIPT_SECRET = process.env.APPS_SCRIPT_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!ADMIN_PASSWORD || !SESSION_SECRET) {
  console.error(
    '\n[FATAL] Defina ADMIN_PASSWORD e SESSION_SECRET no arquivo .env antes de iniciar o servidor.\n' +
    'Veja .env.example para o formato esperado.\n'
  );
  process.exit(1);
}

if (DATA_BACKEND === 'sheets') {
  if (!APPS_SCRIPT_URL || !APPS_SCRIPT_SECRET) {
    console.error(
      '\n[FATAL] Defina APPS_SCRIPT_URL e APPS_SCRIPT_SECRET no arquivo .env para usar DATA_BACKEND=sheets.\n' +
      'Veja .env.example para o formato esperado.\n'
    );
    process.exit(1);
  }
} else if (DATA_BACKEND === 'supabase') {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error(
      '\n[FATAL] Defina SUPABASE_URL e SUPABASE_SERVICE_KEY no arquivo .env para usar DATA_BACKEND=supabase.\n' +
      'Veja .env.example para o formato esperado.\n'
    );
    process.exit(1);
  }
} else if (DATA_BACKEND !== 'json') {
  console.error(`\n[FATAL] DATA_BACKEND inválido: "${DATA_BACKEND}". Valores aceitos: "json", "sheets" ou "supabase".\n`);
  process.exit(1);
}

// ---------- Session cookie (HMAC-signed, httpOnly) ----------
function sign(value) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('hex');
}

function createSessionToken() {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL_MS });
  const b64 = Buffer.from(payload, 'utf-8').toString('base64url');
  const sig = sign(b64);
  return `${b64}.${sig}`;
}

function verifySessionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false;
  const [b64, sig] = token.split('.');
  const expectedSig = sign(b64);
  const sigBuf = Buffer.from(sig || '', 'utf-8');
  const expectedBuf = Buffer.from(expectedSig, 'utf-8');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf-8'));
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((pair) => {
      const idx = pair.indexOf('=');
      const key = decodeURIComponent(pair.slice(0, idx).trim());
      const val = decodeURIComponent(pair.slice(idx + 1).trim());
      return [key, val];
    })
  );
}

function requireAuth(req, res, next) {
  const cookies = parseCookies(req);
  if (verifySessionToken(cookies[COOKIE_NAME])) return next();
  return res.status(401).json({ error: 'Não autenticado.' });
}

// ---------- Basic in-memory rate limiting for login ----------
const loginAttempts = new Map(); // ip -> { count, resetAt }
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(ip) {
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < Date.now()) {
    loginAttempts.set(ip, { count: 0, resetAt: Date.now() + WINDOW_MS });
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function registerFailedAttempt(ip) {
  const entry = loginAttempts.get(ip) || { count: 0, resetAt: Date.now() + WINDOW_MS };
  entry.count += 1;
  loginAttempts.set(ip, entry);
}

// Without these, an error nobody anticipated (a bad third-party response, a
// stray rejected promise) would otherwise crash the whole process — killing
// every candidate's and every admin's connection at once until someone
// manually restarts it. Logging and carrying on keeps that failure scoped to
// whichever single request triggered it.
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
});
process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err);
});

// ---------- App ----------
const app = express();
app.use(express.json());

const apiRouter = express.Router();

apiRouter.post('/auth/login', (req, res) => {
  const ip = req.ip;
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Muitas tentativas. Tente novamente em alguns minutos.' });
  }

  const { password } = req.body || {};
  const provided = Buffer.from(String(password || ''), 'utf-8');
  const expected = Buffer.from(ADMIN_PASSWORD, 'utf-8');
  const valid = provided.length === expected.length && crypto.timingSafeEqual(provided, expected);

  if (!valid) {
    registerFailedAttempt(ip);
    return res.status(401).json({ error: 'Senha incorreta.' });
  }

  const token = createSessionToken();
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}; SameSite=Strict${isProd ? '; Secure' : ''}`
  ]);
  res.json({ success: true });
});

apiRouter.post('/auth/logout', (req, res) => {
  res.setHeader('Set-Cookie', [`${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${isProd ? '; Secure' : ''}`]);
  res.json({ success: true });
});

apiRouter.get('/auth/status', (req, res) => {
  const cookies = parseCookies(req);
  res.json({ authenticated: verifySessionToken(cookies[COOKIE_NAME]) });
});

// Protected: full candidate list for the management dashboard
apiRouter.get('/candidates', requireAuth, async (req, res) => {
  try {
    res.json(await candidateStore.getResults());
  } catch (err) {
    res.status(502).json({ error: 'Serviço de planilhas indisponível.' });
  }
});

// Public: a candidate submitting their own finished assessment
apiRouter.post('/candidates', async (req, res) => {
  const record = req.body;
  if (!record || typeof record !== 'object' || !record.email) {
    return res.status(400).json({ error: 'Registro inválido.' });
  }
  try {
    // A locked-out write (e.g. Apps Script's lock busy with a concurrent
    // candidate's answer) resolves with an { error } object rather than
    // rejecting — treat that the same as a thrown error, not a success.
    const result = await candidateStore.saveResult(record);
    if (result && result.error) {
      return res.status(502).json({ error: 'Serviço de planilhas indisponível.' });
    }
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(502).json({ error: 'Serviço de planilhas indisponível.' });
  }
});

// Protected: removes a candidate's finished result AND resets their session
// (SESSOES + RESPOSTAS), so management can let them apply again from scratch.
// Deleting only the result wouldn't be enough — the CONCLUIDA session row is
// what actually blocks getOrCreateSession from letting them start over.
apiRouter.delete('/candidates/:id', requireAuth, async (req, res) => {
  let deleted;
  try {
    deleted = await candidateStore.deleteResult(req.params.id);
  } catch (err) {
    return res.status(502).json({ error: 'Serviço de planilhas indisponível.' });
  }
  if (deleted.error === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Candidato não encontrado.' });
  }
  if (deleted.error) {
    return res.status(502).json({ error: 'Serviço de planilhas indisponível.' });
  }

  try {
    const result = await candidateStore.deleteSessionByEmail({ email: deleted.email });
    // The result is already gone; failing to reset the session (e.g. Apps
    // Script briefly unreachable, or an outdated deployment that doesn't
    // know this action yet) shouldn't undo that — flag it instead so the
    // admin knows the e-mail may still be blocked and can retry.
    res.json({ success: true, sessionResetFailed: !!(result && result.error) });
  } catch (err) {
    res.json({ success: true, sessionResetFailed: true });
  }
});

// Public: duplicate check without exposing other candidates' data
apiRouter.post('/candidates/check-duplicate', async (req, res) => {
  const { email, phone } = req.body || {};
  try {
    res.json(await candidateStore.checkDuplicateResult({ email, phone }));
  } catch (err) {
    res.status(502).json({ error: 'Serviço de planilhas indisponível.' });
  }
});

// Public: list of vagas, needed to populate the candidate identification form
apiRouter.get('/job-positions', async (req, res) => {
  try {
    res.json(await candidateStore.getJobPositions());
  } catch (err) {
    res.status(502).json({ error: 'Serviço de planilhas indisponível.' });
  }
});

// Protected: management adds a new vaga so it becomes selectable on the form
apiRouter.post('/job-positions', requireAuth, async (req, res) => {
  const { nome } = req.body || {};
  if (!nome || !String(nome).trim()) {
    return res.status(400).json({ error: 'Nome da vaga é obrigatório.' });
  }
  try {
    res.json(await candidateStore.addJobPosition({ nome }));
  } catch (err) {
    res.status(502).json({ error: 'Serviço de planilhas indisponível.' });
  }
});

// ---------- Session flow (create/resume, incremental answers & progress) ----------
// Public: candidate identification submits here to create a new session or resume
// an existing EM_ANDAMENTO one (looked up by email). Returns {blocked: true} if the
// candidate already has a CONCLUIDA session.
apiRouter.post('/session/start', async (req, res) => {
  const { fullName, email, phone, jobPosition } = req.body || {};
  if (!email || !String(email).trim()) {
    return res.status(400).json({ error: 'E-mail é obrigatório.' });
  }
  try {
    const result = await candidateStore.getOrCreateSession({ nome: fullName, email, telefone: phone, vaga: jobPosition });
    if (result && result.error && !('blocked' in result)) {
      return res.status(502).json({ error: 'Serviço de planilhas indisponível.' });
    }
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: 'Serviço de planilhas indisponível.' });
  }
});

// Public: used on page load to silently resume a session remembered in localStorage
apiRouter.get('/session/:id', async (req, res) => {
  try {
    const session = await candidateStore.getSession(req.params.id);
    if (!session || session.error === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Sessão não encontrada.' });
    }
    res.json(session);
  } catch (err) {
    res.status(502).json({ error: 'Serviço de planilhas indisponível.' });
  }
});

// Public: persists a single answer as soon as the candidate selects an option
apiRouter.post('/session/:id/answer', async (req, res) => {
  const { teste, perguntaId, resposta } = req.body || {};
  if (!teste || perguntaId === undefined || perguntaId === null || !resposta) {
    return res.status(400).json({ error: 'Dados de resposta incompletos.' });
  }
  try {
    const result = await candidateStore.saveAnswer({ sessionId: req.params.id, teste, perguntaId, resposta });
    if (result.error === 'NOT_FOUND') return res.status(404).json(result);
    if (result.error === 'SESSION_LOCKED') return res.status(409).json(result);
    if (result.error) return res.status(400).json(result);
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: 'Serviço de planilhas indisponível.' });
  }
});

// Public: persists the current step/question position on every navigation
apiRouter.post('/session/:id/progress', async (req, res) => {
  const { etapaAtual, questaoAtual } = req.body || {};
  if (!etapaAtual || typeof questaoAtual !== 'number') {
    return res.status(400).json({ error: 'Dados de progresso incompletos.' });
  }
  try {
    const result = await candidateStore.saveProgress({ sessionId: req.params.id, etapaAtual, questaoAtual });
    if (result.error === 'NOT_FOUND') return res.status(404).json(result);
    if (result.error === 'SESSION_LOCKED') return res.status(409).json(result);
    if (result.error) return res.status(400).json(result);
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: 'Serviço de planilhas indisponível.' });
  }
});

// Public: marks the session CONCLUIDA once the candidate finishes all tests,
// so a later visit (reload, or same e-mail again) is blocked from resuming
// instead of being dropped back into the old in-progress test.
apiRouter.post('/session/:id/complete', async (req, res) => {
  try {
    const result = await candidateStore.completeSession({ sessionId: req.params.id });
    if (result.error === 'NOT_FOUND') return res.status(404).json(result);
    if (result.error) return res.status(400).json(result);
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: 'Serviço de planilhas indisponível.' });
  }
});

app.use('/api', apiRouter);

// ---------- Serve built frontend in production ----------
if (isProd) {
  const distDir = path.join(__dirname, 'dist');
  app.use(express.static(distDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
