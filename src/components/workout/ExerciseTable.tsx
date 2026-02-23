import { Badge } from '../common/Badge';

interface ExerciseRow {
  name: string;
  sets?: number | null;
  reps: string;
  rest?: string;
  cues: string;
  equip: string;
  muscle: string | null;
  dbId: string | null;
}

interface ExerciseTableProps {
  exercises: ExerciseRow[];
  phaseColor?: string;
  onExerciseClick?: (exercise: ExerciseRow) => void;
  swappedIndices?: number[];
}

const equipEmoji: Record<string, string> = {
  barbell: '\u{1F3CB}',
  dumbbell: '\u{1F4AA}',
  kettlebell: '\u{1F514}',
  'body only': '\u{1F9D8}',
  machine: '\u{2699}',
  cable: '\u{1F517}',
  bands: '\u{27B0}',
  other: '\u{1F3AF}',
};

function getEquipEmoji(equip: string): string {
  const key = equip.toLowerCase();
  return equipEmoji[key] ?? '\u{1F3AF}';
}

export function ExerciseTable({
  exercises,
  phaseColor = '#3B82F6',
  onExerciseClick,
  swappedIndices = [],
}: ExerciseTableProps) {
  return (
    <div className="space-y-1">
      {exercises.map((ex, i) => {
        const isSwapped = swappedIndices.includes(i);

        return (
          <button
            key={`${ex.name}-${i}`}
            type="button"
            onClick={() => onExerciseClick?.(ex)}
            className={[
              'w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors',
              'hover:bg-bg-tertiary group',
              isSwapped ? 'border-l-[3px] border-orange-500' : '',
            ].join(' ')}
          >
            {/* Number badge */}
            <span
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
              style={{ backgroundColor: phaseColor }}
            >
              {i + 1}
            </span>

            {/* Exercise info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-text-primary truncate">
                  {ex.name}
                </span>
                <span className="text-xs shrink-0" title={ex.equip}>
                  {getEquipEmoji(ex.equip)}
                </span>
              </div>

              {/* Cue text */}
              {ex.cues && (
                <p className="text-text-muted text-xs mt-0.5 line-clamp-1">
                  {ex.cues}
                </p>
              )}
            </div>

            {/* Sets x Reps + Rest */}
            <div className="shrink-0 flex flex-col items-end gap-0.5">
              <span className="font-mono text-xs text-text-primary">
                {ex.sets != null ? `${ex.sets}\u00D7${ex.reps}` : ex.reps}
              </span>
              {ex.rest && (
                <span className="font-mono text-[10px] text-text-muted">
                  {ex.rest}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
