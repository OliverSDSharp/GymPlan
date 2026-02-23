import { useState, useMemo } from 'react';
import { Scale, TrendingDown, TrendingUp, Target, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useStorage } from '@/hooks/useStorage';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { bmi, bmiCategory, bmiColor } from '@/utils/helpers';
import { generateId } from '@/utils/helpers';
import type { WeightEntry } from '@/types';

interface WeightTrackerProps {
  phaseColor: string;
}

const GOAL_WEIGHT = 90;

export function WeightTracker({ phaseColor }: WeightTrackerProps) {
  const [weightLog, setWeightLog] = useStorage<WeightEntry[]>('weight_log', []);
  const [userHeight] = useStorage<number>('user_height', 180);

  const [newWeight, setNewWeight] = useState('');
  const [newNote, setNewNote] = useState('');

  // Derived stats
  const stats = useMemo(() => {
    if (weightLog.length === 0) {
      return {
        current: 0,
        currentBmi: 0,
        totalLost: 0,
        fourWeekTrend: 0,
        goalProgress: 0,
      };
    }

    const sorted = [...weightLog].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const current = sorted[0].weight;
    const first = sorted[sorted.length - 1].weight;
    const totalLost = first - current;
    const currentBmi = bmi(current, userHeight);

    // 4-week trend: compare current to entry ~28 days ago
    const fourWeeksAgo = Date.now() - 28 * 24 * 60 * 60 * 1000;
    const oldEntry = sorted.find(
      (e) => new Date(e.date).getTime() <= fourWeeksAgo,
    );
    const fourWeekTrend = oldEntry ? oldEntry.weight - current : 0;

    // Goal progress: from first weight towards goal
    const totalToLose = first - GOAL_WEIGHT;
    const goalProgress =
      totalToLose > 0 ? Math.min(100, (totalLost / totalToLose) * 100) : 100;

    return { current, currentBmi, totalLost, fourWeekTrend, goalProgress };
  }, [weightLog, userHeight]);

  // Chart data: last 12 entries
  const chartData = useMemo(() => {
    const sorted = [...weightLog]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-12);

    return sorted.map((entry) => ({
      date: new Date(entry.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      weight: entry.weight,
    }));
  }, [weightLog]);

  // BMI scale position
  const bmiPosition = useMemo(() => {
    const val = stats.currentBmi;
    // Scale from 15 to 40
    return Math.min(100, Math.max(0, ((val - 15) / 25) * 100));
  }, [stats.currentBmi]);

  const handleLog = () => {
    const w = parseFloat(newWeight);
    if (isNaN(w) || w <= 0) return;

    const entry: WeightEntry = {
      id: generateId(),
      date: new Date().toISOString().slice(0, 10),
      weight: w,
      note: newNote.trim() || undefined,
    };

    setWeightLog((prev) => [...prev, entry]);
    setNewWeight('');
    setNewNote('');
  };

  // History sorted newest first
  const history = useMemo(() => {
    return [...weightLog].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [weightLog]);

  const statCards = [
    {
      label: 'Current',
      value: stats.current ? `${stats.current.toFixed(1)} kg` : '--',
      icon: <Scale size={16} />,
    },
    {
      label: 'Total Lost',
      value: stats.totalLost
        ? `${stats.totalLost > 0 ? '-' : '+'}${Math.abs(stats.totalLost).toFixed(1)} kg`
        : '--',
      icon: <TrendingDown size={16} />,
    },
    {
      label: 'BMI',
      value: stats.currentBmi ? `${stats.currentBmi}` : '--',
      icon: null,
      extra: stats.currentBmi
        ? bmiCategory(stats.currentBmi)
        : undefined,
      extraColor: stats.currentBmi
        ? bmiColor(stats.currentBmi)
        : undefined,
    },
    {
      label: '4-Week Trend',
      value: stats.fourWeekTrend
        ? `${stats.fourWeekTrend > 0 ? '-' : '+'}${Math.abs(stats.fourWeekTrend).toFixed(1)} kg`
        : '--',
      icon: stats.fourWeekTrend >= 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />,
    },
    {
      label: 'Goal Progress',
      value: `${Math.round(stats.goalProgress)}%`,
      icon: <Target size={16} />,
      isGoal: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-bg-tertiary/50 rounded-lg p-3 flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 text-text-muted">
              {card.icon}
              <span className="text-[10px] uppercase tracking-wide">{card.label}</span>
            </div>
            <span className="font-mono text-lg font-bold tabular-nums text-text-primary">
              {card.value}
            </span>
            {card.extra && (
              <span
                className="text-xs font-medium"
                style={{ color: card.extraColor }}
              >
                {card.extra}
              </span>
            )}
            {card.isGoal && (
              <ProgressBar
                value={stats.goalProgress}
                max={100}
                color={phaseColor ? `bg-[${phaseColor}]` : undefined}
                height="h-1.5"
              />
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="bg-bg-tertiary/30 rounded-lg p-4">
          <h4 className="text-xs font-bold uppercase tracking-wide text-text-muted mb-3">
            Weight History
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={['dataMin - 2', 'dataMax + 2']}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Bar
                  dataKey="weight"
                  fill={phaseColor || '#3B82F6'}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* BMI scale */}
      {stats.currentBmi > 0 && (
        <div className="bg-bg-tertiary/30 rounded-lg p-4">
          <h4 className="text-xs font-bold uppercase tracking-wide text-text-muted mb-3">
            BMI Scale
          </h4>
          <div className="relative">
            <div
              className="h-3 rounded-full w-full"
              style={{
                background:
                  'linear-gradient(to right, #60A5FA 0%, #10B981 27%, #F59E0B 47%, #F97316 67%, #EF4444 100%)',
              }}
            />
            {/* Position marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
              style={{
                left: `calc(${bmiPosition}% - 8px)`,
                backgroundColor: bmiColor(stats.currentBmi),
              }}
            />
            <div className="flex justify-between mt-1.5 text-[10px] text-text-muted">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
              <span>40</span>
            </div>
          </div>
        </div>
      )}

      {/* Log form */}
      <div className="bg-bg-tertiary/30 rounded-lg p-4 border border-border-primary">
        <h4 className="text-xs font-bold uppercase tracking-wide text-text-muted mb-3">
          Log Weight
        </h4>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-[10px] text-text-muted uppercase mb-0.5">
              Weight (kg)
            </label>
            <input
              type="number"
              step={0.1}
              min={0}
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="e.g., 105.5"
              className="w-full px-3 py-2 text-sm rounded-lg bg-bg-tertiary border border-border-primary text-text-primary outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] text-text-muted uppercase mb-0.5">
              Note (optional)
            </label>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="e.g., after morning fast"
              className="w-full px-3 py-2 text-sm rounded-lg bg-bg-tertiary border border-border-primary text-text-primary outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <Button
              size="md"
              icon={<Plus size={16} />}
              onClick={handleLog}
              disabled={!newWeight}
            >
              Log
            </Button>
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wide text-text-muted">
            History
          </h4>
          {history.map((entry, i) => {
            const entryBmi = bmi(entry.weight, userHeight);
            const prevEntry = history[i + 1]; // i+1 because sorted newest-first
            const change = prevEntry
              ? entry.weight - prevEntry.weight
              : 0;

            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 bg-bg-tertiary/30 rounded-lg px-3 py-2"
              >
                <span className="text-xs text-text-muted font-mono w-20 shrink-0">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>

                <span className="font-mono text-sm font-bold text-text-primary tabular-nums">
                  {entry.weight.toFixed(1)} kg
                </span>

                <Badge
                  size="sm"
                  color={`text-white`}
                >
                  <span style={{ color: bmiColor(entryBmi) }}>
                    BMI {entryBmi}
                  </span>
                </Badge>

                {change !== 0 && (
                  <span
                    className={[
                      'text-xs font-mono tabular-nums',
                      change < 0 ? 'text-emerald-400' : 'text-red-400',
                    ].join(' ')}
                  >
                    {change > 0 ? '+' : ''}
                    {change.toFixed(1)}
                  </span>
                )}

                {entry.note && (
                  <span className="text-xs text-text-muted truncate flex-1">
                    {entry.note}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
