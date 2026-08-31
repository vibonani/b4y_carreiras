import React from 'react';
import { CheckCircle2, ArrowRight, Clock, LucideIcon } from 'lucide-react';

interface StepTransitionModalProps {
  completedLabel: string;
  nextLabel: string;
  nextIcon: LucideIcon;
  note?: string;
  onConfirm: () => void;
}

export const StepTransitionModal: React.FC<StepTransitionModalProps> = ({
  completedLabel,
  nextLabel,
  nextIcon: NextIcon,
  note,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div
        className="w-full max-w-md rounded-3xl p-6 sm:p-10 text-center"
        style={{
          background: 'linear-gradient(135deg, #0a2e60 0%, #0a1a40 100%)',
        }}
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />
        </div>

        <p className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
          {completedLabel} concluído
        </p>

        <h3 className="text-white font-serif text-xl sm:text-2xl leading-snug mb-6">
          Agora vamos iniciar o {nextLabel}
        </h3>

        {note && (
          <div className="flex items-start gap-2.5 text-left bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 mb-8">
            <Clock className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{note}</p>
          </div>
        )}

        <button
          id="btn-step-transition-continue"
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center justify-center gap-2 px-10 py-3 rounded-full text-sm font-bold text-[#0a1a40] bg-white hover:bg-slate-100 shadow-md transition-colors cursor-pointer"
        >
          <NextIcon className="w-4 h-4" />
          <span>Iniciar {nextLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
