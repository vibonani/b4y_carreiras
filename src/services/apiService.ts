import { CandidateInfo, CandidateResult, DashboardMetrics, JobPosition, DISCScores, SessionState, SessionEtapa } from '../types';
import { DISC_QUESTIONS, FIT_CULTURAL_QUESTIONS, LOGIC_QUESTIONS } from '../data/mockData';

export class AssessmentService {
  /**
   * Retrieves all candidate records from the server (requires an authenticated management session)
   */
  static async getCandidates(): Promise<CandidateResult[]> {
    const res = await fetch('/api/candidates', { credentials: 'include' });
    if (res.status === 401) {
      throw new Error('unauthorized');
    }
    if (!res.ok) {
      throw new Error('Falha ao carregar candidatos.');
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
    discAnswers: Record<number, string>,
    fitAnswers: Record<number, string>,
    logicAnswers: Record<number, string>
  ): Promise<CandidateResult> {
    // 1. Calculate DISC Scores
    const discCounts = { D: 0, I: 0, S: 0, C: 0 };
    let totalDiscAnswered = 0;

    Object.entries(discAnswers).forEach(([qIdStr, optId]) => {
      const qId = parseInt(qIdStr, 10);
      const question = DISC_QUESTIONS.find(q => q.id === qId);
      if (question) {
        const selectedOpt = question.options.find(opt => opt.id === optId);
        if (selectedOpt) {
          discCounts[selectedOpt.trait]++;
          totalDiscAnswered++;
        }
      }
    });

    const discTotal = totalDiscAnswered || 1;
    const rawD = Math.round((discCounts.D / discTotal) * 100);
    const rawI = Math.round((discCounts.I / discTotal) * 100);
    const rawS = Math.round((discCounts.S / discTotal) * 100);
    const rawC = Math.round((discCounts.C / discTotal) * 100);

    // Determine predominant profile
    const traits: { type: 'Dominância' | 'Influência' | 'Estabilidade' | 'Conformidade'; count: number; score: number }[] = [
      { type: 'Dominância', count: discCounts.D, score: rawD },
      { type: 'Influência', count: discCounts.I, score: rawI },
      { type: 'Estabilidade', count: discCounts.S, score: rawS },
      { type: 'Conformidade', count: discCounts.C, score: rawC },
    ];
    traits.sort((a, b) => b.count - a.count);
    const predominant = traits[0].type;

    const descriptionsMap: Record<string, string> = {
      'Dominância': 'Perfil orientado a resultados, liderança direta, assertividade e busca por desafios e metas ambiciosas.',
      'Influência': 'Perfil comunicativo, persuasivo, empático, com facilidade para engajar equipes e construir relacionamentos positivos.',
      'Estabilidade': 'Perfil colaborativo, paciente, leal e com alto foco na segurança, harmonia e constância nos processos.',
      'Conformidade': 'Perfil analítico, metódico, atento aos detalhes, qualidade técnica e cumprimento de padrões rigorosos.'
    };

    const discScores: DISCScores = {
      d: rawD || 25,
      i: rawI || 25,
      s: rawS || 25,
      c: rawC || 25,
      predominant,
      description: descriptionsMap[predominant] || 'Perfil equilibrado com competências adaptativas para o ambiente de trabalho corporativo.'
    };

    // 2. Calculate Fit Cultural Score
    let totalFitWeight = 0;
    let fitQuestionsCount = 0;
    Object.entries(fitAnswers).forEach(([qIdStr, optId]) => {
      const qId = parseInt(qIdStr, 10);
      const question = FIT_CULTURAL_QUESTIONS.find(q => q.id === qId);
      if (question) {
        const opt = question.options.find(o => o.id === optId);
        if (opt) {
          totalFitWeight += opt.weight;
          fitQuestionsCount++;
        }
      }
    });
    const fitCulturalScore = fitQuestionsCount > 0 ? Math.round(totalFitWeight / fitQuestionsCount) : 85;

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
      discScores,
      fitCulturalScore,
      logicScorePercent,
      logicScoreFraction,
      completedAt: formattedTime,
      discAnswers,
      fitAnswers,
      logicAnswers
    };

    await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newResult),
    });

    return newResult;
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
      : 82;

    const avgFit = totalCompleted > 0
      ? Math.round(completedList.reduce((acc, c) => acc + c.fitCulturalScore, 0) / totalCompleted)
      : 85;

    return {
      totalEvaluated: totalEvaluated || 12,
      totalCompleted: totalCompleted || 10,
      avgLogicScore: avgLogic,
      avgFitCultural: avgFit
    };
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
}
