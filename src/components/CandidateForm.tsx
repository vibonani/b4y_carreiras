import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Briefcase, CheckSquare, ArrowRight, AlertCircle, ShieldAlert, CheckCircle2, Clock, Lock, Loader2 } from 'lucide-react';
import { CandidateInfo, JobPosition } from '../types';
import { AssessmentService } from '../services/apiService';
import { LgpdModal } from './LgpdModal';

interface CandidateFormProps {
  initialData: CandidateInfo;
  onSubmit: (data: CandidateInfo) => void | Promise<void>;
  // True when the server rejected the submitted e-mail because it already
  // has a CONCLUÍDA session (checked authoritatively on submit, in App.tsx)
  externallyBlocked?: boolean;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({
  initialData,
  onSubmit,
  externallyBlocked = false,
}) => {
  const [formData, setFormData] = useState<CandidateInfo>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof CandidateInfo, string>>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [duplicateResult, setDuplicateResult] = useState<{ isDuplicate: boolean; reason?: 'email' | 'phone' } | null>(null);
  const [showLgpdModal, setShowLgpdModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobPositions, setJobPositions] = useState<string[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(true);

  useEffect(() => {
    AssessmentService.getJobPositions()
      .then(setJobPositions)
      .catch(() => setJobPositions([]))
      .finally(() => setLoadingPositions(false));
  }, []);

  const isBlocked = !!duplicateResult?.isDuplicate || externallyBlocked;
  const blockedReason: 'email' | 'phone' = duplicateResult?.reason || 'email';

  // Helper to format Brazilian phone number: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '').slice(0, 11);
    
    if (digits.length <= 2) {
      return digits.length > 0 ? `(${digits}` : '';
    }
    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  // Real-time duplicate check when user finishes typing email or phone
  const handleCheckDuplicatesRealtime = async (currentEmail?: string, currentPhone?: string) => {
    const emailToCheck = currentEmail !== undefined ? currentEmail : formData.email;
    const phoneToCheck = currentPhone !== undefined ? currentPhone : formData.phone;

    if (emailToCheck.trim() || phoneToCheck.trim()) {
      const dup = await AssessmentService.checkDuplicateCandidate(emailToCheck, phoneToCheck);
      if (dup.isDuplicate) {
        setDuplicateResult(dup);
        setErrors(prev => ({
          ...prev,
          ...(dup.reason === 'email' ? { email: 'Este e-mail já possui uma avaliação registrada.' } : {}),
          ...(dup.reason === 'phone' ? { phone: 'Este telefone já possui uma avaliação registrada.' } : {})
        }));
      } else {
        setDuplicateResult(null);
      }
    }
  };

  const validate = async (): Promise<boolean> => {
    const newErrors: Partial<Record<keyof CandidateInfo, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Por favor, informe seu nome completo.';
    } else if (formData.fullName.trim().split(' ').length < 2) {
      newErrors.fullName = 'Informe ao menos nome e sobrenome.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Por favor, informe seu e-mail.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Insira um endereço de e-mail válido.';
    }

    // Phone validation (at least 10 digits without formatting)
    const phoneDigits = (formData.phone || '').replace(/\D/g, '');
    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = 'Por favor, informe seu telefone com DDD.';
    } else if (phoneDigits.length < 10) {
      newErrors.phone = 'Informe um telefone válido com DDD (mínimo 10 dígitos).';
    }

    if (!formData.jobPosition) {
      newErrors.jobPosition = 'Por favor, selecione a vaga para a qual está se candidatando.';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'É necessário concordar com os termos para prosseguir.';
    }

    // Duplicate check: reuses whatever handleCheckDuplicatesRealtime already found
    // on blur, instead of re-querying the server here — that network round-trip
    // (now against the Google Sheet) was adding several seconds of delay to every
    // submit. It's just an early warning anyway: onSubmit's session start in
    // App.tsx re-checks authoritatively against the CONCLUÍDA session record and
    // blocks the candidate for real if this one somehow missed a duplicate.
    if (duplicateResult?.isDuplicate) {
      if (duplicateResult.reason === 'email') {
        newErrors.email = 'Este e-mail já possui uma avaliação finalizada neste processo.';
      } else {
        newErrors.phone = 'Este telefone já possui uma avaliação finalizada neste processo.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (await validate()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div id="screen-candidate-identification" className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      
      <div className="relative">
        
        {/* Form Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
            Identificação do Candidato
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Preencha seus dados para iniciar suas etapas de avaliação.
          </p>
        </div>

        {/* Prominent Duplicate Warning Alert if already completed */}
        {isBlocked && (
          <div id="alert-duplicate-candidate" className="mb-6 rounded-2xl bg-amber-50/90 border border-amber-200 p-5 text-slate-800 animate-fadeIn">
            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    Avaliação já realizada anteriormente
                  </h4>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-200/80 text-amber-900">
                    {blockedReason === 'email' ? 'E-mail em uso' : 'Telefone em uso'}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Identificamos em nosso banco de dados que já existe um teste concluído registrado com{' '}
                  <strong>
                    {blockedReason === 'email' ? formData.email : formData.phone}
                  </strong>.
                </p>
                <div className="pt-2 border-t border-amber-200/60 flex items-center space-x-2 text-xs text-amber-900 font-medium">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>
                    Regra do processo: cada candidato só pode realizar o teste uma única vez. Suas respostas já estão salvas com a equipe de RH.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Elements */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          
          {/* Nome Completo */}
          <div>
            <label htmlFor="input-full-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nome completo <span className="text-slate-900" style={{ fontFamily: 'system-ui, Arial, sans-serif' }}>*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="input-full-name"
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
                onBlur={() => setTouched({ ...touched, fullName: true })}
                placeholder="Ex: Maria Silva Santos"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.fullName
                    ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-teal-500 hover:border-slate-400'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* E-mail */}
          <div>
            <label htmlFor="input-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
              E-mail corporativo ou pessoal <span className="text-slate-900" style={{ fontFamily: 'system-ui, Arial, sans-serif' }}>*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="input-email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                  if (duplicateResult?.reason === 'email') setDuplicateResult(null);
                }}
                onBlur={() => {
                  setTouched({ ...touched, email: true });
                  handleCheckDuplicatesRealtime(formData.email, undefined);
                }}
                placeholder="Ex: maria.silva@exemplo.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.email
                    ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-teal-500 hover:border-slate-400'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Telefone / WhatsApp */}
          <div>
            <label htmlFor="input-phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Telefone / WhatsApp <span className="text-slate-900" style={{ fontFamily: 'system-ui, Arial, sans-serif' }}>*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="input-phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setFormData({ ...formData, phone: formatted });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                  if (duplicateResult?.reason === 'phone') setDuplicateResult(null);
                }}
                onBlur={() => {
                  setTouched({ ...touched, phone: true });
                  handleCheckDuplicatesRealtime(undefined, formData.phone);
                }}
                placeholder="(11) 99999-9999"
                maxLength={15}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.phone
                    ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-teal-500 hover:border-slate-400'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Vaga (Dropdown) */}
          <div>
            <label htmlFor="select-job-position" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Vaga pretendida <span className="text-slate-900" style={{ fontFamily: 'system-ui, Arial, sans-serif' }}>*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <select
                id="select-job-position"
                value={formData.jobPosition}
                disabled={loadingPositions}
                onChange={(e) => {
                  setFormData({ ...formData, jobPosition: e.target.value as JobPosition });
                  if (errors.jobPosition) setErrors({ ...errors, jobPosition: undefined });
                }}
                onBlur={() => setTouched({ ...touched, jobPosition: true })}
                className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm transition-colors text-slate-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-60 disabled:cursor-not-allowed ${
                  errors.jobPosition
                    ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-teal-500 hover:border-slate-400'
                }`}
              >
                <option value="">
                  {loadingPositions ? 'Carregando vagas...' : 'Selecione a vaga...'}
                </option>
                {jobPositions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.jobPosition && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                {errors.jobPosition}
              </p>
            )}
          </div>

          {/* Checkbox: Li e estou ciente... (abre o aviso de LGPD antes de marcar) */}
          <div className="pt-2">
            <div className="flex items-start space-x-3 select-none">
              <label htmlFor="checkbox-terms" className="-m-3.5 p-3.5 shrink-0 cursor-pointer">
                <input
                  id="checkbox-terms"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Don't let it check itself directly — open the LGPD notice
                      // first; the checkbox stays unchecked until they accept it.
                      setShowLgpdModal(true);
                    } else {
                      setFormData({ ...formData, termsAccepted: false });
                      if (errors.termsAccepted) setErrors({ ...errors, termsAccepted: undefined });
                    }
                  }}
                  className="block w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
              </label>
              <span className="text-xs sm:text-sm text-slate-600 leading-snug pt-1">
                Li e estou ciente das{' '}
                <button
                  id="btn-open-lgpd-notice"
                  type="button"
                  onClick={() => setShowLgpdModal(true)}
                  className="text-teal-700 font-semibold underline underline-offset-2 hover:text-teal-800 cursor-pointer"
                >
                  informações sobre a realização desta avaliação
                </button>
                .
              </span>
            </div>
            {errors.termsAccepted && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                {errors.termsAccepted}
              </p>
            )}
          </div>

          {showLgpdModal && (
            <LgpdModal
              onClose={() => setShowLgpdModal(false)}
              onAccept={() => {
                setFormData((prev) => ({ ...prev, termsAccepted: true }));
                if (errors.termsAccepted) setErrors((prev) => ({ ...prev, termsAccepted: undefined }));
                setShowLgpdModal(false);
              }}
            />
          )}

          {/* Submit Button */}
          <div className="pt-4">
            {isBlocked ? (
              <button
                id="btn-submit-identification-blocked"
                type="button"
                disabled
                className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-bold text-amber-900 bg-amber-200/90 cursor-not-allowed opacity-90 shadow-sm"
              >
                <Lock className="w-5 h-5 mr-2 text-amber-800" />
                <span>Avaliação Já Concluída neste Processo</span>
              </button>
            ) : (
              <button
                id="btn-submit-identification"
                type="submit"
                disabled={isSubmitting}
                className={`w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-bold text-white shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                  isSubmitting
                    ? 'bg-teal-600/70 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>Continuar para a Avaliação</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>

        </form>

      </div>

    </div>
  );
};
