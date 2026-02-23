import { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { SearchInput } from '../common/SearchInput';
import { Badge } from '../common/Badge';
import { modeColors, difficultyColors, muscleColors } from '../../utils/colors';

interface WorkoutExercise {
  name: string;
  sets: number | null;
  reps: string;
  rest: string;
  cues: string;
  equip: string;
  muscle: string | null;
  dbId: string | null;
}

interface WorkoutOption {
  id: string;
  label: string;
  category: string;
  mode: string;
  muscles?: string[];
  difficulty?: string;
  exercises: WorkoutExercise[];
  description?: string;
}

interface WorkoutSelectorProps {
  open: boolean;
  onClose: () => void;
  dayLabel?: string;
  onSelect: (workoutId: string) => void;
  workouts?: WorkoutOption[];
}

function getDifficultyStyle(difficulty: string): string {
  const d = difficulty.toLowerCase();
  if (d === 'easy' || d === 'beginner') return 'bg-emerald-500/20 text-emerald-400';
  if (d === 'medium' || d === 'intermediate') return 'bg-yellow-500/20 text-yellow-400';
  if (d === 'hard' || d === 'advanced' || d === 'expert')
    return 'bg-red-500/20 text-red-400';
  return 'bg-bg-tertiary text-text-secondary';
}

export function WorkoutSelector({
  open,
  onClose,
  dayLabel,
  onSelect,
  workouts = [],
}: WorkoutSelectorProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Collect unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    workouts.forEach((w) => cats.add(w.category));
    return Array.from(cats);
  }, [workouts]);

  // Filter workouts
  const filtered = useMemo(() => {
    let result = workouts;

    if (activeCategory) {
      result = result.filter((w) => w.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.label.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q) ||
          w.muscles?.some((m) => m.toLowerCase().includes(q)) ||
          w.exercises.some((e) => e.name.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [workouts, activeCategory, search]);

  const title = dayLabel ? `Pick Workout \u2014 ${dayLabel}` : 'Pick Workout';

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        {/* Search */}
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search workouts..."
        />

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={[
                'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0',
                activeCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-bg-tertiary text-text-muted hover:text-text-secondary',
              ].join(' ')}
            >
              All
            </button>
            {categories.map((cat) => {
              const catColor = modeColors[cat] ?? '#6366F1';
              const isActive = activeCategory === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    setActiveCategory(isActive ? null : cat)
                  }
                  className={[
                    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0',
                    isActive
                      ? 'text-white'
                      : 'bg-bg-tertiary text-text-muted hover:text-text-secondary',
                  ].join(' ')}
                  style={isActive ? { backgroundColor: catColor } : undefined}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <p className="text-center text-text-muted text-sm py-8">
            No workouts found.
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map((w) => {
              const catColor = modeColors[w.category] ?? '#6366F1';
              const previewExercises = w.exercises.slice(0, 3);

              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    onSelect(w.id);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-lg bg-bg-tertiary/50 border border-border-primary hover:bg-bg-tertiary transition-colors group"
                >
                  {/* Label + category */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-heading font-semibold text-sm text-text-primary group-hover:text-white transition-colors truncate">
                      {w.label}
                    </span>
                    <Badge size="sm" color="text-white">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full mr-1"
                        style={{ backgroundColor: catColor }}
                      />
                      {w.category}
                    </Badge>
                  </div>

                  {/* Muscles + Difficulty */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {w.difficulty && (
                      <Badge
                        size="sm"
                        color={getDifficultyStyle(w.difficulty)}
                      >
                        {w.difficulty}
                      </Badge>
                    )}
                    {w.muscles?.map((m) => (
                      <Badge key={m} size="sm" variant="outline">
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full mr-1"
                          style={{
                            backgroundColor:
                              muscleColors[m.toLowerCase()] ?? '#6366F1',
                          }}
                        />
                        {m}
                      </Badge>
                    ))}
                  </div>

                  {/* Exercise preview */}
                  {previewExercises.length > 0 && (
                    <div className="space-y-0.5">
                      {previewExercises.map((ex, i) => (
                        <p
                          key={`${ex.name}-${i}`}
                          className="text-[10px] text-text-muted truncate"
                        >
                          <span className="font-mono mr-1 text-text-secondary">
                            {i + 1}.
                          </span>
                          {ex.name}
                        </p>
                      ))}
                      {w.exercises.length > 3 && (
                        <p className="text-[9px] text-text-muted italic">
                          +{w.exercises.length - 3} more
                        </p>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
