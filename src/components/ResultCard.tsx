import React from 'react';

interface ResultCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  subtitle,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
      <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">
        {title}
      </p>
      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
        {value}
      </h3>
      {subtitle && (
        <p className="text-xs text-slate-400 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};
