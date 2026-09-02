import React, { useState, useMemo, useEffect } from 'react';
import {
  Filter,
  Search,
  Download,
  LogOut,
  PlusCircle,
  ArrowUpDown,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { CandidateResult, JobPosition } from '../types';
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateResult | null>(null);
  const [jobPositions, setJobPositions] = useState<string[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [jobPositionsError, setJobPositionsError] = useState<string | null>(null);
  const [newPositionName, setNewPositionName] = useState('');
  const [isAddingPosition, setIsAddingPosition] = useState(false);
  const [addPositionError, setAddPositionError] = useState<string | null>(null);

  const loadJobPositions = () => {
    setLoadingPositions(true);
    setJobPositionsError(null);
    AssessmentService.getJobPositions()
      .then(setJobPositions)
      .catch(() => setJobPositionsError('Não foi possível carregar as vagas.'))
      .finally(() => setLoadingPositions(false));
  };

  useEffect(loadJobPositions, []);

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    const nome = newPositionName.trim();
    if (!nome || isAddingPosition) return;

    setIsAddingPosition(true);
    setAddPositionError(null);
    try {
      const updated = await AssessmentService.addJobPosition(nome);
      setJobPositions(updated);
      setNewPositionName('');
    } catch (err) {
      if (err instanceof Error && err.message === 'unauthorized') {
        onUnauthorized();
      } else {
        setAddPositionError('Não foi possível adicionar a vaga. Tente novamente.');
      }
    } finally {
      setIsAddingPosition(false);
    }
  };

  const loadCandidates = () => {
    setLoading(true);
    setLoadError(null);
    AssessmentService.getCandidates()
      .then((list) => setCandidates(list))
      .catch((err) => {
        if (err instanceof Error && err.message === 'unauthorized') {
          onUnauthorized();
        } else {
          setLoadError(err instanceof Error ? err.message : 'Falha ao carregar candidatos.');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadCandidates, [onUnauthorized]);

  const handleLogout = async () => {
    await AuthService.logout();
    onBackToTest();
  };

  const handleDeleteCandidate = async (id: string) => {
    try {
      const result = await AssessmentService.deleteCandidate(id);
      setCandidates((prev) => prev.filter((c) => c.id !== id));
      if (result.sessionResetFailed) {
        alert('Candidato removido da lista, mas não foi possível liberar o e-mail dele na planilha agora. Tente excluir de novo em alguns minutos para garantir que ele consiga se candidatar outra vez.');
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'unauthorized') {
        onUnauthorized();
      } else {
        alert('Não foi possível excluir o candidato. Tente novamente.');
      }
    }
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

  return (
    <div id="screen-demo-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      
      {/* Top Banner / Integration Readiness */}
      <div className="mb-8 bg-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans text-white">
            Resultados dos Processos Seletivos
          </h1>
          <p className="text-teal-200 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Acompanhe em tempo real as avaliações de personalidade BIG 5, alinhamento cultural e índices de raciocínio lógico dos candidatos.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
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
              disabled={loadingPositions}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="all">Todas as vagas ({candidates.length})</option>
              {jobPositions.map((pos) => {
                const count = candidates.filter(c => c.jobPosition === pos).length;
                return (
                  <option key={pos} value={pos}>
                    {pos} ({count})
                  </option>
                );
              })}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              {loadingPositions ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
            </div>
          </div>
        </div>

      </div>

      {jobPositionsError && (
        <div className="mb-6 -mt-3 flex items-center justify-between gap-3 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-xs sm:text-sm text-rose-700">
          <span className="flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            {jobPositionsError}
          </span>
          <button
            type="button"
            onClick={loadJobPositions}
            className="font-semibold underline underline-offset-2 hover:text-rose-800 cursor-pointer shrink-0"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Adicionar nova vaga */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 mb-6 shadow-xs">
        <label htmlFor="input-new-job-position" className="block text-xs font-semibold text-slate-500 mb-2">
          Adicionar nova vaga
        </label>
        <form onSubmit={handleAddPosition} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            id="input-new-job-position"
            type="text"
            value={newPositionName}
            onChange={(e) => {
              setNewPositionName(e.target.value);
              if (addPositionError) setAddPositionError(null);
            }}
            placeholder="Ex: Analista de RH"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
          />
          <button
            id="btn-add-job-position"
            type="submit"
            disabled={isAddingPosition || !newPositionName.trim()}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
          >
            {isAddingPosition ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <PlusCircle className="w-4 h-4 mr-2" />
            )}
            <span>Adicionar vaga</span>
          </button>
        </form>
        {addPositionError && (
          <p className="mt-2 text-xs text-rose-600 flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
            {addPositionError}
          </p>
        )}
      </div>

      {/* Candidate Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm">Carregando candidatos...</span>
        </div>
      ) : loadError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <AlertCircle className="w-6 h-6 text-rose-500" />
          <span className="text-sm text-slate-600">{loadError}</span>
          <button
            type="button"
            onClick={loadCandidates}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <CandidateTable
          candidates={filteredCandidates}
          onSelectCandidate={(cand) => setSelectedCandidate(cand)}
          onDeleteCandidate={handleDeleteCandidate}
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
