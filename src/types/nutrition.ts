export interface Macros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionTiming {
  time: string;
  tip: string;
}

export interface PhaseNutrition {
  phase: number;
  title: string;
  approach: string;
  description: string;
  cycling: boolean;
  trainDay: Macros;
  restDay?: Macros;
  refeedDay?: Macros;
  rationale: string;
  timing: NutritionTiming[];
  keyRules: string[];
  warnings: string[];
}

export interface Recipe {
  id: string;
  category: string;
  name: string;
  emoji: string;
  time: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  prepFriendly: boolean;
  dayType: string;
  phases: number[];
  cook: string;
  aiGenerated?: boolean;
}

export interface MealSlot {
  label: string;
  time: string;
  recipeId: string;
}

export interface MealPlan {
  phaseId: number;
  dayType: string;
  title: string;
  meals: MealSlot[];
}

export interface Milestone {
  month: number;
  text: string;
}
