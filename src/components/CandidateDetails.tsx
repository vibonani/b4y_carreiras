import React, { useState } from 'react';
import {
  X, Mail, Phone, Briefcase, Calendar, Compass,
  HeartHandshake, Brain, CheckCircle2, AlertTriangle,
  BookOpen, TrendingUp, Lightbulb, Users, ShieldAlert,
  Flame, HelpCircle, Layers, Sparkles, Printer, FileText,
  ClipboardList, XCircle
} from 'lucide-react';
import { CandidateResult } from '../types';
import { generateDetailedDISCReport } from '../utils/discDetailedReport';
import { DISC_QUESTIONS, FIT_CULTURAL_QUESTIONS, LOGIC_QUESTIONS } from '../data/mockData';

interface CandidateDetailsProps {
  candidate: CandidateResult | null;
  onClose: () => void;
}

type TabType = 'overview' | 'analysis' | 'communication' | 'leadership' | 'pdi' | 'foundations' | 'cultural_logic' | 'answers';

export const CandidateDetails: React.FC<CandidateDetailsProps> = ({ candidate, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!candidate) return null;

  const { discScores } = candidate;
  const report = generateDetailedDISCReport(discScores);

  const discTraits = [
    { 
      key: 'D', 
      label: 'Dominância (D)', 
      value: discScores.d, 
      color: 'bg-rose-500', 
      barBg: 'bg-rose-100', 
      textColor: 'text-rose-700',
      intensity: report.intensities.d
    },
    { 
      key: 'I', 
      label: 'Influência (I)', 
      value: discScores.i, 
      color: 'bg-amber-500', 
      barBg: 'bg-amber-100', 
      textColor: 'text-amber-700',
      intensity: report.intensities.i
    },
    { 
      key: 'S', 
      label: 'Estabilidade (S)', 
      value: discScores.s, 
      color: 'bg-emerald-500', 
      barBg: 'bg-emerald-100', 
      textColor: 'text-emerald-700',
      intensity: report.intensities.s
    },
    { 
      key: 'C', 
      label: 'Conformidade (C)', 
      value: discScores.c, 
      color: 'bg-blue-500', 
      barBg: 'bg-blue-100', 
      textColor: 'text-blue-700',
      intensity: report.intensities.c
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in print:p-0 print:bg-white print:static">
      <div 
        id="modal-candidate-details"
        className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-sm">
              {candidate.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-xl font-bold text-slate-900 leading-tight">
                  {candidate.fullName}
                </h3>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                  {candidate.jobPosition}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Relatório Comportamental DISC Completo & Análise de Fit
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              title="Imprimir relatório"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center space-x-1.5 text-xs font-medium transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button
              id="btn-close-candidate-modal"
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Candidate Bio Info Banner */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-3 sm:px-6 sm:py-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0">
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">E-mail</span>
            <div className="flex items-center space-x-1.5 font-medium text-slate-800 mt-0.5 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{candidate.email}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Telefone</span>
            <div className="flex items-center space-x-1.5 font-medium text-slate-800 mt-0.5 truncate">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{candidate.phone || 'Não informado'}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Vaga</span>
            <div className="flex items-center space-x-1.5 font-medium text-slate-800 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{candidate.jobPosition}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Data do Teste</span>
            <div className="flex items-center space-x-1.5 font-medium text-slate-800 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{candidate.completedAt || candidate.date}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 overflow-x-auto scrollbar-none shrink-0 flex space-x-1 sm:space-x-2">
          {[
            { id: 'overview', label: 'Visão Geral', icon: Compass },
            { id: 'answers', label: 'Respostas do Teste', icon: ClipboardList },
            { id: 'analysis', label: 'Análise Detalhada', icon: Sparkles },
            { id: 'communication', label: 'Comunicação e Ambiente', icon: Users },
            { id: 'leadership', label: 'Estilo de Liderança', icon: TrendingUp },
            { id: 'pdi', label: 'Plano de PDI', icon: BookOpen },
            { id: 'cultural_logic', label: 'Fit Cultural & Lógica', icon: Brain },
            { id: 'foundations', label: 'Fundamentos DISC', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap flex items-center space-x-1.5 transition-colors ${
                  isActive
                    ? 'border-teal-600 text-teal-600 bg-teal-50/40'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/30">
          
          {/* TAB 1: VISÃO GERAL */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Highlight summary card */}
              <div className="bg-linear-to-r from-teal-900 via-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
                <div className="relative z-10">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold mb-3 border border-white/10">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Perfil Comportamental Identificado</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
                    {report.archetypeTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-2xl font-normal">
                    {report.summaryText}. {report.archetypeSubtitle}
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
                  <Compass className="w-56 h-56 text-white" />
                </div>
              </div>

              {/* Factor Distribution (0-100%) */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">Distribuição dos Fatores</h4>
                    <p className="text-xs text-slate-500">Pontuação normalizada de cada dimensão (0-100%)</p>
                  </div>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                    Base: 40 Questões DISC
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {discTraits.map((t) => (
                    <div key={t.key} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-center">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-700">{t.key}</span>
                        <span className={`text-base font-black ${t.textColor}`}>{t.value}%</span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 mb-2 truncate text-left">
                        {t.label.split(' ')[0]}
                      </p>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${t.color} rounded-full`} style={{ width: `${Math.min(t.value, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Factor Intensity Levels */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Intensidade dos Fatores</h4>
                <p className="text-xs text-slate-500 mb-4">Classificação do nível de cada característica no perfil</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {discTraits.map((t) => (
                    <div key={t.key} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-800">{t.label}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${t.intensity.badgeColor}`}>
                          {t.intensity.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {t.intensity.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Natural Strengths highlight */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">Seus Pontos Fortes</h4>
                    <p className="text-xs text-slate-500">Habilidades e talentos naturais baseados no perfil {report.primaryTrait}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
                  {report.keyStrengthsList.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-100/80 text-xs sm:text-sm text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: RESPOSTAS DO TESTE (por pergunta, por teste) */}
          {activeTab === 'answers' && (
            <div className="space-y-6 animate-fade-in">
              {!candidate.discAnswers && !candidate.fitAnswers && !candidate.logicAnswers && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-800 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Este candidato concluiu o teste antes do registro individual de respostas. Apenas as pontuações agregadas estão disponíveis para ele.</span>
                </div>
              )}

              {/* DISC Answers */}
              {candidate.discAnswers && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">Teste DISC — Respostas de {candidate.fullName}</h4>
                      <p className="text-xs text-slate-500">{Object.keys(candidate.discAnswers).length} de {DISC_QUESTIONS.length} questões respondidas</p>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    {DISC_QUESTIONS.map((q, idx) => {
                      const optId = candidate.discAnswers?.[q.id];
                      const opt = q.options.find(o => o.id === optId);
                      const traitColors: Record<string, string> = {
                        D: 'bg-rose-100 text-rose-700 border-rose-200',
                        I: 'bg-amber-100 text-amber-700 border-amber-200',
                        S: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                        C: 'bg-blue-100 text-blue-700 border-blue-200',
                      };
                      return (
                        <div key={q.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm">
                          <div className="flex-1">
                            <span className="text-slate-400 font-semibold mr-1.5">{idx + 1}.</span>
                            <span className="text-slate-700">{q.prompt}</span>
                            <div className="mt-1 font-semibold text-slate-900">
                              {opt ? opt.text : <span className="italic text-slate-400 font-normal">Não respondida</span>}
                            </div>
                          </div>
                          {opt && (
                            <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-md border ${traitColors[opt.trait]}`}>
                              {opt.trait}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Fit Cultural Answers */}
              {candidate.fitAnswers && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">Fit Cultural — Respostas de {candidate.fullName}</h4>
                      <p className="text-xs text-slate-500">{Object.keys(candidate.fitAnswers).length} de {FIT_CULTURAL_QUESTIONS.length} questões respondidas</p>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    {FIT_CULTURAL_QUESTIONS.map((q, idx) => {
                      const optId = candidate.fitAnswers?.[q.id];
                      const opt = q.options.find(o => o.id === optId);
                      return (
                        <div key={q.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm">
                          <div className="flex-1">
                            <span className="text-slate-400 font-semibold mr-1.5">{idx + 1}.</span>
                            <span className="text-slate-700">{q.prompt}</span>
                            <div className="mt-1 font-semibold text-slate-900">
                              {opt ? opt.text : <span className="italic text-slate-400 font-normal">Não respondida</span>}
                            </div>
                          </div>
                          {opt && (
                            <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-md border bg-violet-100 text-violet-700 border-violet-200 whitespace-nowrap">
                              {opt.category}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Logic Answers */}
              {candidate.logicAnswers && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">Raciocínio Lógico — Respostas de {candidate.fullName}</h4>
                      <p className="text-xs text-slate-500">{candidate.logicScoreFraction} acertos ({candidate.logicScorePercent}%)</p>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    {LOGIC_QUESTIONS.map((q, idx) => {
                      const optId = candidate.logicAnswers?.[q.id];
                      const opt = q.options.find(o => o.id === optId);
                      const correctOpt = q.options.find(o => o.isCorrect);
                      const isCorrect = !!opt?.isCorrect;
                      return (
                        <div key={q.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm">
                          <div className="flex-1">
                            <span className="text-slate-400 font-semibold mr-1.5">{idx + 1}.</span>
                            <span className="text-slate-700">{q.title || q.prompt}</span>
                            <div className="mt-1 font-semibold text-slate-900">
                              {opt ? opt.text : <span className="italic text-slate-400 font-normal">Não respondida</span>}
                            </div>
                            {!isCorrect && correctOpt && (
                              <div className="mt-1 text-[11px] text-emerald-700">
                                Resposta correta: <span className="font-semibold">{correctOpt.text}</span>
                              </div>
                            )}
                          </div>
                          {opt && (
                            isCorrect ? (
                              <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md border bg-emerald-100 text-emerald-700 border-emerald-200 whitespace-nowrap">
                                <CheckCircle2 className="w-3 h-3" /> Correta
                              </span>
                            ) : (
                              <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md border bg-rose-100 text-rose-700 border-rose-200 whitespace-nowrap">
                                <XCircle className="w-3 h-3" /> Incorreta
                              </span>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ANÁLISE DETALHADA */}
          {activeTab === 'analysis' && (
            <div className="space-y-6 animate-fade-in">
              {/* Deep Archetype Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-2 text-teal-600 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Arquétipo Comportamental</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{report.archetypeTitle}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {report.deepAnalysis.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
                  {report.deepAnalysis.highlights.map((h, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-slate-700 font-medium bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Factor Manifestation Details */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Sua Intensidade em Cada Fator</h4>
                <p className="text-xs text-slate-500 mb-4">Como cada dimensão se manifesta na conduta prática</p>

                <div className="space-y-3">
                  {discTraits.map((t) => (
                    <div key={t.key} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 sm:w-1/3 shrink-0">
                        <span className={`w-6 h-6 rounded-lg text-white font-bold text-xs flex items-center justify-center ${t.color}`}>
                          {t.key}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{t.label.split(' ')[0]}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${t.intensity.badgeColor}`}>
                            {t.intensity.level} ({t.value}%)
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 flex-1 leading-relaxed">
                        {t.intensity.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths vs Growth Areas Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs">
                  <div className="flex items-center space-x-2 text-emerald-700 mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                    <h4 className="text-sm font-bold">Pontos Fortes</h4>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Principais habilidades e talentos naturais</p>
                  <ul className="space-y-2">
                    {report.strengths.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 font-medium">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Attention Points */}
                <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs">
                  <div className="flex items-center space-x-2 text-amber-700 mb-3">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="text-sm font-bold">Pontos de Atenção</h4>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Áreas para desenvolvimento e crescimento pessoal</p>
                  <ul className="space-y-2">
                    {report.attentionPoints.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 font-medium">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Stress Behavior */}
              <div className="bg-rose-50/50 rounded-2xl p-5 border border-rose-200 shadow-xs">
                <div className="flex items-center space-x-2 text-rose-800 mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <h4 className="text-sm font-bold">Comportamento Sob Estresse</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {report.stressBehavior}
                </p>
              </div>

              {/* Motivators vs Stressors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center space-x-2 text-teal-700 mb-3">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <h4 className="text-sm font-bold">O que Motiva Você</h4>
                  </div>
                  <ul className="space-y-2">
                    {report.motivators.map((m, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-xs text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center space-x-2 text-slate-700 mb-3">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <h4 className="text-sm font-bold">O que Estressa Você</h4>
                  </div>
                  <ul className="space-y-2">
                    {report.stressors.map((s, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-xs text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMUNICAÇÃO E AMBIENTE */}
          {activeTab === 'communication' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Communication Style */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center space-x-2 text-teal-700 mb-2">
                    <Users className="w-4 h-4" />
                    <h4 className="text-sm font-bold">Estilo de Comunicação</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {report.communicationStyle}
                  </p>
                </div>

                {/* Work Style */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center space-x-2 text-teal-700 mb-2">
                    <Briefcase className="w-4 h-4" />
                    <h4 className="text-sm font-bold">Estilo de Trabalho</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {report.workStyle}
                  </p>
                </div>
              </div>

              {/* Ideal Work Environment */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-2 text-slate-900 mb-2">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <h4 className="text-sm sm:text-base font-bold">Ambiente Ideal de Trabalho</h4>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Contextos e funções onde tende a performar com máximo rendimento
                </p>
                <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 text-xs sm:text-sm text-teal-950 font-medium mb-4">
                  {report.idealEnvironment.summary}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {report.idealEnvironment.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Work With This Candidate (Guide for Managers) */}
              <div className="bg-linear-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center space-x-2 text-teal-200 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm sm:text-base font-bold text-white">Como Trabalhar com Este Candidato</h4>
                </div>
                <p className="text-xs text-teal-200/80 mb-4">
                  Diretrizes práticas para a gestora e equipe potencializarem a comunicação e resultados
                </p>

                <div className="space-y-2.5">
                  {report.howToWorkWith.map((tip, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-white/10 border border-white/10 text-xs sm:text-sm text-white/95">
                      <span className="w-5 h-5 rounded-full bg-teal-500/40 text-teal-200 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ESTILO DE LIDERANÇA */}
          {activeTab === 'leadership' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-2 text-teal-600 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Perfil de Liderança</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{report.leadership.styleTitle}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {report.leadership.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Leadership Strengths */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pontos Fortes como Líder</span>
                  </h4>
                  <ul className="space-y-2">
                    {report.leadership.strengths.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Leadership Blindspots */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Pontos de Atenção na Liderança</span>
                  </h4>
                  <ul className="space-y-2">
                    {report.leadership.attentionPoints.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Leadership Development Tips */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Dicas de Desenvolvimento de Liderança</h4>
                <p className="text-xs text-slate-500 mb-4">Ações recomendadas para alavancar a maturidade de gestão</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {report.leadership.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PDI & LIVROS */}
          {activeTab === 'pdi' && (
            <div className="space-y-6 animate-fade-in">
              {/* Leverage Strengths in PDI */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-2 text-teal-700 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">Potencialize suas Forças</h4>
                </div>
                <p className="text-xs text-slate-500 mb-4">Projetos e iniciativas para extrair o máximo potencial natural</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.pdi.leverageStrengths.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">{item.title}</h5>
                      <p className="text-xs text-slate-600 mb-3">{item.description}</p>
                      <div className="space-y-1">
                        {item.actions.map((act, i) => (
                          <div key={i} className="text-[11px] text-teal-900 font-medium flex items-center space-x-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Areas to develop in PDI */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-2 text-slate-900 mb-1">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm sm:text-base font-bold">Áreas para Desenvolver</h4>
                </div>
                <p className="text-xs text-slate-500 mb-4">Planos de ação práticos para superação de gaps comportamentais</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.pdi.developAreas.map((dev, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-amber-50/30 border border-amber-200/80 flex flex-col justify-between">
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-amber-950 mb-1">{dev.title}</h5>
                        <p className="text-xs text-slate-600 mb-2 italic">“{dev.problem}”</p>
                        <p className="text-xs text-slate-800 font-medium mb-3">{dev.solution}</p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-amber-100">
                        {dev.actions.map((act, i) => (
                          <div key={i} className="text-[11px] text-slate-700 flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Books */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-2 text-slate-900 mb-1">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <h4 className="text-sm sm:text-base font-bold">Livros Recomendados</h4>
                </div>
                <p className="text-xs text-slate-500 mb-4">Leituras fundamentais alinhadas ao desenvolvimento deste perfil</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.pdi.recommendedBooks.map((b, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900">{b.title}</h5>
                        <span className="text-[11px] text-teal-700 font-semibold block mb-1">por {b.author}</span>
                        <p className="text-xs text-slate-600">{b.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Study Areas */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Áreas de Estudo Recomendadas</h4>
                <p className="text-xs text-slate-500 mb-4">Competências e temas para trilha de capacitação</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.pdi.studyAreas.map((sa, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">{sa.category}</h5>
                      <p className="text-xs text-slate-600 mb-2">{sa.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {sa.topics.map((top, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                            {top}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xs">
                <h4 className="text-sm sm:text-base font-bold text-white mb-1">Próximos Passos</h4>
                <p className="text-xs text-slate-400 mb-4">Como utilizar esses insights para o plano de evolução</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.nextSteps.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <h5 className="font-bold text-xs sm:text-sm text-teal-300 mb-1">{step.title}</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FIT CULTURAL & LÓGICA */}
          {activeTab === 'cultural_logic' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Fit Cultural */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center font-bold text-xs">
                        <HeartHandshake className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Fit Cultural</h4>
                        <p className="text-xs text-slate-500">Alinhamento aos valores corporativos</p>
                      </div>
                    </div>

                    <div className="flex items-baseline space-x-2 my-2">
                      <span className="text-3xl font-extrabold text-slate-900 font-sans">
                        {candidate.fitCulturalScore}%
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        {candidate.fitCulturalScore >= 80 ? 'Alto alinhamento' : 'Alinhamento moderado'}
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3 border border-slate-200">
                      <div 
                        className="h-full bg-violet-600 rounded-full" 
                        style={{ width: `${candidate.fitCulturalScore}%` }} 
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Apresenta consistência em valores como trabalho colaborativo, responsabilidade ética e compromisso com entregas.
                  </p>
                </div>

                {/* Raciocínio Lógico */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                        <Brain className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Raciocínio Lógico</h4>
                        <p className="text-xs text-slate-500">Exatidão em testes objetivos e sequências</p>
                      </div>
                    </div>

                    <div className="flex items-baseline space-x-2 my-2">
                      <span className="text-3xl font-extrabold text-slate-900 font-sans">
                        {candidate.logicScorePercent}%
                      </span>
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {candidate.logicScoreFraction} acertos
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3 border border-slate-200">
                      <div 
                        className="h-full bg-teal-600 rounded-full"
                        style={{ width: `${candidate.logicScorePercent}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Capacidade analítica demonstrada para identificação de padrões estruturais, deduções lógicas e resolução de problemas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: FUNDAMENTOS DISC */}
          {activeTab === 'foundations' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Os 4 Fatores da Metodologia DISC</h4>
                <p className="text-xs text-slate-500 mb-4">Compreenda a matriz comportamental desenvolvida pelo Dr. William Moulton Marston</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* D */}
                  <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-500 text-white font-bold text-xs flex items-center justify-center">
                        D
                      </div>
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">Dominância</h5>
                        <p className="text-[11px] text-slate-500">Orientação para resultados, decisão e ação direta</p>
                      </div>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 pl-2">
                      <li className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>Foco em resultados e metas</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>Tomada de decisão rápida</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>Liderança assertiva</span>
                      </li>
                    </ul>
                  </div>

                  {/* I */}
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                        I
                      </div>
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">Influência</h5>
                        <p className="text-[11px] text-slate-500">Orientação para pessoas, comunicação e entusiasmo</p>
                      </div>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 pl-2">
                      <li className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Comunicação persuasiva</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Construção de relacionamentos</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Entusiasmo contagiante</span>
                      </li>
                    </ul>
                  </div>

                  {/* S */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">
                        S
                      </div>
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">Estabilidade</h5>
                        <p className="text-[11px] text-slate-500">Orientação para cooperação, paciência e harmonia</p>
                      </div>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 pl-2">
                      <li className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Trabalho em equipe</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Consistência e lealdade</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Escuta ativa</span>
                      </li>
                    </ul>
                  </div>

                  {/* C */}
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-500 text-white font-bold text-xs flex items-center justify-center">
                        C
                      </div>
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">Conformidade</h5>
                        <p className="text-[11px] text-slate-500">Orientação para qualidade, análise e precisão</p>
                      </div>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 pl-2">
                      <li className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Atenção a detalhes</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Pensamento analítico</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Padrões de qualidade</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Por que fazer o teste DISC? */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Por que aplicar o teste DISC?</h4>
                <p className="text-xs text-slate-500 mb-4">
                  Entenda seus pontos fortes, áreas de desenvolvimento e como aprimorar a comunicação e performance da equipe.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center sm:text-left">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-2 mx-auto sm:mx-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Autoconhecimento</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Descubra suas preferências comportamentais e entenda porque age de determinada forma em diferentes situações.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center sm:text-left">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-2 mx-auto sm:mx-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Melhor Comunicação</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Aprenda a adaptar sua comunicação para diferentes estilos e construa relacionamentos mais efetivos no trabalho.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center sm:text-left">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-2 mx-auto sm:mx-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Desenvolvimento</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Identifique áreas de desenvolvimento e crie um plano de ação para potencializar a carreira e crescimento pessoal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Relatório individualizado para gestão de talentos</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors shadow-xs"
          >
            Fechar Relatório
          </button>
        </div>

      </div>
    </div>
  );
};
