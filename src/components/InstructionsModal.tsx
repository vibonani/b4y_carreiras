import React from 'react';
import { MegaphoneOff, Clock } from 'lucide-react';

interface InstructionsModalProps {
  onConfirm: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div
        className="w-full max-w-2xl rounded-3xl p-6 sm:p-10"
        style={{
          background: 'linear-gradient(135deg, #0a2e60 0%, #0a1a40 100%)',
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center mb-5">
              <MegaphoneOff className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>
            <p className="text-white font-serif text-lg leading-snug">
              Encontre um local tranquilo,<br />onde você não seja perturbado
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center mb-5">
              <Clock className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>
            <p className="text-white font-serif text-lg leading-snug">
              O teste dura<br />aproximadamente 35 minutos
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            id="btn-instructions-ok"
            type="button"
            onClick={onConfirm}
            className="px-10 py-3 rounded-full text-sm font-bold text-[#0a1a40] bg-white hover:bg-slate-100 shadow-md transition-colors cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
