import { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { TabBar } from '../components/layout/TabBar';
import { useStorage } from '../hooks/useStorage';
import { phaseColors } from '../utils/colors';
import { useAppStore } from '../context/AppContext';
import {
  Clock,
  Dumbbell,
  TrendingUp,
  Calendar,
  Activity,
} from 'lucide-react';
import { CalendarHeatmap } from '../components/tracking/CalendarHeatmap';
import type { WorkoutSession } from '../types';

const TABS = [
  { key: 'sessions', label: 'Sessions' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'progress', label: 'Progress' },
  { key: 'weekly', label: 'Weekly Summary' },
];

export function HistoryPage() {
  const activePhase = useAppStore((s) => s.activePhase);
  const color = phaseColors[activePhase] ?? phaseColors[0];

  const [activeTab, setActiveTab] = useState('sessions');

  return (
    <div className="pb-4">
      <Header
        title="History"
        subtitle="Track your progress"
        rightAction={
          <Clock size={20} className="text-text-muted" />
        }
      />

      {/* Sub-tabs */}
      <TabBar
        tabs={TABS}
        active={activeTab}
        onChange={setActiveTab}
        color={`text-[${color}]`}
      />

      <div className="mt-4">
        {activeTab === 'sessions' && <SessionsTab color={color} />}
        {activeTab === 'calendar' && (
          <div className="px-4">
            <CalendarHeatmap phaseColor={color} />
          </div>
        )}
        {activeTab === 'progress' && <ProgressTab color={color} />}
        {activeTab === 'weekly' && <WeeklySummaryTab color={color} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sessions Tab
// ---------------------------------------------------------------------------

function SessionsTab({ color }: { color: string }) {
  const [sessions] = useStorage<WorkoutSession[]>('workout_sessions', []);

  if (sessions.length === 0) {
    return (
      <div className="px-4">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="mb-4 text-text-muted">
            <Dumbbell size={40} />
          </div>
          <h3 className="font-heading font-bold text-lg uppercase tracking-wide text-text-primary">
            No Sessions Yet
          </h3>
          <p className="mt-2 text-sm text-text-secondary max-w-xs">
            Complete workouts to see your session history here.
          </p>
        </div>
      </div>
    );
  }

  const sorted = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="px-4 space-y-2">
      {sorted.map((session) => (
        <div
          key={session.id}
          className="bg-bg-secondary rounded-xl border border-border-primary p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    phaseColors[session.phaseId - 1] ?? color,
                }}
              />
              <h4 className="text-sm font-medium text-text-primary">
                {session.dayLabel}
              </h4>
            </div>
            <span className="text-xs text-text-muted font-mono">
              {new Date(session.date).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <Dumbbell size={12} />
              {session.exercises.length} exercises
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {Math.round(session.duration / 60)} min
            </span>
          </div>

          {session.notes && (
            <p className="text-xs text-text-muted italic">{session.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress Tab
// ---------------------------------------------------------------------------

function ProgressTab({ color }: { color: string }) {
  const [sessions] = useStorage<WorkoutSession[]>('workout_sessions', []);

  if (sessions.length === 0) {
    return (
      <div className="px-4">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="mb-4 text-text-muted">
            <TrendingUp size={40} />
          </div>
          <h3 className="font-heading font-bold text-lg uppercase tracking-wide text-text-primary">
            No Progress Data
          </h3>
          <p className="mt-2 text-sm text-text-secondary max-w-xs">
            Complete workouts and log weights to see progress charts.
          </p>
        </div>
      </div>
    );
  }

  // Simple volume over time display
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10);

  return (
    <div className="px-4 space-y-4">
      <div className="bg-bg-secondary rounded-xl border border-border-primary p-4 space-y-3">
        <h4 className="text-xs uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1.5">
          <Activity size={14} />
          Recent Activity
        </h4>
        <div className="space-y-2">
          {recentSessions.map((session) => {
            const totalSets = session.exercises.reduce(
              (sum, ex) => sum + ex.sets.length,
              0,
            );
            const totalVolume = session.exercises.reduce(
              (sum, ex) =>
                sum +
                ex.sets.reduce(
                  (s, set) =>
                    s + (set.completed ? set.weight * set.reps : 0),
                  0,
                ),
              0,
            );

            return (
              <div
                key={session.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted font-mono w-16">
                    {new Date(session.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="text-text-primary">{session.dayLabel}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <span>{totalSets} sets</span>
                  {totalVolume > 0 && (
                    <span className="font-mono">{Math.round(totalVolume)} kg</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Weekly Summary Tab
// ---------------------------------------------------------------------------

function WeeklySummaryTab({ color }: { color: string }) {
  const [sessions] = useStorage<WorkoutSession[]>('workout_sessions', []);

  // Calculate current week stats
  const weekStats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeekSessions = sessions.filter(
      (s) => new Date(s.date) >= startOfWeek,
    );

    const totalVolume = thisWeekSessions.reduce(
      (sum, session) =>
        sum +
        session.exercises.reduce(
          (exSum, ex) =>
            exSum +
            ex.sets.reduce(
              (setSum, set) =>
                setSum + (set.completed ? set.weight * set.reps : 0),
              0,
            ),
          0,
        ),
      0,
    );

    const totalDuration = thisWeekSessions.reduce(
      (sum, s) => sum + s.duration,
      0,
    );

    return {
      sessions: thisWeekSessions.length,
      totalVolume: Math.round(totalVolume),
      totalDuration: Math.round(totalDuration / 60),
    };
  }, [sessions]);

  return (
    <div className="px-4 space-y-4">
      {/* Stats cards */}
      <div className="bg-bg-secondary rounded-xl border border-border-primary p-4 space-y-4">
        <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-text-primary flex items-center gap-2">
          <Calendar size={16} />
          This Week
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {/* Sessions count */}
          <div className="text-center p-3 rounded-lg bg-bg-tertiary/50">
            <p
              className="font-mono text-2xl font-bold"
              style={{ color }}
            >
              {weekStats.sessions}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-text-muted mt-1">
              Sessions
            </p>
          </div>

          {/* Total volume */}
          <div className="text-center p-3 rounded-lg bg-bg-tertiary/50">
            <p className="font-mono text-2xl font-bold text-text-primary">
              {weekStats.totalVolume > 0
                ? `${(weekStats.totalVolume / 1000).toFixed(1)}k`
                : '--'}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-text-muted mt-1">
              Volume (kg)
            </p>
          </div>

          {/* Total duration */}
          <div className="text-center p-3 rounded-lg bg-bg-tertiary/50">
            <p className="font-mono text-2xl font-bold text-text-primary">
              {weekStats.totalDuration > 0
                ? `${weekStats.totalDuration}`
                : '--'}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-text-muted mt-1">
              Minutes
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder cards for future data */}
      <div className="bg-bg-secondary rounded-xl border border-border-primary p-4 space-y-3">
        <h4 className="text-xs uppercase tracking-wider text-text-muted font-semibold">
          Weekly Goals
        </h4>
        <div className="space-y-2">
          <WeeklyGoalRow
            label="Workouts"
            current={weekStats.sessions}
            target={5}
            color={color}
          />
          <WeeklyGoalRow
            label="Protein (avg g/day)"
            current={0}
            target={200}
            color="#3B82F6"
            placeholder
          />
          <WeeklyGoalRow
            label="Weight Change"
            current={0}
            target={0}
            color="#10B981"
            placeholder
          />
        </div>
      </div>
    </div>
  );
}

function WeeklyGoalRow({
  label,
  current,
  target,
  color,
  placeholder = false,
}: {
  label: string;
  current: number;
  target: number;
  color: string;
  placeholder?: boolean;
}) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className="font-mono text-xs text-text-primary">
          {placeholder ? '--' : `${current} / ${target}`}
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: placeholder ? '0%' : `${pct}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
