export type ExerciseLevel = 'beginner' | 'intermediate' | 'expert';

export interface Exercise {
  id: string;
  name: string;
  level: ExerciseLevel;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  src?: 'fitbod';
  force?: string;
  mechanic?: string;
  category?: string;
  images?: string[];
}
