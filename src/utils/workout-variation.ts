/**
 * Weekly workout variation generator.
 * Rotates exercises for the same muscle group using the exercise database.
 * Week 1 = original, subsequent weeks cycle through alternatives.
 */

import type { WorkoutExercise, Exercise } from '../types';

/**
 * Calculate the current week number from a start date.
 */
export function getWeekNumber(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.floor(diffDays / 7) + 1);
}

/**
 * Find alternative exercises for a given exercise from the database.
 * Matches by primary muscle group and filters out the original.
 */
function findAlternatives(
  exercise: WorkoutExercise,
  exerciseDB: Exercise[],
): Exercise[] {
  const muscle = exercise.muscle?.toLowerCase();
  if (!muscle) return [];

  return exerciseDB.filter((e) => {
    // Skip the original exercise
    if (exercise.dbId && e.id === exercise.dbId) return false;
    if (e.name.toLowerCase() === exercise.name.toLowerCase()) return false;

    // Must target the same primary muscle
    const matchesMuscle = e.primaryMuscles.some(
      (m) => m.toLowerCase() === muscle,
    );
    if (!matchesMuscle) return false;

    // Prefer same or compatible equipment level
    // Map the equip emoji strings to equipment categories
    const equipMap: Record<string, string[]> = {
      barbell: ['barbell'],
      dumbbell: ['dumbbell'],
      'body only': ['body only', 'bodyweight'],
      cable: ['cable'],
      machine: ['machine'],
      kettlebell: ['kettlebells', 'kettlebell'],
      bands: ['bands', 'band'],
      'e-z curl bar': ['e-z curl bar'],
      'exercise ball': ['exercise ball'],
      'foam roll': ['foam roll'],
      other: ['other'],
    };

    // Try to match equipment — if we can't determine, allow it
    const exEquipLower = exercise.equip.toLowerCase();
    const dbEquipLower = e.equipment.toLowerCase();

    for (const [, aliases] of Object.entries(equipMap)) {
      const exMatches = aliases.some((a) => exEquipLower.includes(a));
      const dbMatches = aliases.some((a) => dbEquipLower.includes(a));
      if (exMatches && !dbMatches) return false;
      if (exMatches && dbMatches) return true;
    }

    return true;
  });
}

/**
 * Generate a weekly variation of exercises.
 * @param baseExercises - The original exercises for this day
 * @param weekNumber - Current week number (1-based)
 * @param exerciseDB - Full exercise database
 * @returns Modified exercises with rotations applied
 */
export function generateWeeklyVariation(
  baseExercises: WorkoutExercise[],
  weekNumber: number,
  exerciseDB: Exercise[],
): WorkoutExercise[] {
  // Week 1 = original exercises
  if (weekNumber <= 1) return baseExercises;

  return baseExercises.map((exercise) => {
    const alternatives = findAlternatives(exercise, exerciseDB);

    // No alternatives? Keep original
    if (alternatives.length === 0) return exercise;

    // Deterministic rotation based on week number
    // (weekNumber - 2) because week 1 = original, week 2 = first alternative
    const altIndex = (weekNumber - 2) % alternatives.length;
    const alt = alternatives[altIndex];

    return {
      ...exercise,
      name: alt.name,
      dbId: alt.id,
      muscle: alt.primaryMuscles[0] ?? exercise.muscle,
      equip: mapEquipment(alt.equipment),
      cues: alt.instructions[0] ?? exercise.cues,
    };
  });
}

/**
 * Map database equipment string to display format with emoji.
 */
function mapEquipment(equipment: string): string {
  const map: Record<string, string> = {
    barbell: '\uD83C\uDFCB\uFE0F Barbell',
    dumbbell: '\uD83C\uDFCB\uFE0F DB',
    'body only': 'BW',
    cable: '\uD83D\uDD17 Cable',
    machine: '\u2699\uFE0F Machine',
    kettlebells: '\uD83E\uDEA8 KB',
    bands: '\uD83C\uDF80 Bands',
    'e-z curl bar': '\uD83C\uDFCB\uFE0F EZ-Bar',
    'exercise ball': '\u26BD Ball',
    'foam roll': 'Foam Roll',
    other: 'Other',
  };

  const lower = equipment.toLowerCase();
  return map[lower] ?? equipment;
}
