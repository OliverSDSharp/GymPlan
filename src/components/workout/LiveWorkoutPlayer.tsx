import { useState, useMemo } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { parseRest, fmtTime } from '../../utils/helpers';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Timer,
  Pause,
  Play,
  CheckCircle2,
} from 'lucide-react';

interface WorkoutExercise {
  name: string;
  sets?: number | null;
  reps: string;
  rest?: string;
  cues: string;
  equip: string;
  muscle: string | null;
  dbId: string | null;
}

interface LiveWorkoutPlayerProps {
  workout: {
    label: string;
    exercises: WorkoutExercise[];
  };
  onExit: () => void;
  phaseColor?: string;
}

const REST_PRESETS = [30, 45, 60, 90, 120] as const;

export function LiveWorkoutPlayer({
  workout,
  onExit,
  phaseColor = '#3B82F6',
}: LiveWorkoutPlayerProps) {
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set(),
  );

  const { seconds, isRunning, start, pause, resume, stop } = useTimer();

  const exercises = workout.exercises;
  const totalSteps = exercises.length;
  const current = exercises[step];
  const isLastStep = step === totalSteps - 1;

  const progress = useMemo(
    () => ((step + 1) / totalSteps) * 100,
    [step, totalSteps],
  );

  function handleNext() {
    stop();
    setCompletedSteps((prev) => new Set(prev).add(step));
    if (isLastStep) {
      onExit();
    } else {
      setStep((s) => s + 1);
    }
  }

  function handlePrev() {
    stop();
    if (step > 0) setStep((s) => s - 1);
  }

  function handleStartRest(duration: number) {
    start(duration);
  }

  if (!current) return null;

  const restSeconds = parseRest(current.rest);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Top bar */}
      <div className="shrink-0 px-4 pt-4 pb-2 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-sm uppercase tracking-wide text-text-primary truncate mr-3">
            {workout.label}
          </h2>
          <button
            type="button"
            onClick={onExit}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: phaseColor }}
          />
        </div>
        <p className="text-[10px] text-text-muted text-center">
          Exercise {step + 1} of {totalSteps}
        </p>
      </div>

      {/* Main card */}
      <div className="flex-1 flex flex-col px-4 py-4">
        <div className="flex-1 flex flex-col items-center justify-center bg-bg-secondary border border-border-primary rounded-xl p-6 space-y-4">
          {/* Exercise name */}
          <h1 className="font-heading text-2xl font-black text-text-primary text-center leading-tight">
            {current.name}
          </h1>

          {/* Equipment */}
          <Badge size="md" variant="outline">
            {current.equip}
          </Badge>

          {/* Sets / Reps / Rest */}
          <div className="flex items-center gap-6 mt-2">
            {current.sets != null && (
              <div className="text-center">
                <p className="font-mono text-3xl font-bold text-text-primary">
                  {current.sets}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-text-muted">
                  Sets
                </p>
              </div>
            )}
            <div className="text-center">
              <p className="font-mono text-3xl font-bold text-text-primary">
                {current.reps}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-text-muted">
                Reps
              </p>
            </div>
            {current.rest && (
              <div className="text-center">
                <p className="font-mono text-3xl font-bold text-text-muted">
                  {current.rest}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-text-muted">
                  Rest
                </p>
              </div>
            )}
          </div>

          {/* Cue text */}
          {current.cues && (
            <p className="text-sm text-text-secondary text-center italic max-w-md">
              {current.cues}
            </p>
          )}

          {/* Timer section */}
          <div className="w-full mt-4 pt-4 border-t border-border-primary">
            {isRunning || seconds > 0 ? (
              /* Timer running / paused */
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <Timer size={18} className="text-text-muted" />
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
                    Rest Timer
                  </span>
                </div>
                <p
                  className={[
                    'font-mono text-4xl font-bold transition-colors',
                    seconds <= 5 && seconds > 0
                      ? 'text-red-500'
                      : 'text-text-primary',
                  ].join(' ')}
                >
                  {fmtTime(seconds)}
                </p>
                <div className="flex gap-2">
                  {isRunning ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Pause size={14} />}
                      onClick={pause}
                    >
                      Pause
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Play size={14} />}
                      onClick={resume}
                    >
                      Resume
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={stop}>
                    Skip
                  </Button>
                </div>
              </div>
            ) : (
              /* Rest presets */
              <div className="flex flex-col items-center gap-3">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
                  Start Rest Timer
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {REST_PRESETS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleStartRest(t)}
                      className="px-3 py-1.5 rounded-lg bg-bg-tertiary text-text-secondary text-xs font-mono font-medium hover:bg-bg-tertiary/80 hover:text-text-primary transition-colors border border-border-primary"
                    >
                      {fmtTime(t)}
                    </button>
                  ))}
                  {/* Auto-fill from exercise rest */}
                  {restSeconds > 0 &&
                    !REST_PRESETS.includes(restSeconds as (typeof REST_PRESETS)[number]) && (
                      <button
                        type="button"
                        onClick={() => handleStartRest(restSeconds)}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors border-2 text-white"
                        style={{
                          borderColor: phaseColor,
                          backgroundColor: `${phaseColor}25`,
                        }}
                      >
                        {fmtTime(restSeconds)}
                      </button>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex gap-3 mt-4">
          <Button
            variant="secondary"
            size="lg"
            icon={<ChevronLeft size={18} />}
            onClick={handlePrev}
            disabled={step === 0}
            className="flex-1"
          >
            Prev
          </Button>

          <Button
            variant="primary"
            size="lg"
            icon={
              isLastStep ? undefined : <ChevronRight size={18} />
            }
            onClick={handleNext}
            className="flex-1"
            style={
              isLastStep
                ? { backgroundColor: '#10B981' }
                : { backgroundColor: phaseColor }
            }
          >
            {isLastStep ? 'FINISH WORKOUT \u{1F3C1}' : 'Next'}
          </Button>
        </div>
      </div>

      {/* Exercise overview list */}
      <div className="shrink-0 border-t border-border-primary px-4 py-3 max-h-48 overflow-y-auto">
        <h4 className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-2">
          Exercises
        </h4>
        <div className="space-y-1">
          {exercises.map((ex, i) => {
            const isCompleted = completedSteps.has(i);
            const isCurrent = i === step;

            return (
              <button
                key={`${ex.name}-${i}`}
                type="button"
                onClick={() => {
                  stop();
                  setStep(i);
                }}
                className={[
                  'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors text-left',
                  isCurrent
                    ? 'bg-bg-tertiary text-text-primary'
                    : 'text-text-muted hover:text-text-secondary hover:bg-bg-tertiary/50',
                ].join(' ')}
              >
                <span className="shrink-0 w-4 text-center">
                  {isCompleted ? (
                    <CheckCircle2 size={12} className="text-emerald-500" />
                  ) : isCurrent ? (
                    <span
                      className="inline-block text-[10px] font-bold"
                      style={{ color: phaseColor }}
                    >
                      {'\u25B6'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-text-muted">
                      {i + 1}
                    </span>
                  )}
                </span>
                <span
                  className={[
                    'truncate',
                    isCompleted ? 'line-through opacity-50' : '',
                  ].join(' ')}
                >
                  {ex.name}
                </span>
                {ex.sets != null && (
                  <span className="ml-auto shrink-0 font-mono text-[10px] opacity-50">
                    {ex.sets}&times;{ex.reps}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
