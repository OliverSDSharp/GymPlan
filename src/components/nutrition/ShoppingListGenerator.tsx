import { useState, useMemo, useCallback } from 'react';
import {
  ShoppingCart,
  Check,
  Copy,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
} from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import { BASE_RECIPES } from '@/data/recipes';
import { mealPlans } from '@/data/meal-plans';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ShoppingListGeneratorProps {
  phaseId: number;
  dayType: string;
  phaseColor: string;
}

interface ParsedIngredient {
  name: string;
  quantity: string;
  unit: string;
}

interface AggregatedItem {
  name: string;
  displayName: string;
  entries: { quantity: number; unit: string }[];
  category: IngredientCategory;
}

type IngredientCategory =
  | 'Proteins'
  | 'Grains'
  | 'Dairy'
  | 'Produce'
  | 'Pantry'
  | 'Other';

/* ------------------------------------------------------------------ */
/*  Category classification                                            */
/* ------------------------------------------------------------------ */

const CATEGORY_KEYWORDS: Record<IngredientCategory, string[]> = {
  Proteins: [
    'chicken', 'beef', 'turkey', 'salmon', 'tuna', 'eggs', 'egg',
    'shrimp', 'pork', 'tofu', 'whey', 'protein', 'prawns', 'lamb',
    'cod', 'fish', 'mince', 'steak', 'duck', 'mackerel', 'sea bass',
  ],
  Grains: [
    'rice', 'oats', 'bread', 'pasta', 'tortilla', 'quinoa', 'flour',
    'cereal', 'noodles', 'couscous', 'bagel', 'wrap', 'flatbread',
    'crackers', 'rice cakes', 'breadcrumbs', 'bun',
  ],
  Dairy: [
    'milk', 'cheese', 'yogurt', 'yoghurt', 'cream', 'butter',
    'cottage cheese', 'feta', 'halloumi', 'mozzarella', 'parmesan',
    'cream cheese',
  ],
  Produce: [
    'spinach', 'broccoli', 'avocado', 'banana', 'berries', 'tomato',
    'tomatoes', 'onion', 'garlic', 'pepper', 'lettuce', 'apple',
    'lemon', 'lime', 'potato', 'sweet potato', 'zucchini', 'courgette',
    'cucumber', 'carrot', 'celery', 'asparagus', 'peas', 'beetroot',
    'rocket', 'pineapple', 'ginger', 'chilli', 'corn', 'bean',
    'edamame', 'bok choy', 'parsnip', 'mushroom',
  ],
  Pantry: [
    'oil', 'honey', 'salt', 'pepper', 'sauce', 'vinegar', 'sugar',
    'spice', 'cinnamon', 'vanilla', 'paprika', 'cumin', 'oregano',
    'soy sauce', 'sesame', 'baking powder', 'cocoa', 'chocolate',
    'peanut butter', 'mustard', 'stock', 'passata', 'paste',
    'herbs', 'dill', 'parsley', 'coriander', 'thyme', 'rosemary',
    'cayenne', 'turmeric', 'garam masala', 'chilli flakes',
    'fish sauce', 'mirin', 'miso', 'capers', 'olives', 'hoisin',
    'chickpeas', 'black beans', 'lentils', 'hummus',
  ],
  Other: [],
};

const CATEGORY_EMOJI: Record<IngredientCategory, string> = {
  Proteins: '\uD83E\uDD69',
  Grains: '\uD83C\uDF3E',
  Dairy: '\uD83E\uDDC0',
  Produce: '\uD83E\uDD66',
  Pantry: '\uD83E\uDED9',
  Other: '\uD83D\uDCE6',
};

const CATEGORY_ORDER: IngredientCategory[] = [
  'Proteins',
  'Grains',
  'Dairy',
  'Produce',
  'Pantry',
  'Other',
];

function categorize(ingredientName: string): IngredientCategory {
  const lower = ingredientName.toLowerCase();

  for (const cat of CATEGORY_ORDER) {
    if (cat === 'Other') continue;
    const keywords = CATEGORY_KEYWORDS[cat];
    for (const kw of keywords) {
      if (lower.includes(kw)) return cat;
    }
  }
  return 'Other';
}

/* ------------------------------------------------------------------ */
/*  CookLang parser                                                    */
/* ------------------------------------------------------------------ */

const INGREDIENT_RE = /@([^{]+)\{([^%]*)%?([^}]*)\}/g;

function parseIngredients(cookText: string): ParsedIngredient[] {
  const results: ParsedIngredient[] = [];
  let match: RegExpExecArray | null;

  // Reset lastIndex for safety
  INGREDIENT_RE.lastIndex = 0;

  while ((match = INGREDIENT_RE.exec(cookText)) !== null) {
    const name = match[1].trim();
    const quantity = match[2].trim();
    const unit = match[3].trim();
    if (name) {
      results.push({ name, quantity, unit });
    }
  }

  return results;
}

/* ------------------------------------------------------------------ */
/*  Quantity parsing and aggregation helpers                            */
/* ------------------------------------------------------------------ */

function parseQuantity(q: string): number {
  if (!q) return 1;

  // Handle fractions like "1/2" or "½"
  const fractionMap: Record<string, number> = {
    '\u00BC': 0.25,
    '\u00BD': 0.5,
    '\u00BE': 0.75,
  };

  let cleaned = q;
  for (const [frac, val] of Object.entries(fractionMap)) {
    if (cleaned.includes(frac)) {
      // If there's a number before the fraction char, add it
      const before = cleaned.replace(frac, '').trim();
      const base = before ? parseFloat(before) || 0 : 0;
      return base + val;
    }
  }

  // Handle "1/2" style fractions
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/');
    const numerator = parseFloat(parts[0]);
    const denominator = parseFloat(parts[1]);
    if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
      return numerator / denominator;
    }
  }

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 1 : parsed;
}

function formatQuantity(num: number): string {
  if (num === Math.floor(num)) return String(num);
  return num.toFixed(1).replace(/\.0$/, '');
}

function aggregateIngredients(
  ingredients: ParsedIngredient[],
  days: number,
): AggregatedItem[] {
  const map = new Map<string, AggregatedItem>();

  for (const ing of ingredients) {
    const key = ing.name.toLowerCase();
    const qty = parseQuantity(ing.quantity) * days;
    const unit = ing.unit;

    if (!map.has(key)) {
      map.set(key, {
        name: key,
        displayName: ing.name,
        entries: [],
        category: categorize(ing.name),
      });
    }

    const item = map.get(key)!;

    // Try to merge with an existing entry of the same unit
    const existing = item.entries.find((e) => e.unit === unit);
    if (existing) {
      existing.quantity += qty;
    } else {
      item.entries.push({ quantity: qty, unit });
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.displayName.localeCompare(b.displayName),
  );
}

function formatItemQuantity(item: AggregatedItem): string {
  if (item.entries.length === 0) return '';

  return item.entries
    .map((e) => {
      const q = formatQuantity(e.quantity);
      if (!e.unit && q === '1') return '';
      if (!e.unit) return q;
      return `${q} ${e.unit}`;
    })
    .filter(Boolean)
    .join(' + ');
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ShoppingListGenerator({
  phaseId,
  dayType,
  phaseColor,
}: ShoppingListGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [days, setDays] = useState(7);
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useStorage<string[]>(
    `shopping-checked-${phaseId}-${dayType}`,
    [],
  );
  const [collapsedCategories, setCollapsedCategories] = useState<
    Set<IngredientCategory>
  >(new Set());

  // Find the matching meal plan
  const mealPlan = useMemo(
    () => mealPlans.find((mp) => mp.phaseId === phaseId && mp.dayType === dayType),
    [phaseId, dayType],
  );

  // Parse all ingredients from the meal plan's recipes
  const allIngredients = useMemo(() => {
    if (!mealPlan) return [];

    const ingredients: ParsedIngredient[] = [];

    for (const meal of mealPlan.meals) {
      const recipe = BASE_RECIPES.find((r) => r.id === meal.recipeId);
      if (recipe) {
        const parsed = parseIngredients(recipe.cook);
        ingredients.push(...parsed);
      }
    }

    return ingredients;
  }, [mealPlan]);

  // Aggregate with day multiplier
  const aggregated = useMemo(
    () => aggregateIngredients(allIngredients, days),
    [allIngredients, days],
  );

  // Group by category
  const groupedItems = useMemo(() => {
    const groups = new Map<IngredientCategory, AggregatedItem[]>();

    for (const cat of CATEGORY_ORDER) {
      groups.set(cat, []);
    }

    for (const item of aggregated) {
      const list = groups.get(item.category) ?? groups.get('Other')!;
      list.push(item);
    }

    // Remove empty categories
    for (const [cat, items] of groups) {
      if (items.length === 0) groups.delete(cat);
    }

    return groups;
  }, [aggregated]);

  const totalItems = aggregated.length;
  const checkedCount = checkedItems.length;

  const toggleCheck = useCallback(
    (itemName: string) => {
      setCheckedItems((prev) =>
        prev.includes(itemName)
          ? prev.filter((n) => n !== itemName)
          : [...prev, itemName],
      );
    },
    [setCheckedItems],
  );

  const toggleCategory = useCallback((cat: IngredientCategory) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);

  const clearChecked = useCallback(() => {
    setCheckedItems([]);
  }, [setCheckedItems]);

  const copyToClipboard = useCallback(async () => {
    const lines: string[] = [];
    lines.push(
      `Shopping List - ${mealPlan?.title ?? 'Meal Plan'} (${days} day${days > 1 ? 's' : ''})`,
    );
    lines.push('');

    for (const [cat, items] of groupedItems) {
      lines.push(`${CATEGORY_EMOJI[cat]} ${cat}`);
      for (const item of items) {
        const qty = formatItemQuantity(item);
        const checked = checkedItems.includes(item.name);
        const prefix = checked ? '[x]' : '[ ]';
        lines.push(`  ${prefix} ${item.displayName}${qty ? ` - ${qty}` : ''}`);
      }
      lines.push('');
    }

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [groupedItems, checkedItems, days, mealPlan]);

  if (!mealPlan) {
    return null;
  }

  return (
    <div className="bg-bg-secondary rounded-xl border border-border-primary overflow-hidden">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-bg-tertiary/30"
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${phaseColor}20` }}
        >
          <ShoppingCart size={18} style={{ color: phaseColor }} />
        </div>

        <div className="flex-1 min-w-0">
          <span className="font-heading font-bold text-sm text-text-primary">
            Generate Shopping List
          </span>
          <p className="text-xs text-text-muted mt-0.5">
            {mealPlan.meals.length} meals per day &middot; auto-aggregated
            ingredients
          </p>
        </div>

        {isOpen ? (
          <ChevronUp size={18} className="text-text-muted shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-text-muted shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-4 border-t border-border-primary pt-4">
          {/* Day selector */}
          <div className="flex items-center justify-between gap-4">
            <label className="text-xs font-bold uppercase tracking-wide text-text-muted">
              Days of meals
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDays((d) => Math.max(1, d - 1))}
                disabled={days <= 1}
                className="w-7 h-7 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-mono text-sm font-semibold text-text-primary tabular-nums">
                {days}
              </span>
              <button
                type="button"
                onClick={() => setDays((d) => Math.min(7, d + 1))}
                disabled={days >= 7}
                className="w-7 h-7 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Progress + actions bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Check size={14} />
              <span className="font-mono tabular-nums">
                {checkedCount}/{totalItems}
              </span>
              <span>items checked</span>
            </div>

            <div className="flex items-center gap-2">
              {checkedCount > 0 && (
                <button
                  type="button"
                  onClick={clearChecked}
                  className="px-2 py-1 text-[10px] uppercase tracking-wide rounded-md bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors"
                >
                  Clear checks
                </button>
              )}
              <button
                type="button"
                onClick={copyToClipboard}
                className={[
                  'flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wide rounded-md transition-colors',
                  copied
                    ? ''
                    : 'bg-bg-tertiary text-text-muted hover:text-text-primary',
                ].join(' ')}
                style={
                  copied
                    ? { backgroundColor: `${phaseColor}30`, color: phaseColor }
                    : undefined
                }
              >
                {copied ? (
                  <>
                    <CheckCheck size={12} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy list
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {totalItems > 0 && (
            <div className="h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(checkedCount / totalItems) * 100}%`,
                  backgroundColor: phaseColor,
                }}
              />
            </div>
          )}

          {/* Categorized ingredient list */}
          <div className="space-y-3">
            {CATEGORY_ORDER.filter((cat) => groupedItems.has(cat)).map(
              (cat) => {
                const items = groupedItems.get(cat)!;
                const isCollapsed = collapsedCategories.has(cat);
                const catCheckedCount = items.filter((item) =>
                  checkedItems.includes(item.name),
                ).length;

                return (
                  <div
                    key={cat}
                    className="bg-bg-tertiary/30 rounded-lg border border-border-primary overflow-hidden"
                  >
                    {/* Category header */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-bg-tertiary/50 transition-colors"
                    >
                      <span className="text-base">{CATEGORY_EMOJI[cat]}</span>
                      <span className="flex-1 text-xs font-bold uppercase tracking-wide text-text-primary">
                        {cat}
                      </span>
                      <span className="text-[10px] font-mono tabular-nums text-text-muted">
                        {catCheckedCount}/{items.length}
                      </span>
                      {isCollapsed ? (
                        <ChevronDown
                          size={14}
                          className="text-text-muted shrink-0"
                        />
                      ) : (
                        <ChevronUp
                          size={14}
                          className="text-text-muted shrink-0"
                        />
                      )}
                    </button>

                    {/* Items */}
                    {!isCollapsed && (
                      <div className="px-3 pb-2 space-y-0.5">
                        {items.map((item) => {
                          const isChecked = checkedItems.includes(item.name);
                          const qty = formatItemQuantity(item);

                          return (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => toggleCheck(item.name)}
                              className={[
                                'w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-left transition-colors',
                                isChecked
                                  ? 'opacity-50'
                                  : 'hover:bg-bg-tertiary/60',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors',
                                  isChecked
                                    ? 'border-transparent'
                                    : 'border-border-primary bg-bg-tertiary',
                                ].join(' ')}
                                style={
                                  isChecked
                                    ? { backgroundColor: phaseColor }
                                    : undefined
                                }
                              >
                                {isChecked && (
                                  <Check
                                    size={10}
                                    className="text-white"
                                    strokeWidth={3}
                                  />
                                )}
                              </div>

                              <span
                                className={[
                                  'flex-1 text-sm',
                                  isChecked
                                    ? 'line-through text-text-muted'
                                    : 'text-text-primary',
                                ].join(' ')}
                              >
                                {item.displayName}
                              </span>

                              {qty && (
                                <span className="text-xs font-mono tabular-nums text-text-secondary shrink-0">
                                  {qty}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>

          {/* Empty state */}
          {totalItems === 0 && (
            <div className="text-center py-6">
              <ShoppingCart
                size={32}
                className="mx-auto text-text-muted mb-2"
              />
              <p className="text-sm text-text-muted">
                No ingredients found for this meal plan.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
