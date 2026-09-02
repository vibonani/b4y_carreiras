// Google Apps Script backend for the Back4You assessment app.
//
// Setup:
// 1. Open your Google Sheet (with the SESSOES, RESPOSTAS, RESULTADOS, VAGAS
//    tabs already created, headers in row 1).
// 2. Extensions > Apps Script. Paste this file's content into Code.gs.
// 3. Change SHARED_SECRET below to a long random string.
// 4. Deploy > New deployment > Type: Web app.
//    - Execute as: Me
//    - Who has access: Anyone
// 5. Copy the deployment URL into APPS_SCRIPT_URL in the app's .env, and the
//    same secret into APPS_SCRIPT_SECRET. Set DATA_BACKEND=sheets.

var SHARED_SECRET = 'TROQUE-ESTE-SEGREDO-POR-UM-ALEATORIO';

var SHEET_SESSOES = 'SESSOES';
var SHEET_RESPOSTAS = 'RESPOSTAS';
var SHEET_VAGAS = 'VAGAS';
var SHEET_RESULTADOS = 'RESULTADOS';

// SESSOES columns (1-indexed for Range, 0-indexed for array access):
// A sessionId | B nome | C email | D vaga | E status | F etapaAtual | G questaoAtual | H criadoEm | I ultimaAtividade
// RESPOSTAS columns:
// A sessionId | B teste | C perguntaId | D resposta | E respondidoEm
// RESULTADOS columns:
// A id | B email | C nome | D vaga | E data | F timestamp | G status | H resultJson
// (H holds the full CandidateResult as JSON — the columns before it are just
// for a human glancing at the sheet; the app always reads H as the source of truth)
// VAGAS columns:
// A nome da vaga

// Reads don't need to wait behind the write lock below — a sheet read is
// always a consistent snapshot, so at worst a read overlapping a write sees
// slightly stale data, which is an acceptable trade-off for these. Routing
// them through the same lock as every write (saveAnswer fires on every
// question, from every candidate currently testing) was the actual cause of
// the dashboard's "loading forever" / random 502s: a lock.waitLock() outside
// any try/catch used to throw an uncaught exception on contention, which
// Apps Script turns into an HTML error page instead of the JSON callers expect.
var READ_ONLY_ACTIONS = ['getSession', 'getResults', 'checkDuplicateResult', 'getJobPositions'];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.secret !== SHARED_SECRET) {
      return jsonResponse({ error: 'UNAUTHORIZED' });
    }

    var payload = body.payload || {};

    if (READ_ONLY_ACTIONS.indexOf(body.action) !== -1) {
      return jsonResponse(dispatchAction(body.action, payload));
    }

    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000);
    } catch (lockErr) {
      return jsonResponse({ error: 'LOCK_TIMEOUT', message: 'Servidor ocupado, tente novamente.' });
    }
    try {
      return jsonResponse(dispatchAction(body.action, payload));
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return jsonResponse({ error: 'INTERNAL_ERROR', message: String(err) });
  }
}

function dispatchAction(action, payload) {
  switch (action) {
    case 'getOrCreateSession':
      return getOrCreateSession(payload);
    case 'getSession':
      return getSession(payload);
    case 'saveAnswer':
      return saveAnswer(payload);
    case 'updateProgress':
      return updateProgress(payload);
    case 'completeSession':
      return completeSession(payload);
    case 'deleteSessionByEmail':
      return deleteSessionByEmail(payload);
    case 'getResults':
      return getResults(payload);
    case 'saveResult':
      return saveResult(payload);
    case 'deleteResult':
      return deleteResult(payload);
    case 'checkDuplicateResult':
      return checkDuplicateResult(payload);
    case 'getJobPositions':
      return getJobPositions();
    case 'addJobPosition':
      return addJobPosition(payload);
    default:
      return { error: 'UNKNOWN_ACTION' };
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getSheet(name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error('Aba não encontrada: ' + name);
  return sheet;
}

function normalizeEmail(email) {
  return String(email || '').toLowerCase().trim();
}

function findRowByValue(sheet, colIndex, value) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][colIndex] === value) {
      return { rowIndex: i + 1, row: data[i] };
    }
  }
  return null;
}

function getSessionRespostas(sessionId) {
  var data = getSheet(SHEET_RESPOSTAS).getDataRange().getValues();
  var respostas = { disc: {}, fit_cultural: {}, logic: {} };
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0] === sessionId && respostas[row[1]]) {
      respostas[row[1]][row[2]] = row[3];
    }
  }
  return respostas;
}

function sessionRowToPublicShape(row, isNew) {
  return {
    sessionId: row[0],
    nome: row[1],
    email: row[2],
    vaga: row[3],
    status: row[4],
    etapaAtual: row[5],
    questaoAtual: row[6],
    respostas: getSessionRespostas(row[0]),
    isNew: !!isNew,
  };
}

function getOrCreateSession(payload) {
  var email = normalizeEmail(payload.email);
  var sheet = getSheet(SHEET_SESSOES);
  var found = findRowByValue(sheet, 2, email); // column C = email

  if (found) {
    if (found.row[4] === 'CONCLUIDA') {
      return { blocked: true };
    }
    return sessionRowToPublicShape(found.row, false);
  }

  var sessionId = Utilities.getUuid();
  var now = new Date().toISOString();
  var newRow = [sessionId, payload.nome || '', email, payload.vaga || '', 'EM_ANDAMENTO', 'disc', 0, now, now];
  sheet.appendRow(newRow);
  return sessionRowToPublicShape(newRow, true);
}

function getSession(payload) {
  var found = findRowByValue(getSheet(SHEET_SESSOES), 0, payload.sessionId); // column A = sessionId
  if (!found) return { error: 'NOT_FOUND' };
  return sessionRowToPublicShape(found.row, false);
}

// Always appends rather than scanning RESPOSTAS to find-and-update the
// existing row for this question. The whole request runs under the global
// LockService lock (see doPost), so an O(n) scan here held up every other
// in-flight request against the script — including the candidate's own
// completeSession call moments later, which is what made the last question
// of a test feel like it hung. getSessionRespostas() already folds repeated
// answers to the same question by taking the last matching row in sheet
// order, so a changed answer just needs a newer row, not an in-place edit.
function saveAnswer(payload) {
  var sessoesSheet = getSheet(SHEET_SESSOES);
  var found = findRowByValue(sessoesSheet, 0, payload.sessionId);
  if (!found) return { error: 'NOT_FOUND' };
  if (found.row[4] === 'CONCLUIDA') return { error: 'SESSION_LOCKED' };

  var respostasSheet = getSheet(SHEET_RESPOSTAS);
  var now = new Date().toISOString();
  respostasSheet.appendRow([payload.sessionId, payload.teste, payload.perguntaId, payload.resposta, now]);
  sessoesSheet.getRange(found.rowIndex, 9).setValue(now); // ultimaAtividade
  return { ok: true };
}

function updateProgress(payload) {
  var sheet = getSheet(SHEET_SESSOES);
  var found = findRowByValue(sheet, 0, payload.sessionId);
  if (!found) return { error: 'NOT_FOUND' };
  if (found.row[4] === 'CONCLUIDA') return { error: 'SESSION_LOCKED' };

  var now = new Date().toISOString();
  sheet.getRange(found.rowIndex, 6).setValue(payload.etapaAtual);   // etapaAtual
  sheet.getRange(found.rowIndex, 7).setValue(payload.questaoAtual); // questaoAtual
  sheet.getRange(found.rowIndex, 9).setValue(now);                  // ultimaAtividade
  return { ok: true };
}

// Marks a session CONCLUIDA once the candidate finishes all tests, so a
// later visit (same email or the localStorage sessionId) is blocked from
// resuming or re-answering instead of being dropped back into the old test.
// Idempotent: calling it again on an already-CONCLUIDA session is a no-op.
function completeSession(payload) {
  var sheet = getSheet(SHEET_SESSOES);
  var found = findRowByValue(sheet, 0, payload.sessionId);
  if (!found) return { error: 'NOT_FOUND' };
  if (found.row[4] === 'CONCLUIDA') return { ok: true };

  var now = new Date().toISOString();
  sheet.getRange(found.rowIndex, 5).setValue('CONCLUIDA'); // status
  sheet.getRange(found.rowIndex, 6).setValue('completed'); // etapaAtual
  sheet.getRange(found.rowIndex, 9).setValue(now);          // ultimaAtividade
  return { ok: true };
}

// Deletes a candidate's SESSOES row and every matching RESPOSTAS row by
// e-mail, so they can start a brand-new assessment from scratch. Used by
// the admin "excluir candidato" action — server.js calls this after removing
// the finished result from data/candidates.json, since simply deleting the
// result wouldn't be enough: the SESSOES row (CONCLUIDA) is what actually
// blocks a re-application via getOrCreateSession.
function deleteSessionByEmail(payload) {
  var email = normalizeEmail(payload.email);
  var sessoesSheet = getSheet(SHEET_SESSOES);
  var found = findRowByValue(sessoesSheet, 2, email); // column C = email
  if (!found) return { ok: true };

  var sessionId = found.row[0];
  sessoesSheet.deleteRow(found.rowIndex);

  // Walk RESPOSTAS bottom-up so deleting a row doesn't shift the index of
  // rows not yet visited.
  var respostasSheet = getSheet(SHEET_RESPOSTAS);
  var data = respostasSheet.getDataRange().getValues();
  for (var i = data.length - 1; i >= 1; i--) {
    if (data[i][0] === sessionId) {
      respostasSheet.deleteRow(i + 1);
    }
  }

  return { ok: true };
}

// Returns every finished assessment for the management dashboard, newest
// first (append-order in the sheet is oldest-first, so this just reverses
// it) — matches the local json store's unshift-on-save ordering.
function getResults() {
  var data = getSheet(SHEET_RESULTADOS).getDataRange().getValues();
  var results = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;
    try {
      results.push(JSON.parse(row[7]));
    } catch (err) {
      // Skip a malformed row rather than failing the whole dashboard load.
    }
  }
  results.reverse();
  return results;
}

// Idempotent on payload.result.id: the app retries a failed save with the
// same id, so a row that's already there means an earlier attempt actually
// succeeded and only the response was lost — re-appending would duplicate it.
function saveResult(payload) {
  var result = payload.result || {};
  var sheet = getSheet(SHEET_RESULTADOS);
  if (findRowByValue(sheet, 0, result.id)) return { ok: true };

  sheet.appendRow([
    result.id || '',
    normalizeEmail(result.email),
    result.fullName || '',
    result.jobPosition || '',
    result.date || '',
    result.timestamp || Date.now(),
    result.status || '',
    JSON.stringify(result),
  ]);
  return { ok: true };
}

// Used by the admin "excluir candidato" action, alongside deleteSessionByEmail.
function deleteResult(payload) {
  var sheet = getSheet(SHEET_RESULTADOS);
  var found = findRowByValue(sheet, 0, payload.id); // column A = id
  if (!found) return { error: 'NOT_FOUND' };

  var email = found.row[1];
  sheet.deleteRow(found.rowIndex);
  return { ok: true, email: email };
}

// Returns every vaga in the VAGAS sheet, used both by the public
// identification form's dropdown and by the management dashboard.
function getJobPositions() {
  var data = getSheet(SHEET_VAGAS).getDataRange().getValues();
  var jobPositions = [];
  for (var i = 1; i < data.length; i++) {
    var nome = String(data[i][0] || '').trim();
    if (nome) jobPositions.push(nome);
  }
  return { jobPositions: jobPositions };
}

// Adds a new vaga if it isn't already present (case-insensitive), so
// management can create one from the dashboard when a new position opens up.
function addJobPosition(payload) {
  var nome = String((payload && payload.nome) || '').trim();
  if (!nome) return { error: 'INVALID_NAME' };

  var sheet = getSheet(SHEET_VAGAS);
  var data = sheet.getDataRange().getValues();
  var jobPositions = [];
  var exists = false;
  for (var i = 1; i < data.length; i++) {
    var existing = String(data[i][0] || '').trim();
    if (!existing) continue;
    jobPositions.push(existing);
    if (existing.toLowerCase() === nome.toLowerCase()) exists = true;
  }

  if (!exists) {
    sheet.appendRow([nome]);
    jobPositions.push(nome);
  }

  return { jobPositions: jobPositions };
}

// Public duplicate check used by the identification form, before exposing
// any other candidate's data.
function checkDuplicateResult(payload) {
  var email = normalizeEmail(payload.email);
  var phone = String(payload.phone || '').replace(/\D/g, '');
  var data = getSheet(SHEET_RESULTADOS).getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;
    var result;
    try {
      result = JSON.parse(row[7]);
    } catch (err) {
      continue;
    }
    if (result.email && email && String(result.email).toLowerCase().trim() === email) {
      return { isDuplicate: true, reason: 'email' };
    }
    if (result.phone) {
      var existingDigits = String(result.phone).replace(/\D/g, '');
      if (phone && phone.length >= 8 && existingDigits.indexOf(phone) !== -1) {
        return { isDuplicate: true, reason: 'phone' };
      }
    }
  }
  return { isDuplicate: false };
}
