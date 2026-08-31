import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  testName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  testName
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  return (
    <div id="test-progress-bar-container" className="w-full mb-6">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2 text-slate-600">
        <div className="flex items-center space-x-2">
          <span>{label || `${current} de ${total}`}</span>
        </div>
        <span className="font-semibold text-slate-700">{percentage}% concluído</span>
      </div>
      
      <div className="w-full h-2 sm:h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/70 shadow-inner">
        <div
          className="h-full bg-teal-600 transition-all duration-300 ease-out rounded-full shadow-xs"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
