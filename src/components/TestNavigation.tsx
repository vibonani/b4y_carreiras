import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TestNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isAnswerSelected: boolean;
  finishButtonText?: string;
  nextButtonText?: string;
}

export const TestNavigation: React.FC<TestNavigationProps> = ({
  onPrev,
  onNext,
  isFirstQuestion,
  isLastQuestion,
  isAnswerSelected,
  finishButtonText = 'Finalizar teste',
  nextButtonText = 'Próxima'
}) => {
  return (
    <div id="test-navigation-controls" className="pt-6 sm:pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Previous Button */}
      <button
        id="btn-nav-prev"
        type="button"
        onClick={onPrev}
        disabled={isFirstQuestion}
        className={`w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
          isFirstQuestion
            ? 'opacity-40 cursor-not-allowed text-slate-400 border-slate-200 bg-slate-50'
            : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50 hover:text-slate-900 cursor-pointer shadow-xs'
        }`}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span>Voltar</span>
      </button>

      {/* Next or Finish Button */}
      <button
        id="btn-nav-next"
        type="button"
        onClick={onNext}
        disabled={!isAnswerSelected}
        className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
          isAnswerSelected
            ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer hover:shadow focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <span>{isLastQuestion ? finishButtonText : nextButtonText}</span>
        {isLastQuestion ? (
          <CheckCircle2 className="w-4 h-4 ml-2 text-emerald-300" />
        ) : (
          <ArrowRight className="w-4 h-4 ml-2" />
        )}
      </button>
    </div>
  );
};
