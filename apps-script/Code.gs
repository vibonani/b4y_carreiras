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

// SESSOES columns (1-indexed for Range, 0-indexed for array access):
// A sessionId | B nome | C email | D vaga | E status | F etapaAtual | G questaoAtual | H criadoEm | I ultimaAtividade
// RESPOSTAS columns:
// A sessionId | B teste | C perguntaId | D resposta | E respondidoEm

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.secret !== SHARED_SECRET) {
      return jsonResponse({ error: 'UNAUTHORIZED' });
    }

    var payload = body.payload || {};
    switch (body.action) {
      case 'getOrCreateSession':
        return jsonResponse(getOrCreateSession(payload));
      case 'getSession':
        return jsonResponse(getSession(payload));
      case 'saveAnswer':
        return jsonResponse(saveAnswer(payload));
      case 'updateProgress':
        return jsonResponse(updateProgress(payload));
      default:
        return jsonResponse({ error: 'UNKNOWN_ACTION' });
    }
  } catch (err) {
    return jsonResponse({ error: 'INTERNAL_ERROR', message: String(err) });
  } finally {
    lock.releaseLock();
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

function saveAnswer(payload) {
  var sessoesSheet = getSheet(SHEET_SESSOES);
  var found = findRowByValue(sessoesSheet, 0, payload.sessionId);
  if (!found) return { error: 'NOT_FOUND' };
  if (found.row[4] === 'CONCLUIDA') return { error: 'SESSION_LOCKED' };

  var respostasSheet = getSheet(SHEET_RESPOSTAS);
  var data = respostasSheet.getDataRange().getValues();
  var now = new Date().toISOString();
  var updated = false;

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.sessionId && data[i][1] === payload.teste && String(data[i][2]) === String(payload.perguntaId)) {
      respostasSheet.getRange(i + 1, 4).setValue(payload.resposta);
      respostasSheet.getRange(i + 1, 5).setValue(now);
      updated = true;
      break;
    }
  }
  if (!updated) {
    respostasSheet.appendRow([payload.sessionId, payload.teste, payload.perguntaId, payload.resposta, now]);
  }

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
