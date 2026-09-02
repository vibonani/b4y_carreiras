import React, { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';

interface QuestionTimerProps {
  duration: number;
  questionKey: string | number;
  /** Unique per session+question — persists the deadline in localStorage so
   *  reloading the page (or navigating back and forth) cannot reset the clock. */
  storageKey: string;
  onTimeUp: () => void;
}

function readOrCreateDeadline(storageKey: string, duration: number): number {
  const stored = localStorage.getItem(storageKey);
  const parsed = stored ? parseInt(stored, 10) : NaN;
  if (!Number.isNaN(parsed)) return parsed;

  const deadline = Date.now() + duration * 1000;
  localStorage.setItem(storageKey, String(deadline));
  return deadline;
}

function secondsUntil(deadline: number): number {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

// Whether onTimeUp has already fired for this question, persisted so a
// remount (page reload, Strict Mode's synthetic remount, an HMR update, a
// parent re-render) on an already-expired deadline can't fire it again.
function hasAlreadyFired(storageKey: string): boolean {
  return localStorage.getItem(`${storageKey}_fired`) === '1';
}
function markFired(storageKey: string): void {
  localStorage.setItem(`${storageKey}_fired`, '1');
}

export const QuestionTimer: React.FC<QuestionTimerProps> = ({ duration, questionKey, storageKey, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(() => secondsUntil(readOrCreateDeadline(storageKey, duration)));
  const firedRef = useRef(hasAlreadyFired(storageKey));

  // Recompute from the persisted deadline whenever a new question is shown
  useEffect(() => {
    setSecondsLeft(secondsUntil(readOrCreateDeadline(storageKey, duration)));
    firedRef.current = hasAlreadyFired(storageKey);
  }, [questionKey, duration, storageKey]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!firedRef.current) {
        firedRef.current = true;
        markFired(storageKey);
        onTimeUp();
      }
      return;
    }
    const timer = setTimeout(() => {
      setSecondsLeft(secondsUntil(readOrCreateDeadline(storageKey, duration)));
    }, 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, onTimeUp, storageKey, duration]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft <= 30;

  return (
    <div
      id="logic-question-timer"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border tabular-nums transition-colors ${
        isUrgent
          ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
          : 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
      title="Tempo restante para esta questão"
    >
      <Clock className="w-4 h-4" />
      <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
    </div>
  );
};
