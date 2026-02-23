export interface WorkoutExercise {
  name: string;
  /** Number of sets. Null for AMRAP, omitted for EMOM. */
  sets?: number | null;
  reps: string;
  /** Rest between sets. Omitted for EMOM exercises. */
  rest?: string;
  cues: string;
  equip: string;
  muscle: string | null;
  dbId: string | null;
  /** Circuit-specific: station number within the circuit */
  circuitStation?: number;
  /** Superset/Giant set: group label (e.g. "A", "B", "C") */
  supersetGroup?: string;
  /** Superset/Giant set: role within the group (e.g. "A", "B" or "1", "2", "3") */
  supersetRole?: string;
  /** EMOM-specific: which minute this exercise occupies */
  emomMinute?: number;
}

export interface PhaseDay {
  day: string;
  label: string;
  tag: string;
  exercises: WorkoutExercise[];
}

export interface Phase {
  id: number;
  label: string;
  title: string;
  months: string;
  goal: string;
  color: string;
  split: string;
  targets: string[];
  days: PhaseDay[];
}

export interface WorkoutMode {
  id: string;
  label: string;
  icon: string;
  color: string;
  desc: string;
}

export interface LibraryWorkout {
  id: string;
  label: string;
  category: string;
  mode: WorkoutMode;
  muscles: string[];
  duration: number;
  difficulty: string;
  phase: number[];
  exercises: WorkoutExercise[];
  /** Optional description for the workout */
  description?: string;
  /** Circuit-specific: number of rounds */
  rounds?: number;
  /** Circuit-specific: rest between rounds in seconds */
  roundRest?: number;
  /** EMOM-specific: total minutes */
  totalMinutes?: number;
  /** AMRAP-specific: time limit in minutes */
  timeLimit?: number;
}
