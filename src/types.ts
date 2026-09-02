export type StepId =
  | 'welcome'
  | 'overview'
  | 'identification'
  | 'disc'
  | 'fit_cultural'
  | 'logic'
  | 'completed';

// Job positions are managed dynamically (see AssessmentService.getJobPositions/
// addJobPosition) rather than being a fixed set of literals, so management can
// add new ones from the dashboard without a code change.
export type JobPosition = string;

export interface CandidateInfo {
  fullName: string;
  email: string;
  phone: string;
  jobPosition: JobPosition | '';
  termsAccepted: boolean;
}

export type BigFiveDomain = 'E' | 'A' | 'C' | 'N' | 'O';

export interface BigFiveQuestion {
  id: number;
  prompt: string;
  domain: BigFiveDomain;
  facet: string;
  reverse: boolean;
}

// The 9 core cultural values, 2 questions each (18 questions total).
export type FitCulturalValue =
  | 'Energia'
  | 'Execução/NORTE'
  | 'Integridade'
  | 'Ambição'
  | 'Autenticidade'
  | 'Dados e Tecnologia'
  | 'Disciplina'
  | 'Compromisso'
  | 'Prática Pedagógica';

export interface FitCulturalOption {
  id: string;
  label: string;
  text: string;
  weight: number; // 0-100 — aderência desta alternativa ao valor da pergunta
}

export interface FitCulturalQuestion {
  id: number;
  value: FitCulturalValue;
  prompt: string;
  options: FitCulturalOption[];
}

export interface LogicOption {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
}

export interface LogicQuestion {
  id: number;
  title: string;
  prompt: string;
  visualPattern?: string[];
  options: LogicOption[];
  explanation?: string;
}

export interface BigFiveScores {
  e: number; // % Extroversão
  a: number; // % Amabilidade
  c: number; // % Conscienciosidade
  n: number; // % Estabilidade Emocional (invertido a partir de Neuroticismo: quanto maior, mais estável)
  o: number; // % Abertura à Experiência
  predominant: 'Extroversão' | 'Amabilidade' | 'Conscienciosidade' | 'Estabilidade Emocional' | 'Abertura à Experiência';
  description: string;
}

export interface CandidateResult {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  jobPosition: JobPosition;
  date: string;
  timestamp: number;
  status: 'Concluído' | 'Em Andamento';
  bigFiveScores: BigFiveScores;
  fitCulturalScore: number; // e.g. 88.9 — average of all 18 answers
  fitCulturalByValue?: Record<FitCulturalValue, number>; // per-value fit (avg of its 2 questions)
  logicScorePercent: number; // e.g. 90%
  logicScoreFraction: string; // e.g. "9/10"
  completedAt?: string;
  bigFiveAnswers?: Record<number, string>;
  fitAnswers?: Record<number, string>;
  logicAnswers?: Record<number, string>;
}

export type SessionEtapa = 'disc' | 'fit_cultural' | 'logic' | 'completed';

export interface SessionState {
  sessionId: string;
  status: 'EM_ANDAMENTO' | 'CONCLUIDA';
  nome: string;
  email: string;
  telefone: string;
  vaga: string;
  etapaAtual: SessionEtapa;
  questaoAtual: number;
  respostas: {
    disc: Record<number, string>;
    fit_cultural: Record<number, string>;
    logic: Record<number, string>;
  };
  isNew?: boolean;
}

export interface DashboardMetrics {
  totalEvaluated: number;
  totalCompleted: number;
  avgLogicScore: number;
  avgFitCultural: number;
}
