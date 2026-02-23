import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Dumbbell, UtensilsCrossed, BookOpen, ArrowRight } from 'lucide-react';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { EXERCISE_DB } from '@/data/exercises';
import { BASE_RECIPES } from '@/data/recipes';
import { WORKOUT_LIBRARY } from '@/data/workouts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SearchResult {
  id: string;
  category: 'exercise' | 'recipe' | 'workout';
  name: string;
  subtitle: string;
  route: string;
}

// ---------------------------------------------------------------------------
// Fuzzy matching helper
// ---------------------------------------------------------------------------

/**
 * Simple fuzzy match: checks if every character in `pattern` appears in
 * `text` in order (case-insensitive). Returns true plus a rough score
 * (lower is better) when matched; false otherwise.
 */
function fuzzyMatch(pattern: string, text: string): { match: boolean; score: number } {
  const p = pattern.toLowerCase();
  const t = text.toLowerCase();

  // Fast path: substring match is the best kind of match
  const substringIdx = t.indexOf(p);
  if (substringIdx !== -1) {
    return { match: true, score: substringIdx };
  }

  let pi = 0;
  let gap = 0;
  for (let ti = 0; ti < t.length && pi < p.length; ti++) {
    if (t[ti] === p[pi]) {
      pi++;
    } else if (pi > 0) {
      gap++;
    }
  }

  if (pi === p.length) {
    return { match: true, score: 100 + gap };
  }
  return { match: false, score: Infinity };
}

// ---------------------------------------------------------------------------
// Build search index (stable reference)
// ---------------------------------------------------------------------------

function buildSearchItems(): SearchResult[] {
  const exercises: SearchResult[] = EXERCISE_DB.map((ex) => ({
    id: `ex-${ex.id}`,
    category: 'exercise' as const,
    name: ex.name,
    subtitle: `${ex.equipment} -- ${ex.primaryMuscles.join(', ')}`,
    route: '/library',
  }));

  const recipes: SearchResult[] = BASE_RECIPES.map((r) => ({
    id: `recipe-${r.id}`,
    category: 'recipe' as const,
    name: `${r.emoji} ${r.name}`,
    subtitle: `${r.kcal} kcal -- P${r.protein} C${r.carbs} F${r.fat}`,
    route: '/nutrition',
  }));

  const workouts: SearchResult[] = WORKOUT_LIBRARY.map((w) => ({
    id: `workout-${w.id}`,
    category: 'workout' as const,
    name: w.label,
    subtitle: `${w.mode.label} -- ${w.difficulty} -- ${w.muscles.join(', ')}`,
    route: '/workouts',
  }));

  return [...exercises, ...recipes, ...workouts];
}

// ---------------------------------------------------------------------------
// Category presentation helpers
// ---------------------------------------------------------------------------

const CATEGORY_META: Record<
  SearchResult['category'],
  { label: string; Icon: typeof Dumbbell }
> = {
  exercise: { label: 'Exercises', Icon: Dumbbell },
  recipe: { label: 'Recipes', Icon: UtensilsCrossed },
  workout: { label: 'Workouts', Icon: BookOpen },
};

const MAX_RESULTS_PER_CATEGORY = 5;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ---- Keyboard shortcut to open / close ----
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  useKeyboardShortcut('k', toggle, { ctrl: true });

  // ---- Build the static search index once ----
  const allItems = useMemo(() => buildSearchItems(), []);

  // ---- Filter results based on query ----
  const grouped = useMemo(() => {
    if (query.trim().length === 0) return {} as Record<SearchResult['category'], SearchResult[]>;

    const scored = allItems
      .map((item) => {
        const { match, score } = fuzzyMatch(query, item.name);
        return { item, match, score };
      })
      .filter((r) => r.match)
      .sort((a, b) => a.score - b.score);

    const groups: Partial<Record<SearchResult['category'], SearchResult[]>> = {};
    for (const { item } of scored) {
      const list = groups[item.category] ?? [];
      if (list.length < MAX_RESULTS_PER_CATEGORY) {
        list.push(item);
        groups[item.category] = list;
      }
    }
    return groups as Record<SearchResult['category'], SearchResult[]>;
  }, [query, allItems]);

  // Flat list for keyboard navigation
  const flatResults = useMemo(() => {
    const ordered: SearchResult[] = [];
    for (const cat of ['exercise', 'recipe', 'workout'] as const) {
      if (grouped[cat]) ordered.push(...grouped[cat]);
    }
    return ordered;
  }, [grouped]);

  // ---- Reset state on open / close ----
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Small delay so the DOM is ready
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // ---- Scroll the selected item into view ----
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const el = container.querySelector<HTMLElement>('[data-selected="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // ---- Keyboard navigation inside the palette ----
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (flatResults[selectedIndex]) {
            navigate(flatResults[selectedIndex].route);
            setIsOpen(false);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    },
    [flatResults, selectedIndex, navigate],
  );

  // Reset selection whenever the query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // ---- Render helpers ----
  const handleSelect = (result: SearchResult) => {
    navigate(result.route);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  let runningIndex = -1;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Palette */}
      <div
        className="relative w-full max-w-lg rounded-xl border border-border-primary bg-bg-primary/95 shadow-2xl backdrop-blur-md"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border-primary px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exercises, recipes, workouts..."
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-sm"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-text-muted hover:text-text-secondary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center rounded border border-border-primary bg-bg-tertiary px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto overscroll-contain p-2">
          {query.trim().length === 0 && (
            <p className="py-8 text-center text-sm text-text-muted">
              Start typing to search...
            </p>
          )}

          {query.trim().length > 0 && flatResults.length === 0 && (
            <p className="py-8 text-center text-sm text-text-muted">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {(['exercise', 'recipe', 'workout'] as const).map((cat) => {
            const items = grouped[cat];
            if (!items || items.length === 0) return null;
            const { label, Icon } = CATEGORY_META[cat];

            return (
              <div key={cat} className="mb-2">
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <Icon className="h-3.5 w-3.5 text-text-muted" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    {label}
                  </span>
                </div>

                {items.map((result) => {
                  runningIndex++;
                  const idx = runningIndex;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={result.id}
                      type="button"
                      data-selected={isSelected}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        isSelected
                          ? 'bg-bg-secondary text-text-primary'
                          : 'text-text-secondary hover:bg-bg-secondary/60'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{result.name}</p>
                        <p className="truncate text-xs text-text-muted">{result.subtitle}</p>
                      </div>
                      {isSelected && (
                        <ArrowRight className="h-4 w-4 shrink-0 text-text-muted" />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        {flatResults.length > 0 && (
          <div className="flex items-center gap-4 border-t border-border-primary px-4 py-2 text-[11px] text-text-muted">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border-primary bg-bg-tertiary px-1 py-0.5 font-mono text-[10px]">&uarr;</kbd>
              <kbd className="rounded border border-border-primary bg-bg-tertiary px-1 py-0.5 font-mono text-[10px]">&darr;</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border-primary bg-bg-tertiary px-1 py-0.5 font-mono text-[10px]">&crarr;</kbd>
              open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border-primary bg-bg-tertiary px-1 py-0.5 font-mono text-[10px]">esc</kbd>
              close
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
