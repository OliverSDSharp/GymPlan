import { useState, useMemo } from 'react';
import { Modal } from '@/components/common/Modal';
import { SearchInput } from '@/components/common/SearchInput';
import { Badge } from '@/components/common/Badge';
import type { Recipe } from '@/types';

interface MealSwapModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (recipeId: string) => void;
  recipes: Recipe[];
  phaseColor?: string;
}

const CATEGORIES = ['all', 'breakfast', 'lunch', 'dinner', 'snack', 'post-workout'] as const;

export function MealSwapModal({
  open,
  onClose,
  onSelect,
  recipes,
  phaseColor,
}: MealSwapModalProps) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('all');

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const matchCat = activeCat === 'all' || r.category === activeCat;
      const matchQuery =
        !query || r.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [recipes, activeCat, query]);

  const handleSelect = (recipeId: string) => {
    onSelect(recipeId);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Swap Meal">
      <div className="space-y-4">
        {/* Search */}
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search recipes..."
        />

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCat(cat)}
              className={[
                'px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize',
                activeCat === cat
                  ? 'text-white'
                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary',
              ].join(' ')}
              style={
                activeCat === cat
                  ? { backgroundColor: phaseColor || '#3B82F6' }
                  : undefined
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Recipe list */}
        <div className="max-h-[400px] overflow-y-auto space-y-1 -mx-1 px-1">
          {filtered.length === 0 && (
            <p className="text-sm text-text-muted text-center py-8">
              No recipes found.
            </p>
          )}
          {filtered.map((recipe) => (
            <button
              key={recipe.id}
              type="button"
              onClick={() => handleSelect(recipe.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-bg-tertiary transition-colors group"
            >
              <span className="text-xl shrink-0">{recipe.emoji}</span>

              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-text-primary group-hover:text-white truncate block">
                  {recipe.name}
                </span>
              </div>

              <Badge size="sm">{recipe.category}</Badge>

              <div className="hidden sm:flex items-center gap-2 text-xs font-mono tabular-nums shrink-0">
                <span className="text-macro-protein">
                  P {recipe.protein}g
                </span>
                <span className="text-text-muted">/</span>
                <span className="text-macro-carbs">
                  C {recipe.carbs}g
                </span>
                <span className="text-text-muted">/</span>
                <span className="text-macro-kcal">
                  {recipe.kcal} kcal
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
