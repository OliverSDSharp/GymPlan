import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Flame, Trophy, Calendar } from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import type { WorkoutSession } from '@/types';

interface CalendarHeatmapProps {
  phaseColor: string;
}

/** Day-of-week labels (Sun through Sat). */
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/** Month names for display. */
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/**
 * Converts a Date to a YYYY-MM-DD string in local time,
 * matching the format used by WorkoutSession.date.
 */
function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Builds an array of Date objects representing every calendar cell
 * for the given month grid (including leading/trailing days from
 * adjacent months so each row is a full Sun-Sat week).
 */
function buildMonthGrid(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Start from the Sunday on or before the 1st
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // End on the Saturday on or after the last day
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const cells: Date[] = [];
  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    cells.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return cells;
}

/**
 * Mixes the given hex color with opacity by converting it
 * to an rgba() string. Opacity should be 0-1.
 */
function colorWithOpacity(hex: string, opacity: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Computes the current streak and best streak from a set of
 * workout date keys. A streak is a consecutive run of calendar days
 * that each have at least one workout.
 */
function computeStreaks(dateKeys: Set<string>): { current: number; best: number } {
  if (dateKeys.size === 0) return { current: 0, best: 0 };

  // Sort all workout dates chronologically
  const sorted = Array.from(dateKeys).sort();

  let best = 1;
  let streak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + 'T00:00:00');
    const curr = new Date(sorted[i] + 'T00:00:00');
    const diffMs = curr.getTime() - prev.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak += 1;
    } else {
      streak = 1;
    }
    if (streak > best) best = streak;
  }

  // Determine current streak: walk backwards from today
  const todayKey = toDateKey(new Date());
  let current = 0;
  const cursor = new Date();

  // Allow starting from today or yesterday (if no workout today yet)
  if (!dateKeys.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (dateKeys.has(toDateKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { current, best };
}

export function CalendarHeatmap({ phaseColor }: CalendarHeatmapProps) {
  const [sessions] = useStorage<WorkoutSession[]>('workout_sessions', []);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  /** Map from YYYY-MM-DD to exercise count for that day. */
  const exerciseCountByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sessions) {
      // Normalise to YYYY-MM-DD (handles ISO strings, etc.)
      const key = s.date.substring(0, 10);
      map.set(key, (map.get(key) ?? 0) + s.exercises.length);
    }
    return map;
  }, [sessions]);

  /** Maximum exercises in a single day -- used for brightness scaling. */
  const maxExercises = useMemo(() => {
    let max = 0;
    for (const count of exerciseCountByDate.values()) {
      if (count > max) max = count;
    }
    return max || 1; // avoid division by zero
  }, [exerciseCountByDate]);

  /** Streak statistics across all time. */
  const streaks = useMemo(
    () => computeStreaks(new Set(exerciseCountByDate.keys())),
    [exerciseCountByDate],
  );

  const grid = useMemo(
    () => buildMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const todayKey = toDateKey(today);

  /* ---- Navigation handlers ---- */

  const goToPrevMonth = () => {
    setViewMonth((prev) => {
      if (prev === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const goToNextMonth = () => {
    setViewMonth((prev) => {
      if (prev === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  return (
    <div className="space-y-4">
      {/* ---- Streak cards ---- */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bg-secondary rounded-xl border border-border-primary p-3 flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ backgroundColor: colorWithOpacity(phaseColor, 0.15) }}
          >
            <Flame size={18} style={{ color: phaseColor }} />
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Current Streak</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">
              {streaks.current}
              <span className="text-xs font-normal text-text-muted ml-1">days</span>
            </p>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-xl border border-border-primary p-3 flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ backgroundColor: colorWithOpacity(phaseColor, 0.15) }}
          >
            <Trophy size={18} style={{ color: phaseColor }} />
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Best Streak</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">
              {streaks.best}
              <span className="text-xs font-normal text-text-muted ml-1">days</span>
            </p>
          </div>
        </div>
      </div>

      {/* ---- Calendar card ---- */}
      <div className="bg-bg-secondary rounded-xl border border-border-primary p-4">
        {/* Month navigation header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2 text-text-primary">
            <Calendar size={16} className="text-text-muted" />
            <span className="text-sm font-bold uppercase tracking-wide">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
          </div>

          <button
            type="button"
            onClick={goToNextMonth}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_LABELS.map((label) => (
            <div
              key={label}
              className="text-center text-[10px] font-semibold uppercase tracking-wider text-text-muted py-1"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {grid.map((date) => {
            const dateKey = toDateKey(date);
            const isCurrentMonth = date.getMonth() === viewMonth;
            const isToday = dateKey === todayKey;
            const exerciseCount = exerciseCountByDate.get(dateKey) ?? 0;
            const hasWorkout = exerciseCount > 0;

            // Brightness: scale from 0.35 (minimal) to 1.0 (max)
            const intensity = hasWorkout
              ? 0.35 + 0.65 * (exerciseCount / maxExercises)
              : 0;

            return (
              <div
                key={dateKey}
                className={[
                  'relative aspect-square flex items-center justify-center rounded-lg text-xs font-mono transition-colors',
                  isToday ? 'ring-2 ring-offset-1 ring-offset-bg-secondary' : '',
                  !isCurrentMonth ? 'opacity-30' : '',
                ].join(' ')}
                style={{
                  backgroundColor: hasWorkout
                    ? colorWithOpacity(phaseColor, intensity)
                    : undefined,
                  ...(isToday
                    ? { '--tw-ring-color': phaseColor } as React.CSSProperties
                    : {}),
                }}
                title={
                  hasWorkout
                    ? `${dateKey}: ${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''}`
                    : dateKey
                }
              >
                {/* Background for non-workout days */}
                {!hasWorkout && isCurrentMonth && (
                  <div className="absolute inset-0 rounded-lg bg-bg-tertiary/30" />
                )}
                <span
                  className={[
                    'relative z-10',
                    hasWorkout ? 'text-white font-semibold' : 'text-text-secondary',
                  ].join(' ')}
                >
                  {date.getDate()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
