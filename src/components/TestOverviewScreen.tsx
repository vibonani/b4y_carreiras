import React from 'react';
import { ArrowRight } from 'lucide-react';
import logo from '../assets/back4you-logo.png';

interface TestOverviewScreenProps {
  onContinue: () => void;
}

export const TestOverviewScreen: React.FC<TestOverviewScreenProps> = ({ onContinue }) => {
  return (
    <div id="screen-test-overview" className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
      <h1 className="font-serif text-2xl sm:text-3xl text-slate-900 tracking-tight mb-8 leading-snug">
        Seu próximo desafio <span className="italic font-bold">começa aqui.</span>
      </h1>

      <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
        Na B4Y, acreditamos que contratar bem vai muito além de analisar experiências e conhecimentos técnicos.
        Queremos entender <strong>como você pensa, como toma decisões, o que valoriza e como pode contribuir para o nosso time</strong>.
      </p>

      <p className="text-sm sm:text-base text-slate-700 mb-8">
        Por isso, esta etapa é composta por três avaliações:
      </p>

      <div className="space-y-6 mb-8 text-left sm:text-center">
        <div>
          <p className="text-sm sm:text-base font-bold text-slate-900">
            BIG 5: <span className="italic font-semibold">Como você funciona</span>
          </p>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Mapeia diferentes características da sua personalidade e ajuda a entender seus padrões de comportamento.
          </p>
        </div>

        <div>
          <p className="text-sm sm:text-base font-bold text-slate-900">
            FIT CULTURAL: <span className="italic font-semibold">Como você se conecta</span>
          </p>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Avalia o alinhamento entre seus valores, atitudes e a cultura da B4Y.
          </p>
        </div>

        <div>
          <p className="text-sm sm:text-base font-bold text-slate-900">
            RACIOCÍNIO LÓGICO: <span className="italic font-semibold">Como você resolve</span>
          </p>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Avalia sua capacidade de analisar informações, identificar relações e buscar soluções de forma lógica.
          </p>
        </div>
      </div>

      <p className="text-sm sm:text-base text-slate-700 mb-6">
        Cada teste tem um objetivo diferente, mas todos contribuem para uma visão mais completa do seu perfil.
      </p>

      <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-8">
        Não busque responder aquilo que parece mais "correto".
        Busque responder aquilo que é verdadeiro para você. <strong className="italic">Quanto mais autênticas forem suas respostas</strong>,
        melhor conseguiremos entender se existe uma boa conexão entre o seu perfil, a posição e a B4Y.
      </p>

      <p className="text-sm sm:text-base text-slate-900 font-semibold mb-10">
        <strong>Boa avaliação!</strong> E mostre quem você é.
      </p>

      <img src={logo} alt="Back4You" className="h-7 sm:h-8 w-auto mx-auto mb-10" />

      <button
        id="btn-overview-continue"
        type="button"
        onClick={onContinue}
        className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-white bg-[#0a2e35] hover:bg-[#0d3d46] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0a2e35] focus:ring-offset-2"
      >
        <span>Continuar</span>
        <ArrowRight className="w-5 h-5 ml-2.5" />
      </button>
    </div>
  );
};
