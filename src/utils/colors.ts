/**
 * Centralized color constants extracted from the monolith.
 */

// ---------------------------------------------------------------------------
// Phase colors (one per training phase, ordered 1-4)
// ---------------------------------------------------------------------------

export const phaseColors: readonly string[] = [
  '#F97316', // Phase 1 - Foundation (orange)
  '#8B5CF6', // Phase 2 - Hypertrophy (purple)
  '#EF4444', // Phase 3 - Strength + Cut (red)
  '#F59E0B', // Phase 4 - Recomposition (amber)
] as const;

// ---------------------------------------------------------------------------
// Day tag colors  (monolith line 887)
// ---------------------------------------------------------------------------

export const tagColors: Record<string, string> = {
  Strength: '#F97316',
  Cardio:   '#3B82F6',
  Upper:    '#8B5CF6',
  Lower:    '#10B981',
  Push:     '#EF4444',
  Pull:     '#3B82F6',
  Legs:     '#10B981',
  Full:     '#F97316',
};

// ---------------------------------------------------------------------------
// Workout mode / category colors  (monolith line 1573)
// ---------------------------------------------------------------------------

export const modeColors: Record<string, string> = {
  'Circuit':       '#3B82F6',
  'EMOM':          '#F59E0B',
  'AMRAP':         '#8B5CF6',
  'Supersets':     '#EC4899',
  '5x5 Strength':  '#EF4444',
  'Hypertrophy':   '#14B8A6',
  'Deload':        '#64748B',
  'Cardio':        '#10B981',
  'PPL Split':     '#F97316',
  'Full Body':     '#22D3EE',
  'Upper/Lower':   '#A78BFA',
};

// ---------------------------------------------------------------------------
// Muscle group colors (for exercise cards, body maps, etc.)
// ---------------------------------------------------------------------------

export const muscleColors: Record<string, string> = {
  chest:        '#EF4444',
  'middle back':'#3B82F6',
  lats:         '#2563EB',
  'lower back': '#6366F1',
  shoulders:    '#F59E0B',
  biceps:       '#8B5CF6',
  triceps:      '#A855F7',
  forearms:     '#7C3AED',
  quadriceps:   '#10B981',
  hamstrings:   '#059669',
  glutes:       '#14B8A6',
  calves:       '#0D9488',
  abdominals:   '#F97316',
  obliques:     '#FB923C',
  traps:        '#FBBF24',
};

// ---------------------------------------------------------------------------
// Macro colors (for pie charts, bars, etc.)
// ---------------------------------------------------------------------------

export const macroColors = {
  protein: '#3B82F6',
  carbs:   '#F97316',
  fat:     '#F59E0B',
} as const;

// ---------------------------------------------------------------------------
// Difficulty colors
// ---------------------------------------------------------------------------

export const difficultyColors: Record<string, string> = {
  beginner:     '#10B981',
  intermediate: '#F59E0B',
  advanced:     '#EF4444',
  expert:       '#EF4444',
};
