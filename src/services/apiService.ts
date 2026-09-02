import { CandidateInfo, CandidateResult, DashboardMetrics, JobPosition, BigFiveScores, BigFiveDomain, FitCulturalValue, SessionState, SessionEtapa } from '../types';
import { BIG_FIVE_QUESTIONS, FIT_CULTURAL_QUESTIONS, FIT_CULTURAL_VALUES, LOGIC_QUESTIONS } from '../data/mockData';

// Finished results that couldn't reach the server (network blip, server
// briefly down) are parked here instead of being lost, and retried the next
// time the app loads — see flushPendingResults().
const PENDING_RESULTS_KEY = 'b4y_pending_results';

function readPendingResults(): CandidateResult[] {
  try {
    const raw = localStorage.getItem(PENDING_RESULTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePendingResults(results: CandidateResult[]): void {
  try {
    if (results.length === 0) {
      localStorage.removeItem(PENDING_RESULTS_KEY);
    } else {
      localStorage.setItem(PENDING_RESULTS_KEY, JSON.stringify(results));
    }
  } catch {
    // Storage unavailable (private mode, quota) — nothing more we can do locally.
  }
}

// Test vagas created while verifying the add-vaga feature — hidden from the
// site so only vagas management actually creates show up, without touching
// the sheet data itself (no delete action wired up on the backend).
const HIDDEN_JOB_POSITIONS = new Set(
  ['Vaga Teste Verificacao', 'Vaga Retry 1', 'Vaga Retry 2', 'Vaga Retry 3'].map((s) => s.toLowerCase())
);

const REQUEST_TIMEOUT_MS = 20000;

// Without a timeout, a slow/stuck backend (e.g. Apps Script lock contention)
// left dashboard requests hanging forever with no error ever surfacing —
// the loading spinner just spun indefinitely.
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function postCandidateResult(result: CandidateResult): Promise<boolean> {
  try {
    const res = await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export class AssessmentService {
  /**
   * Retrieves all candidate records from the server (requires an authenticated management session)
   */
  static async getCandidates(): Promise<CandidateResult[]> {
    let res: Response;
    try {
      res = await fetchWithTimeout('/api/candidates', { credentials: 'include' });
    } catch {
      throw new Error('Não foi possível carregar os candidatos. Verifique sua conexão e tente novamente.');
    }
    if (res.status === 401) {
      throw new Error('unauthorized');
    }
    if (!res.ok) {
      throw new Error('Falha ao carregar candidatos.');
    }
    return res.json();
  }

  /**
   * Deletes a candidate's finished result and resets their session, so they
   * can apply again from scratch (requires an authenticated management session)
   */
  static async deleteCandidate(id: string): Promise<{ success: boolean; sessionResetFailed?: boolean }> {
    let res: Response;
    try {
      res = await fetchWithTimeout(`/api/candidates/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch {
      throw new Error('Não foi possível excluir o candidato. Verifique sua conexão e tente novamente.');
    }
    if (res.status === 401) {
      throw new Error('unauthorized');
    }
    if (!res.ok) {
      throw new Error('Falha ao excluir candidato.');
    }
    return res.json();
  }

  /**
   * Checks if a candidate with the given email or phone has already completed an assessment.
   * Runs against the server so the full candidate list is never exposed to the public form.
   */
  static async checkDuplicateCandidate(email: string, phone: string): Promise<{ isDuplicate: boolean; reason?: 'email' | 'phone' }> {
    const res = await fetch('/api/candidates/check-duplicate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone }),
    });
    if (!res.ok) {
      return { isDuplicate: false };
    }
    return res.json();
  }

  /**
   * Calculates scores and submits a newly finished assessment to the server
   */
  static async processAndSaveAssessment(
    candidate: CandidateInfo,
    bigFiveAnswers: Record<number, string>,
    fitAnswers: Record<number, string>,
    logicAnswers: Record<number, string>
  ): Promise<CandidateResult> {
    // 1. Calculate BIG 5 (BFI-2) Scores
    // Each domain's raw score is the average Likert response (1-5) across its
    // 12 items, applying reverse-keying where needed, normalized to 0-100%.
    const domainSums: Record<BigFiveDomain, number> = { E: 0, A: 0, C: 0, N: 0, O: 0 };
    const domainCounts: Record<BigFiveDomain, number> = { E: 0, A: 0, C: 0, N: 0, O: 0 };

    Object.entries(bigFiveAnswers).forEach(([qIdStr, valueStr]) => {
      const qId = parseInt(qIdStr, 10);
      const value = parseInt(valueStr, 10);
      const question = BIG_FIVE_QUESTIONS.find(q => q.id === qId);
      if (question && value >= 1 && value <= 5) {
        const keyedValue = question.reverse ? 6 - value : value;
        domainSums[question.domain] += keyedValue;
        domainCounts[question.domain]++;
      }
    });

    const normalizeDomain = (domain: BigFiveDomain) => {
      const count = domainCounts[domain] || 1;
      const avg = domainSums[domain] / count || 3; // 3 = neutral midpoint fallback
      return Math.round(((avg - 1) / 4) * 100);
    };

    const rawE = normalizeDomain('E');
    const rawA = normalizeDomain('A');
    const rawC = normalizeDomain('C');
    const rawN = normalizeDomain('N'); // raw Negative Emotionality (higher = more reactive)
    const rawO = normalizeDomain('O');

    // Displayed as "Estabilidade Emocional": inverted so a higher score always
    // reads positively, consistent with the other four domains.
    const emotionalStability = 100 - rawN;

    // Determine predominant profile (highest-scoring domain)
    const traits: { type: BigFiveScores['predominant']; score: number }[] = [
      { type: 'Extroversão', score: rawE },
      { type: 'Amabilidade', score: rawA },
      { type: 'Conscienciosidade', score: rawC },
      { type: 'Estabilidade Emocional', score: emotionalStability },
      { type: 'Abertura à Experiência', score: rawO },
    ];
    traits.sort((a, b) => b.score - a.score);
    const predominant = traits[0].type;

    const descriptionsMap: Record<string, string> = {
      'Extroversão': 'Perfil sociável, enérgico e assertivo, com facilidade para se expressar, liderar interações e buscar estímulo no contato com pessoas.',
      'Amabilidade': 'Perfil cooperativo, compassivo e confiável, com forte orientação para harmonia, respeito mútuo e construção de relações de confiança.',
      'Conscienciosidade': 'Perfil organizado, disciplinado e responsável, com alto senso de dever, planejamento cuidadoso e compromisso com a qualidade das entregas.',
      'Estabilidade Emocional': 'Perfil emocionalmente equilibrado, calmo sob pressão e resiliente diante de contratempos, mantendo constância mesmo em cenários de estresse.',
      'Abertura à Experiência': 'Perfil curioso, criativo e receptivo a novas ideias, com interesse genuíno por aprendizado, arte e formas não convencionais de resolver problemas.'
    };

    const bigFiveScores: BigFiveScores = {
      e: rawE,
      a: rawA,
      c: rawC,
      n: emotionalStability,
      o: rawO,
      predominant,
      description: descriptionsMap[predominant] || 'Perfil equilibrado com competências adaptativas para o ambiente de trabalho corporativo.'
    };

    // 2. Calculate Fit Cultural Score — 18 questions, 2 per cultural value.
    // Each value's fit is the average of its 2 answers; the overall score is
    // the average across all 18 answers (equivalent to averaging the 9 per-value
    // fits, since each value carries the same number of questions).
    let totalFitWeight = 0;
    let fitQuestionsCount = 0;
    const fitValueSums: Record<string, number> = {};
    const fitValueCounts: Record<string, number> = {};

    Object.entries(fitAnswers).forEach(([qIdStr, optId]) => {
      const qId = parseInt(qIdStr, 10);
      const question = FIT_CULTURAL_QUESTIONS.find(q => q.id === qId);
      if (question) {
        const opt = question.options.find(o => o.id === optId);
        if (opt) {
          totalFitWeight += opt.weight;
          fitQuestionsCount++;
          fitValueSums[question.value] = (fitValueSums[question.value] || 0) + opt.weight;
          fitValueCounts[question.value] = (fitValueCounts[question.value] || 0) + 1;
        }
      }
    });

    const fitCulturalScore = fitQuestionsCount > 0
      ? Math.round((totalFitWeight / fitQuestionsCount) * 10) / 10
      : 85;

    const fitCulturalByValue = {} as Record<FitCulturalValue, number>;
    FIT_CULTURAL_VALUES.forEach(({ value }) => {
      const count = fitValueCounts[value] || 0;
      fitCulturalByValue[value as FitCulturalValue] = count > 0
        ? Math.round((fitValueSums[value] / count) * 10) / 10
        : 0;
    });

    // 3. Calculate Logical Reasoning Score
    let correctLogicCount = 0;
    const totalLogicQuestions = LOGIC_QUESTIONS.length;
    Object.entries(logicAnswers).forEach(([qIdStr, optId]) => {
      const qId = parseInt(qIdStr, 10);
      const question = LOGIC_QUESTIONS.find(q => q.id === qId);
      if (question) {
        const opt = question.options.find(o => o.id === optId);
        if (opt && opt.isCorrect) {
          correctLogicCount++;
        }
      }
    });
    const logicScorePercent = totalLogicQuestions > 0 ? Math.round((correctLogicCount / totalLogicQuestions) * 100) : 80;
    const logicScoreFraction = `${correctLogicCount}/${totalLogicQuestions}`;

    // Format current Date
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const formattedTime = `${formattedDate} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newResult: CandidateResult = {
      id: `cand-${Date.now().toString(36)}`,
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      jobPosition: (candidate.jobPosition || 'Analista Comercial') as JobPosition,
      date: formattedDate,
      timestamp: Date.now(),
      status: 'Concluído',
      bigFiveScores,
      fitCulturalScore,
      fitCulturalByValue,
      logicScorePercent,
      logicScoreFraction,
      completedAt: formattedTime,
      bigFiveAnswers,
      fitAnswers,
      logicAnswers
    };

    // Parked in localStorage *before* the network attempt (not just after it
    // fails) — the completion screen is shown before this call resolves, so
    // a reload/crash/closed tab mid-save used to lose the result for good
    // with nothing ever written locally to retry from.
    writePendingResults([...readPendingResults().filter((r) => r.id !== newResult.id), newResult]);

    // Retry a few times with backoff before giving up on this attempt —
    // flushPendingResults() will keep trying on future page loads regardless.
    let saved = false;
    for (let attempt = 0; attempt < 4 && !saved; attempt++) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, attempt * 2000));
      saved = await postCandidateResult(newResult);
    }

    if (saved) {
      writePendingResults(readPendingResults().filter((r) => r.id !== newResult.id));
    }

    return newResult;
  }

  /**
   * Retries any finished results that previously failed to save (see
   * processAndSaveAssessment), so a transient outage doesn't lose them for
   * good as long as the browser is opened again on the same device.
   */
  static async flushPendingResults(): Promise<void> {
    const pending = readPendingResults();
    if (pending.length === 0) return;

    const stillPending: CandidateResult[] = [];
    for (const result of pending) {
      const saved = await postCandidateResult(result);
      if (!saved) stillPending.push(result);
    }
    writePendingResults(stillPending);
  }

  /**
   * Computes aggregate metrics for the dashboard view
   */
  static getMetrics(candidates: CandidateResult[], filterPosition?: string): DashboardMetrics {
    const filtered = filterPosition && filterPosition !== 'all'
      ? candidates.filter(c => c.jobPosition === filterPosition)
      : candidates;

    const totalEvaluated = filtered.length;
    const completedList = filtered.filter(c => c.status === 'Concluído');
    const totalCompleted = completedList.length;

    const avgLogic = totalCompleted > 0
      ? Math.round(completedList.reduce((acc, c) => acc + c.logicScorePercent, 0) / totalCompleted)
      : 0;

    const avgFit = totalCompleted > 0
      ? Math.round(completedList.reduce((acc, c) => acc + c.fitCulturalScore, 0) / totalCompleted)
      : 0;

    return {
      totalEvaluated,
      totalCompleted,
      avgLogicScore: avgLogic,
      avgFitCultural: avgFit
    };
  }

  /**
   * Fetches the current list of vagas (public — needed by the identification form).
   * Retries on failure — the Sheets backend intermittently times out or 502s
   * under normal use, and a single blip shouldn't leave the dropdown/filter
   * empty when trying again a moment later usually just works.
   */
  static async getJobPositions(): Promise<string[]> {
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, attempt * 1500));
      try {
        const res = await fetchWithTimeout('/api/job-positions');
        if (!res.ok) throw new Error('Não foi possível carregar a lista de vagas.');
        const data = await res.json();
        const jobPositions: string[] = Array.isArray(data.jobPositions) ? data.jobPositions : [];
        return jobPositions.filter((pos) => !HIDDEN_JOB_POSITIONS.has(pos.toLowerCase()));
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Não foi possível carregar a lista de vagas.');
  }

  /**
   * Adds a new vaga so it becomes selectable on the identification form
   * (requires an authenticated management session)
   */
  static async addJobPosition(nome: string): Promise<string[]> {
    const res = await fetchWithTimeout('/api/job-positions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nome }),
    });
    if (res.status === 401) {
      throw new Error('unauthorized');
    }
    if (!res.ok) {
      throw new Error('Não foi possível adicionar a vaga.');
    }
    const data = await res.json();
    return Array.isArray(data.jobPositions) ? data.jobPositions : [];
  }

  /**
   * Creates a new assessment session for this candidate, or resumes an existing
   * EM_ANDAMENTO one found by email. Returns {blocked: true} if already CONCLUÍDA.
   */
  static async startOrResumeSession(candidate: CandidateInfo): Promise<SessionState | { blocked: true }> {
    const res = await fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: candidate.fullName,
        email: candidate.email,
        phone: candidate.phone,
        jobPosition: candidate.jobPosition,
      }),
    });
    if (!res.ok) {
      throw new Error('Não foi possível iniciar a avaliação.');
    }
    return res.json();
  }

  /**
   * Silently fetches a session's current state (used to resume on page reload)
   */
  static async getSession(sessionId: string): Promise<SessionState | null> {
    try {
      const res = await fetch(`/api/session/${sessionId}`);
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }

  /**
   * Fire-and-forget: persists a single answer as soon as the candidate selects it
   */
  static saveAnswer(sessionId: string, teste: Exclude<SessionEtapa, 'completed'>, perguntaId: number, resposta: string): void {
    fetch(`/api/session/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teste, perguntaId, resposta }),
    }).catch(() => {});
  }

  /**
   * Fire-and-forget: persists the candidate's current step/question position
   */
  static saveProgress(sessionId: string, etapaAtual: SessionEtapa, questaoAtual: number): void {
    fetch(`/api/session/${sessionId}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ etapaAtual, questaoAtual }),
    }).catch(() => {});
  }

  /**
   * Marks the session CONCLUÍDA once the candidate finishes all tests. Awaited
   * (not fire-and-forget) so the app only shows the completion screen — and
   * clears the resumable session — after the server confirms it's locked.
   */
  static async completeSession(sessionId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/session/${sessionId}/complete`, { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  }
}
