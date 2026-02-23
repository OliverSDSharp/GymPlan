import { Clock, Play, Zap, Dumbbell } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { modeColors, muscleColors } from '../../utils/colors';
import type { LibraryWorkout } from '../../types';

interface WorkoutDetailModalProps {
  workout: LibraryWorkout | null;
  onClose: () => void;
  onStart: (workout: LibraryWorkout) => void;
  phaseColor?: string;
}

function getDifficultyStyle(difficulty: string): string {
  const d = difficulty.toLowerCase();
  if (d === 'easy' || d === 'beginner') return 'bg-emerald-500/20 text-emerald-400';
  if (d === 'medium' || d === 'intermediate') return 'bg-yellow-500/20 text-yellow-400';
  if (d === 'hard' || d === 'advanced' || d === 'expert') return 'bg-red-500/20 text-red-400';
  return 'bg-bg-tertiary text-text-secondary';
}

export function WorkoutDetailModal({
  workout,
  onClose,
  onStart,
  phaseColor,
}: WorkoutDetailModalProps) {
  if (!workout) return null;

  const defaultColor = '#3B82F6';
  const accentColor = phaseColor || defaultColor;
  const categoryColor = modeColors[workout.category] ?? modeColors[workout.mode?.label] ?? defaultColor;

  return (
    <Modal open={!!workout} onClose={onClose} title={workout.label}>
      <div className="flex flex-col gap-4">
        {/* Category & Difficulty badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge size="md" color="text-white" style={{ backgroundColor: categoryColor }}>
            {workout.category}
          </Badge>
          {workout.difficulty && (
            <Badge size="md" color={getDifficultyStyle(workout.difficulty)}>
              {workout.difficulty}
            </Badge>
          )}
        </div>

        {/* Description */}
        {workout.description && (
          <p className="text-text-muted text-sm leading-relaxed">
            {workout.description}
          </p>
        )}

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          {workout.duration > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-text-muted" />
              {workout.duration} min
            </span>
          )}
          {workout.mode?.label && (
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-text-muted" />
              {workout.mode.label}
            </span>
          )}
          {workout.rounds != null && (
            <span className="flex items-center gap-1.5">
              <Dumbbell size={14} className="text-text-muted" />
              {workout.rounds} rounds
              {workout.roundRest != null && (
                <span className="text-text-muted">({workout.roundRest}s rest)</span>
              )}
            </span>
          )}
          {workout.timeLimit != null && (
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-text-muted" />
              {workout.timeLimit} min limit
            </span>
          )}
        </div>

        {/* Target muscles */}
        {workout.muscles.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {workout.muscles.map((muscle) => (
              <Badge
                key={muscle}
                size="sm"
                variant="outline"
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1"
                  style={{ backgroundColor: muscleColors[muscle.toLowerCase()] ?? '#6366F1' }}
                />
                {muscle}
              </Badge>
            ))}
          </div>
        )}

        {/* Divider */}
        <hr className="border-border-primary" />

        {/* Exercise list header */}
        <h3 className="text-text-primary font-heading font-bold text-sm uppercase tracking-wide">
          Exercises ({workout.exercises.length})
        </h3>

        {/* Exercise list */}
        <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto -mr-2 pr-2">
          {workout.exercises.map((exercise, index) => (
            <div
              key={`${exercise.name}-${index}`}
              className="bg-bg-primary rounded-lg border border-border-primary p-3 space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  <span className="text-text-muted text-xs font-mono mt-0.5 shrink-0">
                    {index + 1}.
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-text-primary font-medium text-sm">
                      {exercise.name}
                    </span>
                    {exercise.equip && (
                      <span className="text-text-muted text-[11px]">
                        {exercise.equip}
                      </span>
                    )}
                  </div>
                </div>

                {/* Muscle badge */}
                {exercise.muscle && (
                  <Badge
                    size="sm"
                    style={{
                      backgroundColor: `${muscleColors[exercise.muscle] ?? '#6366F1'}20`,
                      color: muscleColors[exercise.muscle] ?? '#6366F1',
                    }}
                  >
                    {exercise.muscle}
                  </Badge>
                )}
              </div>

              {/* Sets x Reps and Rest */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="font-mono text-text-primary">
                  {exercise.sets != null ? `${exercise.sets} × ${exercise.reps}` : exercise.reps}
                </span>
                {exercise.rest && (
                  <span className="text-text-muted">Rest: {exercise.rest}</span>
                )}
              </div>

              {/* Cues */}
              {exercise.cues && (
                <p className="text-text-muted text-[11px] leading-relaxed italic">
                  💡 {exercise.cues}
                </p>
              )}

              {/* Special info: circuit station, superset, EMOM */}
              {(exercise.circuitStation != null || exercise.supersetGroup || exercise.emomMinute != null) && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {exercise.circuitStation != null && (
                    <Badge size="sm" color="bg-bg-tertiary text-text-muted">
                      Station {exercise.circuitStation}
                    </Badge>
                  )}
                  {exercise.supersetGroup && (
                    <Badge size="sm" color="bg-purple-500/20 text-purple-400">
                      Superset {exercise.supersetGroup}
                      {exercise.supersetRole && ` · ${exercise.supersetRole}`}
                    </Badge>
                  )}
                  {exercise.emomMinute != null && (
                    <Badge size="sm" color="bg-amber-500/20 text-amber-400">
                      Minute {exercise.emomMinute}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Start Workout button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={<Play size={18} />}
            onClick={() => onStart(workout)}
            style={{ backgroundColor: accentColor }}
            className="text-white font-bold"
          >
            Start Workout
          </Button>
        </div>
      </div>
    </Modal>
  );
}
