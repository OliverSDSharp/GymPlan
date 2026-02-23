import { useState, useCallback, useRef, useEffect } from 'react';
import type { WorkoutSession, WorkoutSessionExercise } from '@/types';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import { generateId } from '@/utils/helpers';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ActiveSet {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface ActiveExercise {
  name: string;
  dbId: string | null;
  sets: ActiveSet[];
  notes: string;
}

interface SessionDraft {
  id: string;
  phaseId: number;
  dayLabel: string;
  startedAt: number; // Date.now()
  exercises: ActiveExercise[];
}

export interface UseWorkoutSessionReturn {
  /** Whether a workout session is currently in progress */
  isActive: boolean;
  /** Start a new workout session */
  startSession: (phaseId: number, dayLabel: string, exercises?: ActiveExercise[]) => void;
  /** End the current session, saving it to history */
  endSession: () => void;
  /** Discard the current session without saving */
  cancelSession: () => void;
  /** Log a completed set */
  logSet: (exerciseIdx: number, setIdx: number, weight: number, reps: number) => void;
  /** Toggle a set's completed flag */
  toggleSet: (exerciseIdx: number, setIdx: number) => void;
  /** Add a note to an exercise */
  addNote: (exerciseIdx: number, note: string) => void;
  /** Add an exercise to the current session */
  addExercise: (exercise: ActiveExercise) => void;
  /** Current session data (null if not active) */
  session: SessionDraft | null;
  /** All previously completed sessions */
  history: WorkoutSession[];
}

const STORAGE_KEY = 'workout_sessions';
const DRAFT_KEY = 'workout_session_draft';

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useWorkoutSession(): UseWorkoutSessionReturn {
  const [session, setSession] = useState<SessionDraft | null>(() => {
    // Restore an in-progress session if the app was closed mid-workout
    return getStorageItem<SessionDraft | null>(DRAFT_KEY, null);
  });

  const [history, setHistory] = useState<WorkoutSession[]>(() =>
    getStorageItem<WorkoutSession[]>(STORAGE_KEY, []),
  );

  // Persist draft whenever it changes
  const sessionRef = useRef(session);
  useEffect(() => {
    sessionRef.current = session;
    if (session) {
      setStorageItem(DRAFT_KEY, session);
    } else {
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
    }
  }, [session]);

  // Persist history whenever it changes
  useEffect(() => {
    setStorageItem(STORAGE_KEY, history);
  }, [history]);

  const startSession = useCallback(
    (phaseId: number, dayLabel: string, exercises: ActiveExercise[] = []) => {
      const draft: SessionDraft = {
        id: generateId(),
        phaseId,
        dayLabel,
        startedAt: Date.now(),
        exercises,
      };
      setSession(draft);
    },
    [],
  );

  const endSession = useCallback(() => {
    const current = sessionRef.current;
    if (!current) return;

    const durationMs = Date.now() - current.startedAt;
    const durationMin = Math.round(durationMs / 60_000);

    // Convert ActiveExercise[] to WorkoutSessionExercise[]
    const sessionExercises: WorkoutSessionExercise[] = current.exercises.map(
      (ex) => ({
        name: ex.name,
        dbId: ex.dbId,
        sets: ex.sets.map((s, i) => ({
          setNumber: i + 1,
          weight: s.weight,
          reps: s.reps,
          completed: s.completed,
        })),
      }),
    );

    const completed: WorkoutSession = {
      id: current.id,
      date: new Date(current.startedAt).toISOString().slice(0, 10),
      phaseId: current.phaseId,
      dayLabel: current.dayLabel,
      exercises: sessionExercises,
      duration: durationMin,
      notes: current.exercises
        .filter((e) => e.notes)
        .map((e) => `${e.name}: ${e.notes}`)
        .join('; ') || undefined,
    };

    setHistory((prev) => [...prev, completed]);
    setSession(null);
  }, []);

  const cancelSession = useCallback(() => {
    setSession(null);
  }, []);

  const logSet = useCallback(
    (exerciseIdx: number, setIdx: number, weight: number, reps: number) => {
      setSession((prev) => {
        if (!prev) return prev;
        const exercises = [...prev.exercises];
        const ex = { ...exercises[exerciseIdx] };
        const sets = [...ex.sets];
        sets[setIdx] = { weight, reps, completed: true };
        ex.sets = sets;
        exercises[exerciseIdx] = ex;
        return { ...prev, exercises };
      });
    },
    [],
  );

  const toggleSet = useCallback(
    (exerciseIdx: number, setIdx: number) => {
      setSession((prev) => {
        if (!prev) return prev;
        const exercises = [...prev.exercises];
        const ex = { ...exercises[exerciseIdx] };
        const sets = [...ex.sets];
        sets[setIdx] = { ...sets[setIdx], completed: !sets[setIdx].completed };
        ex.sets = sets;
        exercises[exerciseIdx] = ex;
        return { ...prev, exercises };
      });
    },
    [],
  );

  const addNote = useCallback(
    (exerciseIdx: number, note: string) => {
      setSession((prev) => {
        if (!prev) return prev;
        const exercises = [...prev.exercises];
        exercises[exerciseIdx] = { ...exercises[exerciseIdx], notes: note };
        return { ...prev, exercises };
      });
    },
    [],
  );

  const addExercise = useCallback((exercise: ActiveExercise) => {
    setSession((prev) => {
      if (!prev) return prev;
      return { ...prev, exercises: [...prev.exercises, exercise] };
    });
  }, []);

  return {
    isActive: session !== null,
    startSession,
    endSession,
    cancelSession,
    logSet,
    toggleSet,
    addNote,
    addExercise,
    session,
    history,
  };
}
