import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  Filter,
  Search,
  Download,
  LogOut,
  PlusCircle,
  ArrowUpDown,
  Loader2
} from 'lucide-react';
import { CandidateResult, JobPosition } from '../types';
import { JOB_POSITIONS } from '../data/mockData';
import { AssessmentService } from '../services/apiService';
import { AuthService } from '../services/authService';
import { ResultCard } from './ResultCard';
import { CandidateTable } from './CandidateTable';
import { CandidateDetails } from './CandidateDetails';

interface DashboardProps {
  onBackToTest: () => void;
  onUnauthorized: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onBackToTest, onUnauthorized }) => {
  const [candidates, setCandidates] = useState<CandidateResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateResult | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    AssessmentService.getCandidates()
      .then((list) => setCandidates(list))
      .catch((err) => {
        if (err instanceof Error && err.message === 'unauthorized') {
          onUnauthorized();
        }
      })
      .finally(() => setLoading(false));
  }, [onUnauthorized]);

  const handleLogout = async () => {
    await AuthService.logout();
    onBackToTest();
  };

  // Compute metrics dynamically based on selected position
  const metrics = useMemo(() => {
    return AssessmentService.getMetrics(candidates, selectedPosition);
  }, [candidates, selectedPosition]);

  // Filter candidates list
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesPosition = selectedPosition === 'all' || c.jobPosition === selectedPosition;
      const matchesQuery = 
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPosition && matchesQuery;
    });
  }, [candidates, selectedPosition, searchQuery]);

  const handleExportSheets = () => {
    setExportNotice('Relatório pronto para envio automático ao Google Sheets via Webhook/Apps Script.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div id="screen-demo-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      
      {/* Top Banner / Integration Readiness */}
      <div className="mb-8 bg-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans text-white">
            Resultados dos Processos Seletivos
          </h1>
          <p className="text-teal-200 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Acompanhe em tempo real as avaliações comportamentais DISC, alinhamento cultural e índices de raciocínio lógico dos candidatos.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            id="btn-export-sheets"
            type="button"
            onClick={handleExportSheets}
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white text-teal-950 hover:bg-teal-50 transition-colors shadow-sm cursor-pointer"
          >
            <span>Exportar p/ Planilhas</span>
          </button>
          <button
            id="btn-logout"
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-teal-800/80 text-white hover:bg-teal-800 border border-teal-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Sair</span>
          </button>
        </div>

        {/* Decorative background aura */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {exportNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
          <button onClick={() => setExportNotice(null)} className="text-emerald-700 font-bold hover:underline text-xs">
            Fechar
          </button>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <ResultCard
          title="Candidatos avaliados"
          value={metrics.totalEvaluated}
          subtitle="Total no pipeline"
        />

        <ResultCard
          title="Testes concluídos"
          value={metrics.totalCompleted}
          subtitle="100% das etapas respondidas"
        />

        <ResultCard
          title="Média de raciocínio lógico"
          value={`${metrics.avgLogicScore}%`}
          subtitle="Acertos em padrões e dedução"
        />

        <ResultCard
          title="Fit cultural médio"
          value={`${metrics.avgFitCultural}%`}
          subtitle="Índice de sinergia de valores"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="input-search-candidate"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
          />
        </div>

        {/* Dropdown: Selecionar Vaga */}
        <div className="w-full md:w-auto flex items-center space-x-3">
          <label htmlFor="select-filter-position" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Selecionar vaga:
          </label>
          <div className="relative flex-1 md:w-64">
            <select
              id="select-filter-position"
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs cursor-pointer"
            >
              <option value="all">Todas as vagas ({candidates.length})</option>
              {JOB_POSITIONS.map((pos) => {
                const count = candidates.filter(c => c.jobPosition === pos).length;
                return (
                  <option key={pos} value={pos}>
                    {pos} ({count})
                  </option>
                );
              })}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-4 h-4" />
            </div>
          </div>
        </div>

      </div>

      {/* Candidate Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm">Carregando candidatos...</span>
        </div>
      ) : (
        <CandidateTable
          candidates={filteredCandidates}
          onSelectCandidate={(cand) => setSelectedCandidate(cand)}
        />
      )}

      {/* Detailed Candidate Modal */}
      <CandidateDetails
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />

    </div>
  );
};
