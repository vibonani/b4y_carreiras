import React from 'react';
import { Check } from 'lucide-react';

interface AnswerOptionProps {
  id: string;
  label: string; // 'A', 'B', 'C', 'D'
  text: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  id,
  label,
  text,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  return (
    <button
      id={`answer-option-${id}`}
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 flex items-start space-x-3.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
        isSelected
          ? 'bg-teal-50/70 border-teal-600 ring-1 ring-teal-600 shadow-sm'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-xs'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* Option Key Label / Circle */}
      <div
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-colors ${
          isSelected
            ? 'bg-teal-600 text-white shadow-xs'
            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900 border border-slate-200'
        }`}
      >
        {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : label}
      </div>

      {/* Answer Text */}
      <div className="flex-1 pt-0.5 sm:pt-1">
        <p
          className={`text-sm sm:text-base leading-relaxed ${
            isSelected ? 'text-slate-900 font-semibold' : 'text-slate-700 font-normal group-hover:text-slate-900'
          }`}
        >
          {text}
        </p>
      </div>

      {/* Radio Indicator */}
      <div className="shrink-0 pt-1">
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
            isSelected
              ? 'border-teal-600 bg-teal-600'
              : 'border-slate-300 bg-white group-hover:border-slate-400'
          }`}
        >
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>
    </button>
  );
};
