import React, { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';

interface QuestionTimerProps {
  duration: number;
  questionKey: string | number;
  onTimeUp: () => void;
}

export const QuestionTimer: React.FC<QuestionTimerProps> = ({ duration, questionKey, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const firedRef = useRef(false);

  // Reset the countdown whenever a new question is shown
  useEffect(() => {
    setSecondsLeft(duration);
    firedRef.current = false;
  }, [questionKey, duration]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!firedRef.current) {
        firedRef.current = true;
        onTimeUp();
      }
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, onTimeUp]);

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
