import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TestIntroProps {
  onStart: () => void;
}

export const TestIntro: React.FC<TestIntroProps> = ({ onStart }) => {
  return (
    <div
      id="screen-test-intro"
      className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#e6f4f1',
      }}
    >
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center">
        <p className="text-sm font-medium text-slate-600 tracking-wide mb-4">
          Back4You Carreiras
        </p>

        <h1 className="font-serif text-4xl sm:text-6xl text-slate-900 tracking-tight mb-6 leading-tight">
          Dê <span className="font-bold">o primeiro</span> passo.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-10">
          Faça parte da maior empresa de gestão financeira médica do Brasil
        </p>

        <button
          id="btn-start-assessment"
          type="button"
          onClick={onStart}
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-white bg-[#0a2e35] hover:bg-[#0d3d46] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0a2e35] focus:ring-offset-2"
        >
          <span>Iniciar Teste</span>
          <ArrowRight className="w-5 h-5 ml-2.5" />
        </button>
      </div>
    </div>
  );
};
