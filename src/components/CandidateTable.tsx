import React from 'react';
import { CandidateResult } from '../types';
import { Eye, ExternalLink, ChevronRight, CheckCircle2 } from 'lucide-react';

interface CandidateTableProps {
  candidates: CandidateResult[];
  onSelectCandidate: (candidate: CandidateResult) => void;
}

export const CandidateTable: React.FC<CandidateTableProps> = ({
  candidates,
  onSelectCandidate,
}) => {
  const getDiscBadge = (predominant: string) => {
    switch (predominant) {
      case 'Dominância':
        return { label: 'D', full: 'Dominância', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'Influência':
        return { label: 'I', full: 'Influência', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'Estabilidade':
        return { label: 'S', full: 'Estabilidade', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'Conformidade':
        return { label: 'C', full: 'Conformidade', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      default:
        return { label: 'D', full: 'Dominância', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        Nenhum candidato encontrado para o filtro selecionado.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Desktop & Tablet Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-4 sm:px-6">Candidato</th>
              <th scope="col" className="py-3.5 px-4">Vaga</th>
              <th scope="col" className="py-3.5 px-4 text-center">DISC</th>
              <th scope="col" className="py-3.5 px-4 text-center">Fit Cultural</th>
              <th scope="col" className="py-3.5 px-4 text-center">Raciocínio Lógico</th>
              <th scope="col" className="py-3.5 px-4 text-center">Data</th>
              <th scope="col" className="py-3.5 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {candidates.map((c) => {
              const discBadge = getDiscBadge(c.discScores.predominant);

              return (
                <tr
                  key={c.id}
                  onClick={() => onSelectCandidate(c)}
                  className="hover:bg-teal-50/40 transition-colors cursor-pointer group"
                >
                  {/* Candidate Name & Email */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                        {c.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                          {c.fullName}
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[180px] sm:max-w-xs">
                          {c.phone ? `${c.email} • ${c.phone}` : c.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Job Position */}
                  <td className="py-4 px-4">
                    <span className="inline-block text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      {c.jobPosition}
                    </span>
                  </td>

                  {/* DISC */}
                  <td className="py-4 px-4 text-center">
                    <span
                      title={`Predominante: ${discBadge.full} (D:${c.discScores.d}% I:${c.discScores.i}% S:${c.discScores.s}% C:${c.discScores.c}%)`}
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold border ${discBadge.bg}`}
                    >
                      {discBadge.label}
                    </span>
                  </td>

                  {/* Fit Cultural */}
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-slate-800">
                      {c.fitCulturalScore}%
                    </span>
                  </td>

                  {/* Raciocínio Lógico */}
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-slate-800">
                      {c.logicScorePercent}%
                    </span>
                  </td>

                  {/* Data */}
                  <td className="py-4 px-4 text-center text-xs text-slate-500 font-medium">
                    {c.date}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCandidate(c);
                      }}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>Ver perfil</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
