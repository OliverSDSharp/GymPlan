import { useMemo } from 'react';
import { Calendar, Clock, Dumbbell, Trash2, History } from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import type { WorkoutSession } from '@/types';

interface WorkoutHistoryProps {
  phaseColor: string;
}

/**
 * Formats a duration in minutes to a human-readable string.
 * e.g. 65 -> "1h 05m", 12 -> "12m"
 */
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

export function WorkoutHistory({ phaseColor }: WorkoutHistoryProps) {
  const [sessions, setSessions] = useStorage<WorkoutSession[]>('workout_sessions', []);

  // Sessions sorted newest first
  const sorted = useMemo(() => {
    return [...sessions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [sessions]);

  const handleDelete = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={<History size={40} />}
        title="No workouts yet"
        description="Complete a workout session and it will appear here."
      />
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wide text-text-muted">
        Workout History
      </h4>

      {sorted.map((session) => (
        <div
          key={session.id}
          className="bg-bg-secondary rounded-xl border border-border-primary p-4"
        >
          {/* Header row: date + day label + delete */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-col gap-1">
              <span
                className="text-sm font-bold"
                style={{ color: phaseColor }}
              >
                {session.dayLabel}
              </span>
              <div className="flex items-center gap-1.5 text-text-muted">
                <Calendar size={12} />
                <span className="text-xs font-mono">
                  {new Date(session.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(session.id)}
              aria-label="Delete session"
              icon={<Trash2 size={14} />}
            />
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Clock size={13} />
              <span className="text-xs font-mono tabular-nums">
                {formatDuration(session.duration)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Dumbbell size={13} />
              <span className="text-xs font-mono tabular-nums">
                {session.exercises.length} exercise{session.exercises.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Notes */}
          {session.notes && (
            <p className="mt-2 text-xs text-text-muted italic leading-relaxed border-t border-border-primary pt-2">
              {session.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
