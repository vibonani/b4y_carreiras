import React, { useEffect } from 'react';
import { AnswerOption } from './AnswerOption';

export interface OptionItem {
  id: string;
  label: string;
  text: string;
}

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  scenario?: string;
  title?: string;
  prompt: string;
  description?: string;
  visualPattern?: string[];
  options: OptionItem[];
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionNumber,
  totalQuestions,
  scenario,
  title,
  prompt,
  description,
  visualPattern,
  options,
  selectedOptionId,
  onSelectOption,
}) => {
  // Add keyboard shortcuts (A, B, C, D or 1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      
      const key = e.key.toUpperCase();
      const optionMap: Record<string, number> = {
        'A': 0, '1': 0,
        'B': 1, '2': 1,
        'C': 2, '3': 2,
        'D': 3, '4': 3,
        'E': 4, '5': 4,
      };

      if (key in optionMap) {
        const index = optionMap[key];
        if (options[index]) {
          onSelectOption(options[index].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, onSelectOption]);

  return (
    <div id={`question-card-${questionNumber}`} className="mb-6">
      
      {/* Context / Scenario (if present) */}
      {scenario && (
        <div className="mb-4 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <span className="font-bold text-slate-900 mr-1.5">Contexto:</span>
          {scenario}
        </div>
      )}

      {/* Main Question Prompt */}
      <h2 className="text-base sm:text-xl font-bold text-slate-900 leading-snug mb-1.5 sm:mb-2">
        {prompt}
      </h2>

      {/* Optional Description / Subtitle */}
      {description && (
        <p className="text-xs sm:text-sm text-slate-500 font-medium mb-4 sm:mb-6">
          {description}
        </p>
      )}

      {/* Visual Logic Sequence/Pattern if present */}
      {visualPattern && visualPattern.length > 0 && (
        <div className="mb-6 p-4 sm:p-6 rounded-xl bg-slate-900 text-white flex items-center justify-center space-x-2 sm:space-x-4 shadow-inner overflow-x-auto">
          {visualPattern.map((item, idx) => (
            <React.Fragment key={idx}>
              <div className={`flex items-center justify-center font-mono font-bold text-base sm:text-xl px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border ${
                item === '?' 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse font-extrabold ring-2 ring-amber-300' 
                  : 'bg-slate-800 text-teal-200 border-slate-700'
              }`}>
                {item}
              </div>
              {idx < visualPattern.length - 1 && (
                <span className="text-slate-500 font-bold text-sm sm:text-base">—</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Options List */}
      <div className="space-y-3">
        {options.map((opt) => (
          <AnswerOption
            key={opt.id}
            id={opt.id}
            label={opt.label}
            text={opt.text}
            isSelected={selectedOptionId === opt.id}
            onSelect={() => onSelectOption(opt.id)}
          />
        ))}
      </div>

      {/* Keyboard hint */}
      <div className="mt-4 flex items-center justify-end text-[11px] text-slate-400">
        <span className="hidden sm:inline">
          Dica: Você também pode usar as teclas{' '}
          {options.map((opt, idx) => (
            <React.Fragment key={opt.id}>
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-slate-700">{opt.label}</kbd>
              {idx < options.length - 1 && ' '}
            </React.Fragment>
          ))}
        </span>
      </div>

    </div>
  );
};
