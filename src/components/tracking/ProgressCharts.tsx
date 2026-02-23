import { useMemo } from 'react';
import { TrendingUp, Trophy, BarChart3 } from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import { EmptyState } from '@/components/common/EmptyState';
import type { WorkoutSession, WeightEntry, PersonalRecord } from '@/types';

interface ProgressChartsProps {
  phaseColor: string;
}

/**
 * Returns the ISO week string "MMM D" for the Monday of the week containing `date`.
 */
function getWeekLabel(date: Date): string {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  const monday = new Date(date);
  monday.setDate(diff);
  return monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Returns a stable week key "YYYY-WW" for grouping purposes.
 */
function getWeekKey(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  const year = d.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const weekNum = Math.ceil(
    ((d.getTime() - startOfYear.getTime()) / 86_400_000 + startOfYear.getDay() + 1) / 7,
  );
  return `${year}-${String(weekNum).padStart(2, '0')}`;
}

export function ProgressCharts({ phaseColor }: ProgressChartsProps) {
  const [sessions] = useStorage<WorkoutSession[]>('workout_sessions', []);
  const [_weightEntries] = useStorage<WeightEntry[]>('weight_entries', []);
  const [personalRecords] = useStorage<PersonalRecord[]>('personal_records', []);

  // -----------------------------------------------------------------------
  // Workout Frequency: sessions per week for the last 8 weeks
  // -----------------------------------------------------------------------
  const weeklyData = useMemo(() => {
    const now = new Date();
    const eightWeeksAgo = new Date(now);
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    // Build the last 8 week slots (ordered oldest -> newest)
    const weeks: { key: string; label: string; count: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const key = getWeekKey(d);
      // Avoid duplicate keys if weeks overlap
      if (!weeks.some((w) => w.key === key)) {
        weeks.push({ key, label: getWeekLabel(d), count: 0 });
      }
    }

    // Count sessions per week
    for (const s of sessions) {
      const d = new Date(s.date);
      if (d.getTime() < eightWeeksAgo.getTime()) continue;
      const key = getWeekKey(d);
      const week = weeks.find((w) => w.key === key);
      if (week) week.count += 1;
    }

    return weeks;
  }, [sessions]);

  const maxCount = useMemo(
    () => Math.max(1, ...weeklyData.map((w) => w.count)),
    [weeklyData],
  );

  // -----------------------------------------------------------------------
  // Personal Records sorted newest first
  // -----------------------------------------------------------------------
  const sortedRecords = useMemo(() => {
    return [...personalRecords].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [personalRecords]);

  return (
    <div className="space-y-6">
      {/* ---- Workout Frequency Section ---- */}
      <div className="bg-bg-secondary rounded-xl border border-border-primary p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} className="text-text-muted" />
          <h4 className="text-xs font-bold uppercase tracking-wide text-text-muted">
            Workout Frequency
          </h4>
        </div>

        {sessions.length === 0 ? (
          <EmptyState
            icon={<TrendingUp size={32} />}
            title="No data yet"
            description="Complete workouts to see your weekly frequency."
          />
        ) : (
          <div className="flex items-end gap-2 h-40">
            {weeklyData.map((week) => {
              const heightPct = maxCount > 0 ? (week.count / maxCount) * 100 : 0;

              return (
                <div
                  key={week.key}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  {/* Count label above bar */}
                  <span className="text-[10px] font-mono font-bold tabular-nums text-text-secondary">
                    {week.count}
                  </span>

                  {/* Bar */}
                  <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                    <div
                      className="w-full max-w-[32px] rounded-t-md transition-all duration-300"
                      style={{
                        height: `${Math.max(heightPct, 4)}%`,
                        backgroundColor: week.count > 0 ? phaseColor || '#3B82F6' : '#374151',
                        opacity: week.count > 0 ? 1 : 0.3,
                      }}
                    />
                  </div>

                  {/* Week label below bar */}
                  <span className="text-[9px] text-text-muted font-mono whitespace-nowrap">
                    {week.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---- Personal Records Section ---- */}
      <div className="bg-bg-secondary rounded-xl border border-border-primary p-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={16} className="text-text-muted" />
          <h4 className="text-xs font-bold uppercase tracking-wide text-text-muted">
            Personal Records
          </h4>
        </div>

        {sortedRecords.length === 0 ? (
          <EmptyState
            icon={<Trophy size={32} />}
            title="No PRs yet"
            description="Set a personal record during a workout and it will show here."
          />
        ) : (
          <div className="space-y-2">
            {sortedRecords.map((pr, idx) => (
              <div
                key={`${pr.exerciseId}-${idx}`}
                className="flex items-center gap-3 bg-bg-tertiary/30 rounded-lg px-3 py-2"
              >
                <Trophy
                  size={14}
                  style={{ color: phaseColor || '#F59E0B' }}
                  className="shrink-0"
                />

                <span className="text-sm font-medium text-text-primary flex-1 truncate">
                  {pr.exerciseName}
                </span>

                <span className="font-mono text-sm font-bold tabular-nums text-text-primary">
                  {pr.weight}kg x {pr.reps}
                </span>

                <span className="text-xs text-text-muted font-mono shrink-0">
                  {new Date(pr.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
