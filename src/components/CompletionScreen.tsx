import React from 'react';
import { Lock, Building2 } from 'lucide-react';
import { CandidateInfo } from '../types';

interface CompletionScreenProps {
  candidate: CandidateInfo;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({ candidate }) => {
  return (
    <div id="screen-completion" className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
      
      <div className="text-center relative overflow-hidden">

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans mb-3">
          Avaliação concluída!
        </h1>

        {/* Subtitles & Confirmation */}
        <p className="text-base sm:text-lg text-slate-700 font-semibold mb-2">
          Suas respostas foram registradas com sucesso.
        </p>

        <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
          Obrigado por participar do nosso processo seletivo! Suas respostas serão analisadas e, em breve, entraremos em contato com você.
        </p>

        {/* Candidate Submission Confirmation Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 mb-8 text-left max-w-md mx-auto">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Resumo do Registro</span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-slate-600">
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-500">Candidato:</span>
              <span className="font-semibold text-slate-900">{candidate.fullName || 'Não informado'}</span>
            </div>
            {candidate.phone && (
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Telefone:</span>
                <span className="font-semibold text-slate-900">{candidate.phone}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-500">Vaga:</span>
              <span className="font-semibold text-slate-900">{candidate.jobPosition || 'Analista'}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Status:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Processado
              </span>
            </div>
          </div>
        </div>

        {/* Privacy Note - strictly clarifying no score is exposed to candidate */}
        <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 mb-6">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Os dados foram criptografados e encaminhados diretamente à equipe de recrutamento.</span>
        </div>

        {/* Close page instruction */}
        <div className="pt-6 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-500 bg-slate-100 inline-block px-4 py-2 rounded-xl">
            Você pode fechar esta página.
          </p>
        </div>

      </div>

    </div>
  );
};
