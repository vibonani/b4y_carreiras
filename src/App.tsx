import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  StepId,
  CandidateInfo,
  JobPosition,
  SessionState
} from './types';
import { 
  DISC_QUESTIONS, 
  FIT_CULTURAL_QUESTIONS, 
  LOGIC_QUESTIONS 
} from './data/mockData';
import { AssessmentService } from './services/apiService';
import { AuthService } from './services/authService';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { ProgressBar } from './components/ProgressBar';
import { QuestionCard } from './components/QuestionCard';
import { TestNavigation } from './components/TestNavigation';
import { TestIntro } from './components/TestIntro';
import { InstructionsModal } from './components/InstructionsModal';
import { StepTransitionModal } from './components/StepTransitionModal';
import { QuestionTimer } from './components/QuestionTimer';
import { HeartHandshake, BrainCircuit, Loader2 } from 'lucide-react';
import { CandidateForm } from './components/CandidateForm';
import { CompletionScreen } from './components/CompletionScreen';
import { Dashboard } from './components/Dashboard';
import { AdminLogin } from './components/AdminLogin';

// Key used to remember the candidate's session across reloads / closed tabs
const SESSION_STORAGE_KEY = 'b4y_session_id';

export default function App() {
  // Helper to check if current URL points to Management / HR view
  const isManagementRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (
      path.includes('demo-dashboard') ||
      path.includes('admin') ||
      path.includes('gerencia') ||
      path.includes('rh') ||
      search.includes('rh') ||
      search.includes('admin') ||
      search.includes('view=dashboard') ||
      hash.includes('dashboard') ||
      hash.includes('admin') ||
      hash.includes('rh')
    );
  };

  // Navigation View: 'candidate' (default) vs 'dashboard' (Restricted to Management, requires server-side login)
  const [currentView, setCurrentView] = useState<'candidate' | 'dashboard'>('candidate');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showDiscToFitTransition, setShowDiscToFitTransition] = useState(false);
  const [showFitToLogicTransition, setShowFitToLogicTransition] = useState(false);

  // Assessment session (persisted server-side, resumable across reloads)
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRehydrating, setIsRehydrating] = useState(true);
  const [identificationBlocked, setIdentificationBlocked] = useState(false);

  // Candidate Assessment Flow State
  const [step, setStep] = useState<StepId>('welcome');

  // Candidate Identity State
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>({
    fullName: '',
    email: '',
    phone: '',
    jobPosition: '',
    termsAccepted: false,
  });

  // Answers State
  const [discAnswers, setDiscAnswers] = useState<Record<number, string>>({});
  const [fitAnswers, setFitAnswers] = useState<Record<number, string>>({});
  const [logicAnswers, setLogicAnswers] = useState<Record<number, string>>({});

  // Question Indices
  const [currentDiscIndex, setCurrentDiscIndex] = useState<number>(0);
  const [currentFitIndex, setCurrentFitIndex] = useState<number>(0);
  const [currentLogicIndex, setCurrentLogicIndex] = useState<number>(0);

  // Sync URL changes with view state
  const handleViewChange = (view: 'candidate' | 'dashboard') => {
    setCurrentView(view);
    if (view === 'dashboard') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  // Any attempt to reach the management area goes through the server-side session check first
  const requestDashboardAccess = async () => {
    const authed = await AuthService.status();
    setIsAuthenticated(authed);
    if (authed) {
      handleViewChange('dashboard');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleGuardedNavigate = (view: 'candidate' | 'dashboard') => {
    if (view === 'dashboard') {
      requestDashboardAccess();
    } else {
      handleViewChange(view);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
    handleViewChange('dashboard');
  };

  const handleLoginCancel = () => {
    setShowLoginModal(false);
    if (isManagementRoute()) {
      window.history.pushState({}, '', '/');
    }
  };

  // Handle browser back/forward buttons & URL hash changes
  useEffect(() => {
    const handlePopState = () => {
      if (isManagementRoute()) {
        requestDashboardAccess();
      } else {
        setCurrentView('candidate');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Check auth on first load in case the app was opened directly on a management URL
  useEffect(() => {
    if (isManagementRoute()) {
      requestDashboardAccess();
    }
  }, []);

  // Silently resume an in-progress session remembered from a previous visit
  // (reload or closed-tab-and-reopened), rehydrating step/answers/index at once.
  useEffect(() => {
    const rehydrate = async () => {
      const storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!storedSessionId) {
        setIsRehydrating(false);
        return;
      }

      const session = await AssessmentService.getSession(storedSessionId);

      if (!session || session.status === 'CONCLUIDA') {
        // Session finished (or no longer exists) — clear it and let the candidate
        // go through identification again; the server will re-block them there
        // if the assessment for that e-mail is already CONCLUÍDA.
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setIsRehydrating(false);
        return;
      }

      applySessionState(session);
      setStep(session.etapaAtual);
      setIsRehydrating(false);
    };

    rehydrate();
  }, []);

  // Secret keyboard shortcut for management (Ctrl + Shift + A or Alt + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setCurrentView(prev => {
          if (prev === 'candidate') {
            requestDashboardAccess();
            return prev;
          }
          return 'candidate';
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Step 1: Start Welcome -> Identification
  const handleStartWelcome = () => {
    setStep('identification');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Restores candidateInfo, answers and the current question index from a
  // session fetched from the server (used both on reload and on resume-by-email).
  const applySessionState = (session: SessionState) => {
    setSessionId(session.sessionId);
    localStorage.setItem(SESSION_STORAGE_KEY, session.sessionId);
    setCandidateInfo(prev => ({
      ...prev,
      fullName: session.nome,
      email: session.email,
      jobPosition: (session.vaga || '') as JobPosition | '',
    }));
    setDiscAnswers(session.respostas.disc);
    setFitAnswers(session.respostas.fit_cultural);
    setLogicAnswers(session.respostas.logic);
    if (session.etapaAtual === 'disc') setCurrentDiscIndex(session.questaoAtual);
    if (session.etapaAtual === 'fit_cultural') setCurrentFitIndex(session.questaoAtual);
    if (session.etapaAtual === 'logic') setCurrentLogicIndex(session.questaoAtual);
  };

  // --- Step 2: Submit Identification -> create/resume session -> Instructions -> DISC
  const handleSubmitIdentification = async (info: CandidateInfo) => {
    setCandidateInfo(info);
    setIdentificationBlocked(false);

    const result = await AssessmentService.startOrResumeSession(info);

    if ('blocked' in result && result.blocked) {
      setIdentificationBlocked(true);
      return;
    }

    const session = result as SessionState;
    applySessionState(session);

    if (session.isNew) {
      // Brand-new session -> same flow as before: show instructions, start at DISC Q1
      setShowInstructionsModal(true);
    } else {
      // Resuming an in-progress session -> jump straight back to where they left off
      setStep(session.etapaAtual);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirmInstructions = () => {
    setShowInstructionsModal(false);
    setStep('disc');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Step 3: DISC Navigation
  const handleSelectDiscOption = (optionId: string) => {
    const qId = DISC_QUESTIONS[currentDiscIndex].id;
    setDiscAnswers(prev => ({ ...prev, [qId]: optionId }));
    if (sessionId) AssessmentService.saveAnswer(sessionId, 'disc', qId, optionId);
  };

  const handleNextDisc = () => {
    if (currentDiscIndex < DISC_QUESTIONS.length - 1) {
      const nextIndex = currentDiscIndex + 1;
      setCurrentDiscIndex(nextIndex);
      if (sessionId) AssessmentService.saveProgress(sessionId, 'disc', nextIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Last DISC question -> show transition message before Fit Cultural
      setShowDiscToFitTransition(true);
    }
  };

  const handleConfirmDiscToFitTransition = () => {
    setShowDiscToFitTransition(false);
    setStep('fit_cultural');
    setCurrentFitIndex(0);
    if (sessionId) AssessmentService.saveProgress(sessionId, 'fit_cultural', 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevDisc = () => {
    if (currentDiscIndex > 0) {
      const prevIndex = currentDiscIndex - 1;
      setCurrentDiscIndex(prevIndex);
      if (sessionId) AssessmentService.saveProgress(sessionId, 'disc', prevIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- Step 4: Fit Cultural Navigation
  const handleSelectFitOption = (optionId: string) => {
    const qId = FIT_CULTURAL_QUESTIONS[currentFitIndex].id;
    setFitAnswers(prev => ({ ...prev, [qId]: optionId }));
    if (sessionId) AssessmentService.saveAnswer(sessionId, 'fit_cultural', qId, optionId);
  };

  const handleNextFit = () => {
    if (currentFitIndex < FIT_CULTURAL_QUESTIONS.length - 1) {
      const nextIndex = currentFitIndex + 1;
      setCurrentFitIndex(nextIndex);
      if (sessionId) AssessmentService.saveProgress(sessionId, 'fit_cultural', nextIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Last Fit question -> inform the candidate before starting the timed Logical Reasoning test
      setShowFitToLogicTransition(true);
    }
  };

  const handleConfirmFitToLogicTransition = () => {
    setShowFitToLogicTransition(false);
    setStep('logic');
    setCurrentLogicIndex(0);
    if (sessionId) AssessmentService.saveProgress(sessionId, 'logic', 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevFit = () => {
    if (currentFitIndex > 0) {
      const prevIndex = currentFitIndex - 1;
      setCurrentFitIndex(prevIndex);
      if (sessionId) AssessmentService.saveProgress(sessionId, 'fit_cultural', prevIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- Step 5: Logical Reasoning Navigation
  const handleSelectLogicOption = (optionId: string) => {
    const qId = LOGIC_QUESTIONS[currentLogicIndex].id;
    setLogicAnswers(prev => ({ ...prev, [qId]: optionId }));
    if (sessionId) AssessmentService.saveAnswer(sessionId, 'logic', qId, optionId);
  };

  const handleNextLogic = () => {
    if (currentLogicIndex < LOGIC_QUESTIONS.length - 1) {
      const nextIndex = currentLogicIndex + 1;
      setCurrentLogicIndex(nextIndex);
      if (sessionId) AssessmentService.saveProgress(sessionId, 'logic', nextIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Finalize full assessment! Process and submit results to the server for the HR Dashboard
      AssessmentService.processAndSaveAssessment(
        candidateInfo,
        discAnswers,
        fitAnswers,
        logicAnswers
      );

      // Transition to final candidate completion screen
      setStep('completed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevLogic = () => {
    if (currentLogicIndex > 0) {
      const prevIndex = currentLogicIndex - 1;
      setCurrentLogicIndex(prevIndex);
      if (sessionId) AssessmentService.saveProgress(sessionId, 'logic', prevIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Page Transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
  };

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900"
      style={{ backgroundColor: currentView === 'candidate' && step === 'welcome' ? '#e6f4f1' : undefined }}
    >
      
      {/* Universal Corporate Header */}
      <Header
        currentView={currentView}
        onNavigate={handleGuardedNavigate}
        candidateName={candidateInfo.fullName}
        jobPosition={candidateInfo.jobPosition}
        showNav={step === 'welcome'}
      />

      {showLoginModal && (
        <AdminLogin onSuccess={handleLoginSuccess} onCancel={handleLoginCancel} />
      )}

      {showInstructionsModal && (
        <InstructionsModal onConfirm={handleConfirmInstructions} />
      )}

      {showDiscToFitTransition && (
        <StepTransitionModal
          completedLabel="Teste DISC"
          nextLabel="Fit Cultural"
          nextIcon={HeartHandshake}
          onConfirm={handleConfirmDiscToFitTransition}
        />
      )}

      {showFitToLogicTransition && (
        <StepTransitionModal
          completedLabel="Fit Cultural"
          nextLabel="Raciocínio Lógico"
          nextIcon={BrainCircuit}
          note="Cada questão terá um cronômetro de 2 minutos. Se o tempo acabar, você avança automaticamente para a próxima questão."
          onConfirm={handleConfirmFitToLogicTransition}
        />
      )}

      {/* Main Content View Switch */}
      {currentView === 'dashboard' ? (
        <main className="flex-1">
          <Dashboard
            onBackToTest={() => handleViewChange('candidate')}
            onUnauthorized={() => {
              setIsAuthenticated(false);
              handleViewChange('candidate');
              setShowLoginModal(true);
            }}
          />
        </main>
      ) : (
        <main className="flex-1 flex flex-col justify-between">
          
          {/* Top Stage Breadcrumb Indicator */}
          {!isRehydrating && <StepIndicator currentStep={step} />}

          {/* Dynamic Assessment Screens */}
          <div className="flex-1 flex flex-col justify-center">
            {isRehydrating ? (
              <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Carregando sua avaliação...</span>
              </div>
            ) : (
            <AnimatePresence mode="wait">

              {/* TELA 1: BOAS-VINDAS */}
              {step === 'welcome' && (
                <motion.div
                  key="welcome"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <TestIntro onStart={handleStartWelcome} />
                </motion.div>
              )}

              {/* TELA 2: IDENTIFICAÇÃO */}
              {step === 'identification' && (
                <motion.div
                  key="identification"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <CandidateForm
                    initialData={candidateInfo}
                    onSubmit={handleSubmitIdentification}
                    externallyBlocked={identificationBlocked}
                  />
                </motion.div>
              )}

              {/* TELA 3: DISC */}
              {step === 'disc' && (
                <motion.div
                  key={`disc-${currentDiscIndex}`}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="max-w-3xl mx-auto w-full px-4 py-6"
                >
                  <ProgressBar
                    current={currentDiscIndex + 1}
                    total={DISC_QUESTIONS.length}
                    label={`${currentDiscIndex + 1} de ${DISC_QUESTIONS.length}`}
                  />

                  {/* Question Card */}
                  <QuestionCard
                    questionNumber={currentDiscIndex + 1}
                    totalQuestions={DISC_QUESTIONS.length}
                    scenario={DISC_QUESTIONS[currentDiscIndex].scenario}
                    prompt={DISC_QUESTIONS[currentDiscIndex].prompt}
                    description={DISC_QUESTIONS[currentDiscIndex].description}
                    options={DISC_QUESTIONS[currentDiscIndex].options}
                    selectedOptionId={discAnswers[DISC_QUESTIONS[currentDiscIndex].id]}
                    onSelectOption={handleSelectDiscOption}
                  />

                  {/* Navigation Controls */}
                  <TestNavigation
                    onPrev={handlePrevDisc}
                    onNext={handleNextDisc}
                    isFirstQuestion={currentDiscIndex === 0}
                    isLastQuestion={currentDiscIndex === DISC_QUESTIONS.length - 1}
                    isAnswerSelected={!!discAnswers[DISC_QUESTIONS[currentDiscIndex].id]}
                    finishButtonText="Finalizar teste DISC"
                  />
                </motion.div>
              )}

              {/* TELA 4: FIT CULTURAL */}
              {step === 'fit_cultural' && (
                <motion.div
                  key={`fit-${currentFitIndex}`}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="max-w-3xl mx-auto w-full px-4 py-6"
                >
                  <ProgressBar
                    current={currentFitIndex + 1}
                    total={FIT_CULTURAL_QUESTIONS.length}
                    label={`${currentFitIndex + 1} de ${FIT_CULTURAL_QUESTIONS.length}`}
                  />

                  <QuestionCard
                    questionNumber={currentFitIndex + 1}
                    totalQuestions={FIT_CULTURAL_QUESTIONS.length}
                    prompt={FIT_CULTURAL_QUESTIONS[currentFitIndex].prompt}
                    options={FIT_CULTURAL_QUESTIONS[currentFitIndex].options}
                    selectedOptionId={fitAnswers[FIT_CULTURAL_QUESTIONS[currentFitIndex].id]}
                    onSelectOption={handleSelectFitOption}
                  />

                  <TestNavigation
                    onPrev={handlePrevFit}
                    onNext={handleNextFit}
                    isFirstQuestion={currentFitIndex === 0}
                    isLastQuestion={currentFitIndex === FIT_CULTURAL_QUESTIONS.length - 1}
                    isAnswerSelected={!!fitAnswers[FIT_CULTURAL_QUESTIONS[currentFitIndex].id]}
                    finishButtonText="Avançar para Raciocínio Lógico"
                  />
                </motion.div>
              )}

              {/* TELA 5: RACIOCÍNIO LÓGICO */}
              {step === 'logic' && (
                <motion.div
                  key={`logic-${currentLogicIndex}`}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="max-w-3xl mx-auto w-full px-4 py-6"
                >
                  <ProgressBar
                    current={currentLogicIndex + 1}
                    total={LOGIC_QUESTIONS.length}
                    label={`Questão ${currentLogicIndex + 1} de ${LOGIC_QUESTIONS.length}`}
                  />

                  <div className="flex justify-end mb-4">
                    <QuestionTimer
                      questionKey={currentLogicIndex}
                      duration={120}
                      onTimeUp={handleNextLogic}
                    />
                  </div>

                  <QuestionCard
                    questionNumber={currentLogicIndex + 1}
                    totalQuestions={LOGIC_QUESTIONS.length}
                    title={LOGIC_QUESTIONS[currentLogicIndex].title}
                    prompt={LOGIC_QUESTIONS[currentLogicIndex].prompt}
                    visualPattern={LOGIC_QUESTIONS[currentLogicIndex].visualPattern}
                    options={LOGIC_QUESTIONS[currentLogicIndex].options}
                    selectedOptionId={logicAnswers[LOGIC_QUESTIONS[currentLogicIndex].id]}
                    onSelectOption={handleSelectLogicOption}
                  />

                  <TestNavigation
                    onPrev={handlePrevLogic}
                    onNext={handleNextLogic}
                    isFirstQuestion={currentLogicIndex === 0}
                    isLastQuestion={currentLogicIndex === LOGIC_QUESTIONS.length - 1}
                    isAnswerSelected={!!logicAnswers[LOGIC_QUESTIONS[currentLogicIndex].id]}
                    finishButtonText="Concluir Avaliação"
                  />
                </motion.div>
              )}

              {/* TELA 6: CONCLUSÃO */}
              {step === 'completed' && (
                <motion.div
                  key="completed"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <CompletionScreen candidate={candidateInfo} />
                </motion.div>
              )}

            </AnimatePresence>
            )}
          </div>

          {/* Clean Corporate Footer */}
          {!isRehydrating && step !== 'welcome' && (
            <footer className="py-6 border-t border-slate-200/80 bg-white/50 text-center text-xs text-slate-400">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>© 2026 Back4You. Todos os direitos reservados.</span>
                <span>Ambiente seguro de seleção corporativa</span>
              </div>
            </footer>
          )}

        </main>
      )}

    </div>
  );
}
