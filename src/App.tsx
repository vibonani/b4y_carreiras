import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  StepId,
  CandidateInfo,
  JobPosition,
  SessionState
} from './types';
import {
  BIG_FIVE_QUESTIONS,
  LIKERT_OPTIONS,
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
import { TestOverviewScreen } from './components/TestOverviewScreen';
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

// Set synchronously the instant a candidate finishes the last question,
// before the background save/complete calls even start — so a reload that
// interrupts those calls can still be recognized as "already finished"
// rather than resuming the candidate mid-test on the next load.
const COMPLETED_MARKER_PREFIX = 'b4y_completed_';

// How long the completion screen stays up, after the background save/complete
// calls are confirmed done, before auto-redirecting home.
const REDIRECT_DELAY_MS = 5000;

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
  const [checkingDashboardAccess, setCheckingDashboardAccess] = useState(false);

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

  // Any attempt to reach the management area goes through the server-side session check first.
  // Guarded by a ref (not state) so React 18 Strict Mode's double-invocation of state
  // updaters can't trigger the auth check twice in a row.
  const dashboardCheckInFlightRef = React.useRef(false);
  const requestDashboardAccess = async () => {
    if (dashboardCheckInFlightRef.current) return;
    dashboardCheckInFlightRef.current = true;
    setCheckingDashboardAccess(true);
    try {
      const authed = await AuthService.status();
      setIsAuthenticated(authed);
      if (authed) {
        handleViewChange('dashboard');
      } else {
        setShowLoginModal(true);
      }
    } finally {
      dashboardCheckInFlightRef.current = false;
      setCheckingDashboardAccess(false);
    }
  };

  const handleGuardedNavigate = (view: 'candidate' | 'dashboard') => {
    if (view === 'dashboard') {
      requestDashboardAccess();
    } else {
      handleViewChange(view);
    }
  };

  // Clicking the logo always takes you back to the very first screen. It also
  // forgets the local session pointer and candidate identity — otherwise the
  // header kept showing the previous candidate's name/vaga on the homepage,
  // and reloading the page would silently resume the abandoned test instead
  // of staying on the welcome screen. Nothing is actually lost: the session
  // is still saved server-side and resumes normally if they re-enter the
  // same e-mail on the identification screen.
  const handleLogoClick = () => {
    handleViewChange('candidate');
    setStep('welcome');
    setSessionId(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setCandidateInfo({ fullName: '', email: '', phone: '', jobPosition: '', termsAccepted: false });
    setDiscAnswers({});
    setFitAnswers({});
    setLogicAnswers({});
    setCurrentDiscIndex(0);
    setCurrentFitIndex(0);
    setCurrentLogicIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Retry any finished assessment that failed to reach the server last time
  // this browser was open (see AssessmentService.processAndSaveAssessment).
  useEffect(() => {
    AssessmentService.flushPendingResults();
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

      // The candidate already finished this session before whatever caused
      // this reload (see COMPLETED_MARKER_PREFIX) — show the completion
      // screen instead of resuming mid-test, and nudge the server-side
      // completion along in case it was interrupted too.
      const finishedLocally = localStorage.getItem(COMPLETED_MARKER_PREFIX + storedSessionId) === '1';
      if (finishedLocally) {
        localStorage.removeItem(COMPLETED_MARKER_PREFIX + storedSessionId);
        localStorage.removeItem(SESSION_STORAGE_KEY);
        AssessmentService.completeSession(storedSessionId);
      }

      const session = await AssessmentService.getSession(storedSessionId);

      if (finishedLocally) {
        // Still populate name/email/etc. for the completion screen, but
        // don't resume progress or leave a resumable session pointer behind
        // — applySessionState re-writes SESSION_STORAGE_KEY, so it has to be
        // cleared again after calling it.
        if (session) applySessionState(session);
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setStep('completed');
        setIsRehydrating(false);
        return;
      }

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

  // Secret keyboard shortcut for management (Ctrl + Shift + A or Alt + A).
  // Reads currentView from a ref (kept in sync below) instead of a setState
  // updater, since updater functions run side effects twice under Strict Mode.
  const finalizeInFlightRef = React.useRef(false);
  const currentViewRef = React.useRef(currentView);
  useEffect(() => {
    currentViewRef.current = currentView;
  }, [currentView]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isShortcut = (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a');
      if (!isShortcut) return;
      e.preventDefault();

      if (currentViewRef.current === 'candidate') {
        requestDashboardAccess();
      } else {
        handleViewChange('candidate');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Step 1: Start Welcome -> Overview -> Identification
  const handleStartWelcome = () => {
    setStep('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOverviewContinue = () => {
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
      phone: session.telefone || prev.phone,
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
  //
  // The DISC/Fit/Logic screens render entirely from local state (questions are
  // static), so there's no reason to block navigation on the Apps Script
  // round-trip. We optimistically assume the common case — a brand-new
  // session — and show the instructions right away; the real check runs in
  // the background and corrects course if it turns out to be wrong: a
  // returning candidate gets fast-forwarded to where they actually left off,
  // and an already-completed candidate gets pulled back to the block screen.
  const handleSubmitIdentification = (info: CandidateInfo) => {
    setCandidateInfo(info);
    setIdentificationBlocked(false);
    setShowInstructionsModal(true);

    AssessmentService.startOrResumeSession(info).then((result) => {
      if ('blocked' in result && result.blocked) {
        setShowInstructionsModal(false);
        setIdentificationBlocked(true);
        return;
      }

      const session = result as SessionState;
      applySessionState(session);

      if (!session.isNew) {
        // Turned out to be a resume, not a fresh start — jump to their real
        // progress instead of leaving them on the instructions/DISC Q1.
        setShowInstructionsModal(false);
        setStep(session.etapaAtual);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  const handleConfirmInstructions = () => {
    setShowInstructionsModal(false);
    setStep('disc');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Step 3: DISC Navigation
  const handleSelectDiscOption = (optionId: string) => {
    const qId = BIG_FIVE_QUESTIONS[currentDiscIndex].id;
    setDiscAnswers(prev => ({ ...prev, [qId]: optionId }));
    if (sessionId) AssessmentService.saveAnswer(sessionId, 'disc', qId, optionId);
  };

  const handleNextDisc = () => {
    if (currentDiscIndex < BIG_FIVE_QUESTIONS.length - 1) {
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
    resetLogicTimer(0);
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

  // Clears a logic question's persisted timer deadline so arriving at it
  // (forward or backward) always starts a fresh 2-minute countdown. Only a
  // same-question page reload should preserve the remaining time — without
  // this, going "Voltar" to an earlier question re-reads its old, likely
  // already-expired deadline and immediately snaps back forward.
  const resetLogicTimer = (questionIndex: number) => {
    const question = LOGIC_QUESTIONS[questionIndex];
    if (question) localStorage.removeItem(`b4y_logic_timer_${sessionId}_${question.id}`);
  };

  const handleSelectLogicOption = (optionId: string) => {
    const qId = LOGIC_QUESTIONS[currentLogicIndex].id;
    setLogicAnswers(prev => ({ ...prev, [qId]: optionId }));
    if (sessionId) AssessmentService.saveAnswer(sessionId, 'logic', qId, optionId);
  };

  const handleNextLogic = async () => {
    if (currentLogicIndex < LOGIC_QUESTIONS.length - 1) {
      const nextIndex = currentLogicIndex + 1;
      resetLogicTimer(nextIndex);
      setCurrentLogicIndex(nextIndex);
      if (sessionId) AssessmentService.saveProgress(sessionId, 'logic', nextIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Guard against submitting more than once for the same session — this can
      // otherwise fire twice (e.g. a manual click racing the timer's onTimeUp,
      // or a remount re-triggering an already-expired QuestionTimer deadline),
      // which would create duplicate "Concluído" records for the same person.
      if (finalizeInFlightRef.current) return;
      finalizeInFlightRef.current = true;

      // Marked synchronously, before any async work — so if the tab reloads
      // or crashes before the save below finishes, the rehydrate effect on
      // next load recognizes this session as already finished (see its
      // COMPLETED_MARKER_PREFIX check) instead of resuming mid-test.
      if (sessionId) localStorage.setItem(COMPLETED_MARKER_PREFIX + sessionId, '1');

      // The completion screen only needs the answers already sitting in local
      // state — nothing it renders depends on the server confirming the save.
      // Move on immediately and let the two persistence calls (local results
      // store + Apps Script session lock) finish in the background; waiting
      // on them here is what made the last question feel like it hung.
      setStep('completed');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      Promise.all([
        AssessmentService.processAndSaveAssessment(
          candidateInfo,
          discAnswers,
          fitAnswers,
          logicAnswers
        ),
        sessionId ? AssessmentService.completeSession(sessionId) : Promise.resolve(),
      ]).finally(() => {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        if (sessionId) localStorage.removeItem(COMPLETED_MARKER_PREFIX + sessionId);

        // Only safe to auto-redirect home now that the markers above are
        // cleared — doing this on a fixed timer instead (independent of the
        // save/complete calls above) raced a slow backend: if the redirect's
        // full page reload landed before this cleanup ran, the rehydrate
        // effect would still see COMPLETED_MARKER_PREFIX set and bounce the
        // candidate right back to this same completion screen.
        setTimeout(() => {
          window.location.href = '/';
        }, REDIRECT_DELAY_MS);
      });
    }
  };

  const handlePrevLogic = () => {
    if (currentLogicIndex > 0) {
      const prevIndex = currentLogicIndex - 1;
      resetLogicTimer(prevIndex);
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
      className="min-h-dvh bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900"
      style={{ backgroundColor: currentView === 'candidate' && step === 'welcome' ? '#e6f4f1' : undefined }}
    >
      
      {/* Universal Corporate Header */}
      <Header
        currentView={currentView}
        onNavigate={handleGuardedNavigate}
        onLogoClick={handleLogoClick}
        candidateName={candidateInfo.fullName}
        jobPosition={candidateInfo.jobPosition}
        showNav={step === 'welcome'}
      />

      {checkingDashboardAccess && !showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs">
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-lg text-sm font-medium text-slate-700">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verificando acesso...</span>
          </div>
        </div>
      )}

      {showLoginModal && (
        <AdminLogin onSuccess={handleLoginSuccess} onCancel={handleLoginCancel} />
      )}

      {showInstructionsModal && (
        <InstructionsModal onConfirm={handleConfirmInstructions} />
      )}

      {showDiscToFitTransition && (
        <StepTransitionModal
          completedLabel="Teste BIG 5"
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

              {/* TELA 1.5: AVISO / VISÃO GERAL DOS TESTES */}
              {step === 'overview' && (
                <motion.div
                  key="overview"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <TestOverviewScreen onContinue={handleOverviewContinue} />
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

              {/* TELA 3: BIG 5 */}
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
                    total={BIG_FIVE_QUESTIONS.length}
                    label={`${currentDiscIndex + 1} de ${BIG_FIVE_QUESTIONS.length}`}
                  />

                  {/* Question Card */}
                  <QuestionCard
                    questionNumber={currentDiscIndex + 1}
                    totalQuestions={BIG_FIVE_QUESTIONS.length}
                    prompt={BIG_FIVE_QUESTIONS[currentDiscIndex].prompt}
                    description="Marque o quanto esta frase combina com você."
                    options={LIKERT_OPTIONS}
                    selectedOptionId={discAnswers[BIG_FIVE_QUESTIONS[currentDiscIndex].id]}
                    onSelectOption={handleSelectDiscOption}
                  />

                  {/* Navigation Controls */}
                  <TestNavigation
                    onPrev={handlePrevDisc}
                    onNext={handleNextDisc}
                    isFirstQuestion={currentDiscIndex === 0}
                    isLastQuestion={currentDiscIndex === BIG_FIVE_QUESTIONS.length - 1}
                    isAnswerSelected={!!discAnswers[BIG_FIVE_QUESTIONS[currentDiscIndex].id]}
                    finishButtonText="Finalizar teste BIG 5"
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
                      storageKey={`b4y_logic_timer_${sessionId}_${LOGIC_QUESTIONS[currentLogicIndex].id}`}
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
                    hidePrev
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
                <a
                  href="https://wa.me/12991800450"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-600 transition-colors"
                >
                  Dev VB
                </a>
                <span>Ambiente seguro de seleção corporativa</span>
              </div>
            </footer>
          )}

        </main>
      )}

    </div>
  );
}
