import React from 'react';
import { Check, User, Compass, HeartHandshake, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { StepId } from '../types';

interface StepIndicatorProps {
  currentStep: StepId;
}

interface StepItem {
  id: StepId;
  order: number;
  label: string;
  icon: React.ElementType;
}

const STEPS: StepItem[] = [
  { id: 'identification', order: 1, label: 'Identificação', icon: User },
  { id: 'disc', order: 2, label: 'DISC', icon: Compass },
  { id: 'fit_cultural', order: 3, label: 'Fit Cultural', icon: HeartHandshake },
  { id: 'logic', order: 4, label: 'Raciocínio Lógico', icon: BrainCircuit },
  { id: 'completed', order: 5, label: 'Concluído', icon: CheckCircle2 },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  // If welcome step, do not show full breadcrumbs or show step 1 starting
  if (currentStep === 'welcome') {
    return null;
  }

  const getStepStatus = (stepId: StepId) => {
    const stepOrderMap: Record<StepId, number> = {
      welcome: 0,
      identification: 1,
      disc: 2,
      fit_cultural: 3,
      logic: 4,
      completed: 5,
    };

    const currentOrder = stepOrderMap[currentStep] || 1;
    const targetOrder = stepOrderMap[stepId] || 1;

    if (currentOrder > targetOrder) return 'completed';
    if (currentOrder === targetOrder) return 'current';
    return 'upcoming';
  };

  return (
    <div id="step-indicator-container" className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6">
      <nav aria-label="Progresso da Avaliação">
        {/* Desktop & Tablet Progress Bar */}
        <ol className="hidden sm:flex items-center justify-between w-full relative">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />

          {STEPS.map((step, idx) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;

            return (
              <li key={step.id} className="relative z-10 flex flex-col items-center group">
                {/* Circle Badge */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-xs ${
                    status === 'completed'
                      ? 'bg-slate-900 text-white ring-4 ring-slate-100'
                      : status === 'current'
                      ? 'bg-teal-600 text-white ring-4 ring-teal-50 shadow-md ring-offset-2'
                      : 'bg-white text-slate-400 border border-slate-300'
                  }`}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
                  ) : (
                    <span>{step.order}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-2 text-center">
                  <span
                    className={`block text-xs font-semibold tracking-tight transition-colors ${
                      status === 'current'
                        ? 'text-teal-900 font-bold'
                        : status === 'completed'
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Mobile View: Compact Status Indicator */}
        <div className="sm:hidden bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs">
              {STEPS.find(s => s.id === currentStep)?.order || 1}
            </span>
            <div>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                Etapa {STEPS.find(s => s.id === currentStep)?.order || 1} de 5
              </span>
              <span className="text-sm font-bold text-slate-900">
                {STEPS.find(s => s.id === currentStep)?.label || 'Avaliação'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {STEPS.map((s) => {
              const status = getStepStatus(s.id);
              return (
                <div
                  key={s.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    status === 'completed'
                      ? 'w-4 bg-slate-900'
                      : status === 'current'
                      ? 'w-6 bg-teal-600'
                      : 'w-2 bg-slate-200'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};
