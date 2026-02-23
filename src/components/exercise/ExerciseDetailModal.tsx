import { Exercise } from '../../types/exercise';
import { EXERCISE_DB, getAlternatives } from '../../data/exercises';
import { muscleColors, difficultyColors } from '../../utils/colors';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ExerciseImage } from './ExerciseImage';
import { ArrowRightLeft, RotateCcw } from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  phaseColor?: string;
  onSwap?: (ex: Exercise) => void;
  /** Whether this exercise is currently swapped (show reset button) */
  isSwapped?: boolean;
  /** Reset the exercise to its original */
  onReset?: () => void;
}

export function ExerciseDetailModal({
  exercise,
  onClose,
  phaseColor,
  onSwap,
  isSwapped = false,
  onReset,
}: ExerciseDetailModalProps) {
  if (!exercise) return null;

  const alternatives = getAlternatives(exercise);

  const levelColor =
    difficultyColors[exercise.level] ?? difficultyColors.intermediate;

  return (
    <Modal open={!!exercise} onClose={onClose} title={exercise.name}>
      {/* Exercise images */}
      <ExerciseImage exerciseId={exercise.id} />

      {/* Header info */}
      <div className="mt-4 space-y-3">
        <h3 className="font-heading font-black text-xl text-text-primary">
          {exercise.name}
        </h3>

        <div className="flex flex-wrap gap-2">
          <Badge
            size="md"
            color={`text-white`}
          >
            <span
              className="inline-block w-2 h-2 rounded-full mr-1.5"
              style={{ backgroundColor: levelColor }}
            />
            {exercise.level}
          </Badge>

          <Badge size="md" variant="outline">
            {exercise.equipment}
          </Badge>
        </div>

        {/* Muscles */}
        <div className="space-y-2">
          {exercise.primaryMuscles.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-text-muted mr-1 self-center">
                Primary
              </span>
              {exercise.primaryMuscles.map((m) => (
                <Badge
                  key={m}
                  size="sm"
                  color={`text-white`}
                >
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
          )}

          {exercise.secondaryMuscles.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-text-muted mr-1 self-center">
                Secondary
              </span>
              {exercise.secondaryMuscles.map((m) => (
                <Badge key={m} size="sm" variant="outline">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-1 opacity-60"
                    style={{
                      backgroundColor:
                        muscleColors[m.toLowerCase()] ?? '#6366F1',
                    }}
                  />
                  {m}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      {exercise.instructions.length > 0 && (
        <div className="mt-5">
          <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2 font-semibold">
            Instructions
          </h4>
          <ol className="space-y-2">
            {exercise.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-text-secondary">
                <span
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
                  style={{ backgroundColor: phaseColor ?? '#3B82F6' }}
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Reset to original */}
      {isSwapped && onReset && (
        <div className="mt-5">
          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCcw size={14} />}
            onClick={() => {
              onReset();
              onClose();
            }}
          >
            Reset to Original Exercise
          </Button>
        </div>
      )}

      {/* Alternatives */}
      {alternatives.length > 0 && onSwap && (
        <div className="mt-6">
          <h4 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold flex items-center gap-1.5">
            <ArrowRightLeft size={14} />
            Alternatives
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {alternatives.map((alt) => (
              <button
                key={alt.id}
                type="button"
                onClick={() => onSwap(alt)}
                className="flex flex-col gap-1 p-3 rounded-lg bg-bg-tertiary/50 border border-border-primary text-left hover:bg-bg-tertiary transition-colors group"
              >
                <span className="text-sm font-medium text-text-primary group-hover:text-white transition-colors">
                  {alt.name}
                </span>
                <div className="flex items-center gap-2">
                  <Badge size="sm">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full mr-1"
                      style={{
                        backgroundColor:
                          difficultyColors[alt.level] ??
                          difficultyColors.intermediate,
                      }}
                    />
                    {alt.level}
                  </Badge>
                  <span className="text-[10px] text-text-muted">
                    {alt.equipment}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
