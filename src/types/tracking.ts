export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  note?: string;
}

export interface IntakeEntry {
  id: string;
  time: string;
  name: string;
  emoji?: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  recipeId?: string;
  portion?: number;
}

export interface WorkoutSessionExercise {
  name: string;
  dbId: string | null;
  sets: {
    setNumber: number;
    weight: number;
    reps: number;
    completed: boolean;
  }[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  phaseId: number;
  dayLabel: string;
  exercises: WorkoutSessionExercise[];
  duration: number;
  notes?: string;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}
