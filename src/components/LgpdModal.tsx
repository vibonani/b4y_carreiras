import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface LgpdModalProps {
  onAccept: () => void;
  onClose: () => void;
}

export const LgpdModal: React.FC<LgpdModalProps> = ({ onAccept, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div
        id="modal-lgpd-consent"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight pt-1.5">
              Aviso de Privacidade e Consentimento (LGPD)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto text-sm text-slate-700 leading-relaxed space-y-4">
          <p>
            Ao preencher este formulário, você autoriza a coleta e o processamento dos seus dados pessoais
            (Nome, E-mail e Telefone) exclusivamente para a realização, correção e comunicação dos resultados
            desta avaliação.
          </p>
          <p>
            Seus dados serão armazenados de forma segura pela Back4You, não serão compartilhados com terceiros
            e serão mantidos pelo período necessário para a conclusão deste processo.
          </p>
          <p>
            Você pode solicitar a correção ou exclusão das suas informações a qualquer momento enviando um
            e-mail para{' '}
            <a
              href="mailto:bianca.kochenborger@back4you.com.br"
              className="text-teal-700 font-semibold hover:underline"
            >
              bianca.kochenborger@back4you.com.br
            </a>
            .
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            id="btn-lgpd-decline"
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            id="btn-lgpd-accept"
            type="button"
            onClick={onAccept}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-colors cursor-pointer"
          >
            Li e aceito
          </button>
        </div>
      </div>
    </div>
  );
};
