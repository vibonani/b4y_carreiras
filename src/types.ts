export type StepId = 
  | 'welcome' 
  | 'identification' 
  | 'disc' 
  | 'fit_cultural' 
  | 'logic' 
  | 'completed';

export type JobPosition = 
  | 'Analista Comercial'
  | 'Assistente Administrativo'
  | 'Analista de Marketing'
  | 'Desenvolvedor';

export interface CandidateInfo {
  fullName: string;
  email: string;
  phone: string;
  jobPosition: JobPosition | '';
  termsAccepted: boolean;
}

export type DISCType = 'D' | 'I' | 'S' | 'C';

export interface DISCOption {
  id: string;
  label: string;
  text: string;
  trait: DISCType;
}

export interface DISCQuestion {
  id: number;
  scenario?: string;
  prompt: string;
  description?: string;
  options: DISCOption[];
}

export interface FitCulturalOption {
  id: string;
  label: string;
  text: string;
  category: 'Colaboração' | 'Autonomia' | 'Inovação' | 'Foco no Cliente' | 'Qualidade';
  weight: number; // 0 to 100
}

export interface FitCulturalQuestion {
  id: number;
  prompt: string;
  description?: string;
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

export interface DISCScores {
  d: number; // %
  i: number; // %
  s: number; // %
  c: number; // %
  predominant: 'Dominância' | 'Influência' | 'Estabilidade' | 'Conformidade';
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
  discScores: DISCScores;
  fitCulturalScore: number; // e.g. 86%
  logicScorePercent: number; // e.g. 90%
  logicScoreFraction: string; // e.g. "9/10"
  completedAt?: string;
  discAnswers?: Record<number, string>;
  fitAnswers?: Record<number, string>;
  logicAnswers?: Record<number, string>;
}

export type SessionEtapa = 'disc' | 'fit_cultural' | 'logic' | 'completed';

export interface SessionState {
  sessionId: string;
  status: 'EM_ANDAMENTO' | 'CONCLUIDA';
  nome: string;
  email: string;
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
