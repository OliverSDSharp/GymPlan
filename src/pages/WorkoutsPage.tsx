import { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { DaySelector } from '../components/workout/DaySelector';
import { ExerciseTable } from '../components/workout/ExerciseTable';
import { ExerciseDetailModal } from '../components/exercise/ExerciseDetailModal';
import { LiveWorkoutPlayer } from '../components/workout/LiveWorkoutPlayer';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useAppStore } from '../context/AppContext';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import { phases } from '../data/phases';
import { EXERCISE_DB } from '../data/exercises';
import { phaseColors } from '../utils/colors';
import { generateWeeklyVariation, getWeekNumber } from '../utils/workout-variation';
import { Target, Info, Play } from 'lucide-react';
import type { Exercise } from '../types';

export function WorkoutsPage() {
  const activePhase = useAppStore((s) => s.activePhase);
  const activeDay = useAppStore((s) => s.activeDay);
  const swappedDays = useAppStore((s) => s.swappedDays);
  const setActiveDay = useAppStore((s) => s.setActiveDay);
  const swapExercise = useAppStore((s) => s.swapExercise);
  const resetExercise = useAppStore((s) => s.resetExercise);
  const phaseStartDate = useAppStore((s) => s.phaseStartDate);

  const [exerciseModal, setExerciseModal] = useState<Exercise | null>(null);
  const [modalExerciseIndex, setModalExerciseIndex] = useState<number>(-1);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  const { startSession, endSession, cancelSession } = useWorkoutSession();

  const phase = phases[activePhase] ?? phases[0];
  const day = phase.days[activeDay] ?? phase.days[0];
  const color = phaseColors[activePhase] ?? phaseColors[0];

  // Weekly variation: compute the current week number from the phase start date
  const weekNumber = phaseStartDate ? getWeekNumber(phaseStartDate) : 1;

  // Build the effective exercise list: apply weekly variation, then manual swaps
  const exercises = useMemo(() => {
    // Step 1: Apply weekly variation
    const varied = generateWeeklyVariation(day.exercises, weekNumber, EXERCISE_DB);

    // Step 2: Apply manual swaps on top
    return varied.map((ex, idx) => {
      const key = `${phase.id}_${activeDay}_${idx}`;
      const swap = swappedDays[key];
      if (swap && typeof swap === 'object' && 'name' in swap) {
        return { ...ex, ...swap } as typeof ex;
      }
      return ex;
    });
  }, [day.exercises, swappedDays, phase.id, activeDay, weekNumber]);

  // Track which exercise indices are swapped
  const swappedIndices = useMemo(() => {
    const indices: number[] = [];
    day.exercises.forEach((_, idx) => {
      const key = `${phase.id}_${activeDay}_${idx}`;
      if (swappedDays[key]) indices.push(idx);
    });
    return indices;
  }, [day.exercises, swappedDays, phase.id, activeDay]);

  function handleExerciseClick(ex: { name: string; dbId: string | null }, index: number) {
    // Find the exercise in the database
    const found = ex.dbId
      ? EXERCISE_DB.find((e) => e.id === ex.dbId)
      : EXERCISE_DB.find(
          (e) => e.name.toLowerCase() === ex.name.toLowerCase(),
        );
    if (found) {
      setExerciseModal(found);
      setModalExerciseIndex(index);
    }
  }

  function handleSwap(alt: Exercise) {
    if (modalExerciseIndex < 0) return;
    const key = `${phase.id}_${activeDay}_${modalExerciseIndex}`;
    swapExercise(key, {
      name: alt.name,
      dbId: alt.id,
      equip: alt.equipment,
      muscle: alt.primaryMuscles[0] ?? null,
    });
    setExerciseModal(null);
    setModalExerciseIndex(-1);
  }

  function handleStartWorkout() {
    startSession(phase.id, day.label, exercises.map(ex => ({
      name: ex.name,
      dbId: ex.dbId,
      sets: Array.from({ length: ex.sets ?? 3 }, () => ({
        weight: 0,
        reps: 0,
        completed: false,
      })),
      notes: '',
    })));
    setIsWorkoutActive(true);
  }

  function handleFinishWorkout() {
    endSession();
    setIsWorkoutActive(false);
  }

  function handleCancelWorkout() {
    cancelSession();
    setIsWorkoutActive(false);
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <Header
        title={phase.title}
        subtitle={phase.months}
        phaseColor="text-text-primary"
        rightAction={
          <Badge size="md" color="bg-bg-tertiary text-text-secondary">
            {phase.label}
          </Badge>
        }
      />

      {/* Day selector */}
      <div className="mb-3 px-4">
        <DaySelector
          days={phase.days}
          activeDay={activeDay}
          onChange={setActiveDay}
          phaseColor={color}
        />
      </div>

      {/* Phase info card */}
      <div
        className="mx-4 mb-4 rounded-xl border p-4 space-y-3"
        style={{
          borderColor: `${color}40`,
          backgroundColor: `${color}08`,
        }}
      >
        <div className="flex items-start gap-2">
          <Info size={16} className="shrink-0 mt-0.5 text-text-muted" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-text-primary">{phase.goal}</p>
            <p className="text-xs text-text-secondary">{phase.split}</p>
          </div>
        </div>

        {phase.targets.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {phase.targets.map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-bg-secondary text-text-secondary border border-border-primary"
              >
                <Target size={10} className="shrink-0" />
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Day header */}
      <div className="px-4 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-text-primary">
            {day.label}
          </h3>
          <Badge size="sm" color="text-white" style={{ backgroundColor: color }}>
            Week {weekNumber}
          </Badge>
        </div>
        <Badge size="sm" color="text-white">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full mr-1"
            style={{ backgroundColor: color }}
          />
          {day.tag}
        </Badge>
      </div>

      {/* Start Workout Button */}
      <div className="px-4 mb-4">
        <Button
          fullWidth
          size="lg"
          icon={<Play size={18} />}
          onClick={handleStartWorkout}
          style={{ backgroundColor: color }}
          className="text-white font-bold"
        >
          Start Workout
        </Button>
      </div>

      {/* Exercise table */}
      <div className="px-4">
        <ExerciseTable
          exercises={exercises}
          phaseColor={color}
          onExerciseClick={(ex) => {
            const idx = exercises.findIndex((e) => e.name === ex.name);
            handleExerciseClick(ex, idx >= 0 ? idx : 0);
          }}
          swappedIndices={swappedIndices}
        />
      </div>

      {/* Exercise detail modal */}
      <ExerciseDetailModal
        exercise={exerciseModal}
        onClose={() => {
          setExerciseModal(null);
          setModalExerciseIndex(-1);
        }}
        phaseColor={color}
        onSwap={handleSwap}
        isSwapped={modalExerciseIndex >= 0 && swappedIndices.includes(modalExerciseIndex)}
        onReset={() => {
          if (modalExerciseIndex >= 0) {
            const key = `${phase.id}_${activeDay}_${modalExerciseIndex}`;
            resetExercise(key);
          }
        }}
      />

      {/* Live Workout Player overlay */}
      {isWorkoutActive && (
        <div className="fixed inset-0 z-50">
          <LiveWorkoutPlayer
            workout={{ label: day.label, exercises }}
            onExit={handleFinishWorkout}
            phaseColor={color}
          />
        </div>
      )}
    </div>
  );
}
