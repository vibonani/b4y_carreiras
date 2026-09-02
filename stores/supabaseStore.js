// Proxies the same store interface as jsonStore.js/sheetsStore.js to a
// Supabase Postgres project. See supabase/schema.sql for the table
// definitions this expects (sessions, results, job_positions).

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

const VALID_TESTES = ['disc', 'fit_cultural', 'logic'];
const VALID_ETAPAS = ['disc', 'fit_cultural', 'logic', 'completed'];

function normalizeEmail(email) {
  return String(email || '').toLowerCase().trim();
}

function toPublicShape(row, isNew) {
  return {
    sessionId: row.session_id,
    status: row.status,
    nome: row.nome,
    email: row.email,
    telefone: row.telefone || '',
    vaga: row.vaga,
    etapaAtual: row.etapa_atual,
    questaoAtual: row.questao_atual,
    respostas: row.respostas,
    isNew,
  };
}

export async function getOrCreateSession({ nome, email, telefone, vaga }) {
  const cleanEmail = normalizeEmail(email);

  const { data: existing, error: findErr } = await supabase
    .from('sessions')
    .select('*')
    .ilike('email', cleanEmail)
    .maybeSingle();
  if (findErr) return { error: findErr.message };

  if (existing) {
    if (existing.status === 'CONCLUIDA') {
      return { blocked: true };
    }
    return toPublicShape(existing, false);
  }

  const { data: created, error: insertErr } = await supabase
    .from('sessions')
    .insert({
      nome,
      email: cleanEmail,
      telefone: telefone || '',
      vaga,
      status: 'EM_ANDAMENTO',
      etapa_atual: 'disc',
      questao_atual: 0,
      respostas: { disc: {}, fit_cultural: {}, logic: {} },
    })
    .select()
    .single();
  if (insertErr) return { error: insertErr.message };

  return toPublicShape(created, true);
}

export async function getSession(sessionId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('session_id', sessionId)
    .maybeSingle();
  if (error) return { error: error.message };
  return data ? toPublicShape(data, false) : null;
}

export async function saveAnswer({ sessionId, teste, perguntaId, resposta }) {
  if (!VALID_TESTES.includes(teste)) {
    return { error: 'INVALID_TESTE' };
  }
  const { data: session, error: findErr } = await supabase
    .from('sessions')
    .select('respostas, status')
    .eq('session_id', sessionId)
    .maybeSingle();
  if (findErr) return { error: findErr.message };
  if (!session) return { error: 'NOT_FOUND' };
  if (session.status === 'CONCLUIDA') return { error: 'SESSION_LOCKED' };

  const respostas = session.respostas;
  respostas[teste][perguntaId] = resposta;

  const { error: updateErr } = await supabase
    .from('sessions')
    .update({ respostas, ultima_atividade: new Date().toISOString() })
    .eq('session_id', sessionId);
  if (updateErr) return { error: updateErr.message };

  return { ok: true };
}

export async function saveProgress({ sessionId, etapaAtual, questaoAtual }) {
  if (!VALID_ETAPAS.includes(etapaAtual)) {
    return { error: 'INVALID_ETAPA' };
  }
  const { data: session, error: findErr } = await supabase
    .from('sessions')
    .select('status')
    .eq('session_id', sessionId)
    .maybeSingle();
  if (findErr) return { error: findErr.message };
  if (!session) return { error: 'NOT_FOUND' };
  if (session.status === 'CONCLUIDA') return { error: 'SESSION_LOCKED' };

  const { error: updateErr } = await supabase
    .from('sessions')
    .update({
      etapa_atual: etapaAtual,
      questao_atual: questaoAtual,
      ultima_atividade: new Date().toISOString(),
    })
    .eq('session_id', sessionId);
  if (updateErr) return { error: updateErr.message };

  return { ok: true };
}

export async function completeSession({ sessionId }) {
  const { data: session, error: findErr } = await supabase
    .from('sessions')
    .select('status')
    .eq('session_id', sessionId)
    .maybeSingle();
  if (findErr) return { error: findErr.message };
  if (!session) return { error: 'NOT_FOUND' };
  if (session.status === 'CONCLUIDA') return { ok: true };

  const { error: updateErr } = await supabase
    .from('sessions')
    .update({
      status: 'CONCLUIDA',
      etapa_atual: 'completed',
      ultima_atividade: new Date().toISOString(),
    })
    .eq('session_id', sessionId);
  if (updateErr) return { error: updateErr.message };

  return { ok: true };
}

export async function deleteSessionByEmail({ email }) {
  const cleanEmail = normalizeEmail(email);
  const { error } = await supabase.from('sessions').delete().ilike('email', cleanEmail);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function getResults() {
  const { data, error } = await supabase
    .from('results')
    .select('data')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data.map((row) => row.data);
}

// Idempotent on result.id, mirroring jsonStore/sheetsStore: a retried save
// with the same id means an earlier attempt already succeeded.
export async function saveResult(result) {
  const { error } = await supabase.from('results').upsert(
    {
      id: result.id,
      data: result,
      email: normalizeEmail(result.email),
      phone: result.phone || null,
    },
    { onConflict: 'id', ignoreDuplicates: true }
  );
  if (error) return { error: error.message };
  return { ok: true };
}

export async function deleteResult(id) {
  const { data: found, error: findErr } = await supabase
    .from('results')
    .select('email')
    .eq('id', id)
    .maybeSingle();
  if (findErr) return { error: findErr.message };
  if (!found) return { error: 'NOT_FOUND' };

  const { error: deleteErr } = await supabase.from('results').delete().eq('id', id);
  if (deleteErr) return { error: deleteErr.message };

  return { ok: true, email: found.email };
}

export async function checkDuplicateResult({ email, phone }) {
  const cleanEmail = normalizeEmail(email);
  const cleanPhone = String(phone || '').replace(/\D/g, '');

  if (cleanEmail) {
    const { data, error } = await supabase
      .from('results')
      .select('id')
      .ilike('email', cleanEmail)
      .limit(1);
    if (error) return { error: error.message };
    if (data.length > 0) return { isDuplicate: true, reason: 'email' };
  }

  if (cleanPhone && cleanPhone.length >= 8) {
    const { data, error } = await supabase
      .from('results')
      .select('phone')
      .not('phone', 'is', null);
    if (error) return { error: error.message };
    const match = data.some((r) => r.phone && r.phone.replace(/\D/g, '').includes(cleanPhone));
    if (match) return { isDuplicate: true, reason: 'phone' };
  }

  return { isDuplicate: false };
}

export async function getJobPositions() {
  const { data, error } = await supabase.from('job_positions').select('nome').order('nome');
  if (error) throw new Error(error.message);
  return { jobPositions: data.map((r) => r.nome) };
}

export async function addJobPosition({ nome }) {
  const trimmed = String(nome || '').trim();
  if (!trimmed) return { error: 'INVALID_NAME' };

  const { data: existing, error: findErr } = await supabase
    .from('job_positions')
    .select('nome')
    .ilike('nome', trimmed)
    .maybeSingle();
  if (findErr) return { error: findErr.message };

  if (!existing) {
    const { error: insertErr } = await supabase.from('job_positions').insert({ nome: trimmed });
    if (insertErr) return { error: insertErr.message };
  }

  const { data, error } = await supabase.from('job_positions').select('nome').order('nome');
  if (error) return { error: error.message };
  return { jobPositions: data.map((r) => r.nome) };
}
