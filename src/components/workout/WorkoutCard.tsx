import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { modeColors, difficultyColors, muscleColors } from '../../utils/colors';
import { Clock, Play, Zap } from 'lucide-react';

interface WorkoutExercisePreview {
  name: string;
  sets?: number | null;
  reps: string;
  rest?: string;
  cues: string;
  equip: string;
  muscle: string | null;
  dbId: string | null;
}

interface WorkoutCardProps {
  workout: {
    id: string;
    label: string;
    category: string;
    mode: string;
    duration?: string;
    difficulty?: string;
    muscles?: string[];
    exercises: WorkoutExercisePreview[];
    description?: string;
  };
  onStart?: () => void;
  onClick?: () => void;
}

const categoryBorderColor: Record<string, string> = {
  Strength: '#F97316',
  Hypertrophy: '#14B8A6',
  Cardio: '#10B981',
  Circuit: '#3B82F6',
  EMOM: '#F59E0B',
  AMRAP: '#8B5CF6',
  Supersets: '#EC4899',
  Deload: '#64748B',
};

function getDifficultyStyle(difficulty: string): string {
  const d = difficulty.toLowerCase();
  if (d === 'easy' || d === 'beginner') return 'bg-emerald-500/20 text-emerald-400';
  if (d === 'medium' || d === 'intermediate') return 'bg-yellow-500/20 text-yellow-400';
  if (d === 'hard' || d === 'advanced' || d === 'expert')
    return 'bg-red-500/20 text-red-400';
  return 'bg-bg-tertiary text-text-secondary';
}

export function WorkoutCard({ workout, onStart, onClick }: WorkoutCardProps) {
  const borderColor =
    modeColors[workout.category] ??
    categoryBorderColor[workout.category] ??
    '#3B82F6';

  const previewExercises = workout.exercises.slice(0, 5);

  return (
    <div
      className={[
        'bg-bg-secondary border border-border-primary rounded-xl overflow-hidden transition-shadow hover:shadow-lg',
        onClick ? 'cursor-pointer active:scale-[0.99]' : '',
      ].join(' ')}
      style={{ borderLeftWidth: '4px', borderLeftColor: borderColor }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-bold text-base text-text-primary leading-tight">
            {workout.label}
          </h3>
          <Badge
            size="sm"
            color="text-white"
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full mr-1"
              style={{ backgroundColor: borderColor }}
            />
            {workout.category}
          </Badge>
        </div>

        {/* Description */}
        {workout.description && (
          <p className="text-text-secondary text-sm line-clamp-2">
            {workout.description}
          </p>
        )}

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-2">
          {workout.duration && (
            <span className="inline-flex items-center gap-1 text-xs text-text-muted">
              <Clock size={12} />
              {workout.duration}
            </span>
          )}

          {workout.difficulty && (
            <Badge size="sm" color={getDifficultyStyle(workout.difficulty)}>
              {workout.difficulty}
            </Badge>
          )}

          {workout.muscles?.map((m) => (
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
                className="text-[11px] text-text-muted truncate"
              >
                <span className="text-text-secondary font-mono mr-1">
                  {i + 1}.
                </span>
                {ex.name}
                {ex.sets != null && (
                  <span className="ml-1 font-mono opacity-60">
                    {ex.sets}&times;{ex.reps}
                  </span>
                )}
              </p>
            ))}
            {workout.exercises.length > 5 && (
              <p className="text-[10px] text-text-muted italic">
                +{workout.exercises.length - 5} more
              </p>
            )}
          </div>
        )}

        {/* Start button */}
        {onStart && (
          <Button
            variant="primary"
            size="sm"
            fullWidth
            icon={<Play size={14} />}
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            color={`bg-[${borderColor}] hover:opacity-90`}
            style={{ backgroundColor: borderColor }}
          >
            Start Workout
          </Button>
        )}
      </div>
    </div>
  );
}
