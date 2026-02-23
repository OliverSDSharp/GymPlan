import { useState, useMemo } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import { Button } from '@/components/common/Button';
import { ProgressBar } from '@/components/common/ProgressBar';
import { SearchInput } from '@/components/common/SearchInput';
import { Badge } from '@/components/common/Badge';
import { generateId } from '@/utils/helpers';
import { phaseNutrition } from '@/data/nutrition';
import type { IntakeEntry, Recipe } from '@/types';

interface IntakeTrackerProps {
  phaseId: number;
  dayType: string;
  phaseColor: string;
  recipes?: Recipe[];
}

const todayKey = () => `intake_${new Date().toISOString().slice(0, 10)}`;

export function IntakeTracker({
  phaseId,
  dayType,
  phaseColor,
  recipes = [],
}: IntakeTrackerProps) {
  const [entries, setEntries] = useStorage<IntakeEntry[]>(todayKey(), []);
  const [showAdd, setShowAdd] = useState(false);
  const [addMode, setAddMode] = useState<'recipe' | 'manual'>('recipe');

  // Recipe mode state
  const [recipeQuery, setRecipeQuery] = useState('');
  const [selRecipeId, setSelRecipeId] = useState<string | null>(null);
  const [portion, setPortion] = useState(1);

  // Manual mode state
  const [manualName, setManualName] = useState('');
  const [manualKcal, setManualKcal] = useState(0);
  const [manualProtein, setManualProtein] = useState(0);
  const [manualCarbs, setManualCarbs] = useState(0);
  const [manualFat, setManualFat] = useState(0);

  // Calculate targets from phaseNutrition
  const targets = useMemo(() => {
    const pn = phaseNutrition.find((n) => n.phase === phaseId);
    if (!pn) return { kcal: 2400, protein: 180, carbs: 220, fat: 70 };

    if (dayType === 'refeed' && pn.refeedDay) return pn.refeedDay;
    if (dayType === 'rest' && pn.restDay) return pn.restDay;
    return pn.trainDay;
  }, [phaseId, dayType]);

  // Totals
  const totals = useMemo(() => {
    return entries.reduce(
      (acc, e) => ({
        kcal: acc.kcal + e.kcal,
        protein: acc.protein + e.protein,
        carbs: acc.carbs + e.carbs,
        fat: acc.fat + e.fat,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }, [entries]);

  const filteredRecipes = useMemo(() => {
    if (!recipeQuery) return recipes.slice(0, 20);
    return recipes.filter((r) =>
      r.name.toLowerCase().includes(recipeQuery.toLowerCase()),
    );
  }, [recipes, recipeQuery]);

  const handleAddRecipe = () => {
    if (!selRecipeId) return;
    const r = recipes.find((x) => x.id === selRecipeId);
    if (!r) return;

    const entry: IntakeEntry = {
      id: generateId(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: r.name,
      emoji: r.emoji,
      kcal: Math.round(r.kcal * portion),
      protein: Math.round(r.protein * portion),
      carbs: Math.round(r.carbs * portion),
      fat: Math.round(r.fat * portion),
      recipeId: r.id,
      portion,
    };

    setEntries((prev) => [...prev, entry]);
    setSelRecipeId(null);
    setPortion(1);
    setRecipeQuery('');
    setShowAdd(false);
  };

  const handleAddManual = () => {
    if (!manualName.trim()) return;

    const entry: IntakeEntry = {
      id: generateId(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: manualName.trim(),
      kcal: manualKcal,
      protein: manualProtein,
      carbs: manualCarbs,
      fat: manualFat,
    };

    setEntries((prev) => [...prev, entry]);
    setManualName('');
    setManualKcal(0);
    setManualProtein(0);
    setManualCarbs(0);
    setManualFat(0);
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const macroCards: { label: string; key: keyof typeof totals; color: string; bgColor: string }[] = [
    { label: 'Calories', key: 'kcal', color: 'text-macro-kcal', bgColor: 'bg-macro-kcal' },
    { label: 'Protein', key: 'protein', color: 'text-macro-protein', bgColor: 'bg-macro-protein' },
    { label: 'Carbs', key: 'carbs', color: 'text-macro-carbs', bgColor: 'bg-macro-carbs' },
    { label: 'Fat', key: 'fat', color: 'text-macro-fat', bgColor: 'bg-macro-fat' },
  ];

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-text-primary">
            Today's Intake
          </h3>
          <p className="text-xs text-text-muted">{formattedDate}</p>
        </div>
      </div>

      {/* Macro summary grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {macroCards.map((macro) => (
          <div
            key={macro.key}
            className="bg-bg-tertiary/50 rounded-lg p-3 flex flex-col gap-1.5"
          >
            <span className="text-[10px] text-text-muted uppercase tracking-wide">
              {macro.label}
            </span>
            <span className={`font-mono text-sm font-semibold tabular-nums ${macro.color}`}>
              {Math.round(totals[macro.key])}
              <span className="text-text-muted font-normal">
                {' '}/ {Math.round(targets[macro.key])}
              </span>
            </span>
            <ProgressBar
              value={totals[macro.key]}
              max={targets[macro.key]}
              color={macro.bgColor}
              height="h-1.5"
            />
          </div>
        ))}
      </div>

      {/* Log Food button */}
      <Button
        variant="secondary"
        size="sm"
        fullWidth
        icon={<Plus size={16} />}
        onClick={() => setShowAdd(!showAdd)}
        className="border-dashed"
      >
        {showAdd ? 'Close' : 'Log Food'}
      </Button>

      {/* Add panel */}
      {showAdd && (
        <div className="bg-bg-tertiary/30 rounded-lg p-4 border border-border-primary space-y-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {(['recipe', 'manual'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setAddMode(m)}
                className={[
                  'px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize',
                  addMode === m
                    ? 'text-white'
                    : 'bg-bg-tertiary text-text-secondary hover:text-text-primary',
                ].join(' ')}
                style={
                  addMode === m
                    ? { backgroundColor: phaseColor }
                    : undefined
                }
              >
                {m}
              </button>
            ))}
          </div>

          {addMode === 'recipe' ? (
            <div className="space-y-3">
              <SearchInput
                value={recipeQuery}
                onChange={setRecipeQuery}
                placeholder="Search recipes..."
              />

              <div className="max-h-[200px] overflow-y-auto space-y-1">
                {filteredRecipes.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelRecipeId(r.id)}
                    className={[
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors',
                      selRecipeId === r.id
                        ? 'bg-blue-600/20 border border-blue-500/30'
                        : 'hover:bg-bg-tertiary',
                    ].join(' ')}
                  >
                    <span className="shrink-0">{r.emoji}</span>
                    <span className="flex-1 truncate text-text-primary">{r.name}</span>
                    <span className="text-xs font-mono text-text-muted">
                      {r.kcal} kcal
                    </span>
                  </button>
                ))}
              </div>

              {selRecipeId && (
                <div className="space-y-2">
                  <label className="block text-xs text-text-muted uppercase tracking-wide">
                    Portion
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0.25}
                      max={3}
                      step={0.25}
                      value={portion}
                      onChange={(e) => setPortion(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono text-text-primary w-12 text-right">
                      {portion}x
                    </span>
                  </div>
                  <Button size="sm" onClick={handleAddRecipe}>
                    Add
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Food name"
                className="w-full px-3 py-2 text-sm rounded-lg bg-bg-tertiary border border-border-primary text-text-primary outline-none focus:border-blue-500"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {([
                  { label: 'Kcal', value: manualKcal, setter: setManualKcal },
                  { label: 'Protein', value: manualProtein, setter: setManualProtein },
                  { label: 'Carbs', value: manualCarbs, setter: setManualCarbs },
                  { label: 'Fat', value: manualFat, setter: setManualFat },
                ] as const).map((m) => (
                  <div key={m.label}>
                    <label className="block text-[10px] text-text-muted uppercase mb-0.5">
                      {m.label}
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={m.value}
                      onChange={(e) => m.setter(Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-sm rounded-lg bg-bg-tertiary border border-border-primary text-text-primary outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                onClick={handleAddManual}
                disabled={!manualName.trim()}
              >
                Add
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Logged entries list */}
      {entries.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wide text-text-muted">
            Logged Items
          </h4>
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 bg-bg-tertiary/30 rounded-lg px-3 py-2"
            >
              <span className="text-lg shrink-0">{entry.emoji || '\uD83C\uDF7D\uFE0F'}</span>

              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-text-primary truncate block">
                  {entry.name}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-text-muted">
                  <Clock size={10} />
                  {entry.time}
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-mono tabular-nums text-text-secondary">
                <span>{entry.kcal} kcal</span>
                <span className="text-text-muted">|</span>
                <span>P {entry.protein}g</span>
                <span className="text-text-muted">|</span>
                <span>C {entry.carbs}g</span>
                <span className="text-text-muted">|</span>
                <span>F {entry.fat}g</span>
              </div>

              {/* Mobile macros */}
              <div className="sm:hidden flex flex-col items-end text-[10px] font-mono tabular-nums text-text-muted">
                <span>{entry.kcal} kcal</span>
                <span>P{entry.protein} C{entry.carbs} F{entry.fat}</span>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(entry.id)}
                className="p-1 rounded text-text-muted hover:text-red-400 transition-colors shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
