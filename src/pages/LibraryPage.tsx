import { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { SearchInput } from '../components/common/SearchInput';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { WorkoutCard } from '../components/workout/WorkoutCard';
import { WorkoutDetailModal } from '../components/workout/WorkoutDetailModal';
import { LiveWorkoutPlayer } from '../components/workout/LiveWorkoutPlayer';
import { ExerciseDetailModal } from '../components/exercise/ExerciseDetailModal';
import { useAppStore } from '../context/AppContext';
import { phaseColors } from '../utils/colors';
import { muscleColors, difficultyColors } from '../utils/colors';
import { WORKOUT_LIBRARY } from '../data/workouts';
import { EXERCISE_DB } from '../data/exercises';
import { BookOpen, Dumbbell, Search } from 'lucide-react';
import type { LibraryWorkout } from '../types';
import type { Exercise } from '../types/exercise';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WORKOUT_CATEGORIES = ['All', 'Strength', 'Hypertrophy', 'Circuit', 'EMOM', 'AMRAP', 'Cardio', 'Deload'];

const MUSCLE_GROUPS = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Legs',
  'Arms',
  'Core',
] as const;

/** Map display labels → DB primary muscle values */
const muscleGroupMap: Record<string, string[]> = {
  Chest: ['chest'],
  Back: ['middle back', 'lats', 'lower back'],
  Shoulders: ['shoulders', 'traps'],
  Legs: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
  Arms: ['biceps', 'triceps', 'forearms'],
  Core: ['abdominals', 'obliques'],
};

// ---------------------------------------------------------------------------
// Equipment emoji helper
// ---------------------------------------------------------------------------

function equipEmoji(equip: string): string {
  const eq = equip.toLowerCase();
  if (eq.includes('barbell')) return '🏋️';
  if (eq.includes('dumbbell')) return '🏋️';
  if (eq.includes('cable')) return '🔗';
  if (eq.includes('machine')) return '⚙️';
  if (eq.includes('body') || eq === 'body only') return '🤸';
  if (eq.includes('kettlebell')) return '🪨';
  if (eq.includes('band')) return '🎀';
  if (eq.includes('medicine ball')) return '🏐';
  if (eq.includes('foam roll')) return '🧘';
  if (eq.includes('exercise ball')) return '🏐';
  return '🔧';
}

// ---------------------------------------------------------------------------
// Exercise Card sub-component
// ---------------------------------------------------------------------------

function ExerciseCard({
  exercise,
  onClick,
  phaseColor,
}: {
  exercise: Exercise;
  onClick: () => void;
  phaseColor: string;
}) {
  const levelColor = difficultyColors[exercise.level] ?? difficultyColors.intermediate;
  const primaryMuscle = exercise.primaryMuscles[0] ?? '';
  const muscleColor = muscleColors[primaryMuscle] ?? '#6B7280';

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-bg-secondary rounded-xl border border-border-primary p-3 hover:border-text-muted transition-colors active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        {/* Equipment icon */}
        <div className="shrink-0 w-9 h-9 rounded-lg bg-bg-tertiary flex items-center justify-center text-lg">
          {equipEmoji(exercise.equipment)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Name */}
          <p className="text-sm font-medium text-text-primary truncate">
            {exercise.name}
          </p>

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Primary muscle badge */}
            {primaryMuscle && (
              <Badge size="sm" style={{ backgroundColor: `${muscleColor}20`, color: muscleColor }}>
                {primaryMuscle}
              </Badge>
            )}

            {/* Equipment */}
            <Badge size="sm" color="bg-bg-tertiary text-text-muted">
              {exercise.equipment}
            </Badge>

            {/* Level dot + label */}
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-text-muted">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: levelColor }}
              />
              {exercise.level}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Library Page
// ---------------------------------------------------------------------------

export function LibraryPage() {
  const activePhase = useAppStore((s) => s.activePhase);
  const color = phaseColors[activePhase] ?? phaseColors[0];

  // Tab state
  const [activeTab, setActiveTab] = useState<'workouts' | 'exercises'>('workouts');

  // Workout search/filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [activeWorkout, setActiveWorkout] = useState<LibraryWorkout | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<LibraryWorkout | null>(null);

  // Exercise search/filter state
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // ---------------------------------------------------------------------------
  // Filtered data
  // ---------------------------------------------------------------------------

  const filteredWorkouts = useMemo(() => {
    return WORKOUT_LIBRARY.filter((w) => {
      const matchesSearch =
        !search ||
        w.label?.toLowerCase().includes(search.toLowerCase()) ||
        w.description?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === 'All' || w.category === category || w.mode?.label === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const filteredExercises = useMemo(() => {
    const q = exerciseSearch.toLowerCase().trim();
    return EXERCISE_DB.filter((ex) => {
      // Text search: name, equipment, primary/secondary muscles
      const matchesSearch =
        !q ||
        ex.name.toLowerCase().includes(q) ||
        ex.equipment.toLowerCase().includes(q) ||
        ex.primaryMuscles.some((m) => m.toLowerCase().includes(q)) ||
        ex.secondaryMuscles.some((m) => m.toLowerCase().includes(q));

      // Muscle group filter
      const matchesMuscle =
        muscleFilter === 'All' ||
        ex.primaryMuscles.some((m) =>
          (muscleGroupMap[muscleFilter] ?? []).includes(m),
        );

      return matchesSearch && matchesMuscle;
    });
  }, [exerciseSearch, muscleFilter]);

  // ---------------------------------------------------------------------------
  // Active workout overlay
  // ---------------------------------------------------------------------------

  if (activeWorkout) {
    return (
      <LiveWorkoutPlayer
        workout={activeWorkout}
        onExit={() => setActiveWorkout(null)}
        phaseColor={color}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="pb-4">
      <Header
        title="Library"
        subtitle={
          activeTab === 'workouts'
            ? `${WORKOUT_LIBRARY.length} workouts`
            : `${EXERCISE_DB.length} exercises`
        }
        rightAction={
          <BookOpen size={20} className="text-text-muted" />
        }
      />

      {/* Tab switcher */}
      <div className="px-4 mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('workouts')}
          className={[
            'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors border',
            activeTab === 'workouts'
              ? 'text-white border-transparent'
              : 'bg-bg-secondary text-text-muted border-border-primary hover:text-text-secondary',
          ].join(' ')}
          style={activeTab === 'workouts' ? { backgroundColor: color } : undefined}
        >
          <Dumbbell size={16} />
          Workouts
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('exercises')}
          className={[
            'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors border',
            activeTab === 'exercises'
              ? 'text-white border-transparent'
              : 'bg-bg-secondary text-text-muted border-border-primary hover:text-text-secondary',
          ].join(' ')}
          style={activeTab === 'exercises' ? { backgroundColor: color } : undefined}
        >
          <Search size={16} />
          Exercises
        </button>
      </div>

      {/* ================================================================= */}
      {/* WORKOUTS TAB                                                      */}
      {/* ================================================================= */}
      {activeTab === 'workouts' && (
        <>
          {/* Search */}
          <div className="px-4 mb-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search workouts..."
            />
          </div>

          {/* Category filter pills */}
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
            {WORKOUT_CATEGORIES.map((cat) => {
              const isActive = cat === category;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={[
                    'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
                    isActive
                      ? 'text-white border-transparent'
                      : 'bg-bg-secondary text-text-muted border-border-primary hover:text-text-secondary',
                  ].join(' ')}
                  style={isActive ? { backgroundColor: color } : undefined}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Workout grid */}
          <div className="px-4">
            {filteredWorkouts.length === 0 ? (
              <EmptyState
                icon={<Dumbbell size={40} />}
                title="No Workouts Found"
                description={
                  WORKOUT_LIBRARY.length === 0
                    ? 'Workout library is coming soon. Check back later!'
                    : 'Try a different search or category filter.'
                }
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {filteredWorkouts.map((w) => (
                  <WorkoutCard
                    key={w.id}
                    workout={{
                      id: w.id,
                      label: w.label,
                      category: w.category ?? w.mode?.label ?? 'Strength',
                      mode: w.mode?.label ?? '',
                      duration: w.duration ? `${w.duration} min` : undefined,
                      difficulty: w.difficulty,
                      muscles: w.muscles,
                      exercises: w.exercises ?? [],
                      description: w.description,
                    }}
                    onClick={() => setSelectedWorkout(w)}
                    onStart={() => setActiveWorkout(w)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ================================================================= */}
      {/* EXERCISES TAB                                                     */}
      {/* ================================================================= */}
      {activeTab === 'exercises' && (
        <>
          {/* Search */}
          <div className="px-4 mb-3">
            <SearchInput
              value={exerciseSearch}
              onChange={setExerciseSearch}
              placeholder="Search exercises by name, muscle, or equipment..."
            />
          </div>

          {/* Muscle group filter pills */}
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
            {MUSCLE_GROUPS.map((mg) => {
              const isActive = mg === muscleFilter;
              return (
                <button
                  key={mg}
                  type="button"
                  onClick={() => setMuscleFilter(mg)}
                  className={[
                    'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
                    isActive
                      ? 'text-white border-transparent'
                      : 'bg-bg-secondary text-text-muted border-border-primary hover:text-text-secondary',
                  ].join(' ')}
                  style={isActive ? { backgroundColor: color } : undefined}
                >
                  {mg}
                </button>
              );
            })}
          </div>

          {/* Exercise count */}
          <div className="px-4 mb-2">
            <p className="text-xs text-text-muted">
              {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Exercise list */}
          <div className="px-4">
            {filteredExercises.length === 0 ? (
              <EmptyState
                icon={<Search size={40} />}
                title="No Exercises Found"
                description="Try a different search term or muscle group filter."
              />
            ) : (
              <div className="space-y-2">
                {filteredExercises.map((ex) => (
                  <ExerciseCard
                    key={ex.id}
                    exercise={ex}
                    onClick={() => setSelectedExercise(ex)}
                    phaseColor={color}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Exercise detail modal (read-only, no swap) */}
          <ExerciseDetailModal
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
            phaseColor={color}
          />
        </>
      )}

      {/* Workout detail modal */}
      <WorkoutDetailModal
        workout={selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
        onStart={(w) => {
          setSelectedWorkout(null);
          setActiveWorkout(w);
        }}
        phaseColor={color}
      />
    </div>
  );
}
