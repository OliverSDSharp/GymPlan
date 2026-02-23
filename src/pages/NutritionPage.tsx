import { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { TabBar } from '../components/layout/TabBar';
import { MacroDisplay } from '../components/common/MacroDisplay';
import { SearchInput } from '../components/common/SearchInput';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { useAppStore } from '../context/AppContext';
import { phaseNutrition } from '../data/nutrition';
import { phaseColors } from '../utils/colors';
import {
  UtensilsCrossed,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRightLeft,
  RotateCcw,
  Upload,
  Sparkles,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { RecipeCard } from '../components/nutrition/RecipeCard';
import { CooklangImport } from '../components/nutrition/CooklangImport';
import { AIRecipeGenerator } from '../components/nutrition/AIRecipeGenerator';
import { IntakeTracker } from '../components/nutrition/IntakeTracker';
import { ShoppingListGenerator } from '../components/nutrition/ShoppingListGenerator';
import { MealSwapModal } from '../components/nutrition/MealSwapModal';
import { BASE_RECIPES } from '../data/recipes';
import { mealPlans } from '../data/meal-plans';
import type { Recipe, MealPlan } from '../types';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'meals', label: 'Meal Plan' },
  { key: 'recipes', label: 'Recipes' },
  { key: 'sources', label: 'Sources' },
];

const RECIPE_CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Post-Workout'];

export function NutritionPage() {
  const activePhase = useAppStore((s) => s.activePhase);
  const customRecipes = useAppStore((s) => s.customRecipes);
  const addCustomRecipe = useAppStore((s) => s.addCustomRecipe);
  const swappedMeals = useAppStore((s) => s.swappedMeals);
  const swapMeal = useAppStore((s) => s.swapMeal);
  const resetMeal = useAppStore((s) => s.resetMeal);

  const color = phaseColors[activePhase] ?? phaseColors[0];
  const nutrition = phaseNutrition[activePhase] ?? phaseNutrition[0];

  const [activeTab, setActiveTab] = useState('overview');
  const [dayType, setDayType] = useState<'train' | 'rest' | 'refeed'>('train');
  const [recipeCategory, setRecipeCategory] = useState('All');
  const [recipeSearch, setRecipeSearch] = useState('');
  const [showCooklangImport, setShowCooklangImport] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  // All recipes combined
  const allRecipes = useMemo(() => {
    return [...BASE_RECIPES, ...customRecipes];
  }, [customRecipes]);

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((r) => {
      const matchesCategory =
        recipeCategory === 'All' ||
        r.category.toLowerCase() === recipeCategory.toLowerCase();
      const matchesSearch =
        !recipeSearch ||
        r.name.toLowerCase().includes(recipeSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allRecipes, recipeCategory, recipeSearch]);

  // Get current meal plan
  const currentMealPlan = useMemo(() => {
    return mealPlans.find(
      (mp) =>
        mp.phaseId === (activePhase + 1) &&
        (mp.dayType === 'any' || mp.dayType.toLowerCase() === dayType),
    );
  }, [activePhase, dayType]);

  return (
    <div className="pb-4">
      <Header
        title="Nutrition"
        subtitle={nutrition.title}
        rightAction={
          <UtensilsCrossed size={20} className="text-text-muted" />
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
        {activeTab === 'overview' && (
          <OverviewTab nutrition={nutrition} color={color} />
        )}
        {activeTab === 'meals' && (
          <MealPlanTab
            nutrition={nutrition}
            color={color}
            dayType={dayType}
            setDayType={setDayType}
            currentMealPlan={currentMealPlan}
            allRecipes={allRecipes}
            swappedMeals={swappedMeals}
            swapMeal={swapMeal}
            resetMeal={resetMeal}
            activePhase={activePhase}
          />
        )}
        {activeTab === 'recipes' && (
          <RecipesTab
            filteredRecipes={filteredRecipes}
            recipeCategory={recipeCategory}
            setRecipeCategory={setRecipeCategory}
            recipeSearch={recipeSearch}
            setRecipeSearch={setRecipeSearch}
            showCooklangImport={showCooklangImport}
            setShowCooklangImport={setShowCooklangImport}
            showAIGenerator={showAIGenerator}
            setShowAIGenerator={setShowAIGenerator}
            color={color}
          />
        )}
        {activeTab === 'sources' && (
          <SourcesTab
            setShowCooklangImport={setShowCooklangImport}
            setActiveTab={setActiveTab}
          />
        )}
      </div>

      {/* Modals */}
      <CooklangImport
        open={showCooklangImport}
        onClose={() => setShowCooklangImport(false)}
        onSave={addCustomRecipe}
      />
      <AIRecipeGenerator
        open={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        onSave={addCustomRecipe}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview Tab
// ---------------------------------------------------------------------------

interface OverviewTabProps {
  nutrition: typeof phaseNutrition[number];
  color: string;
}

function OverviewTab({ nutrition, color }: OverviewTabProps) {
  return (
    <div className="px-4 space-y-4">
      {/* Approach card */}
      <div
        className="rounded-xl border p-4 space-y-2"
        style={{
          borderColor: `${color}40`,
          backgroundColor: `${color}08`,
        }}
      >
        <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-text-primary">
          {nutrition.approach}
        </h3>
        <p className="text-sm text-text-secondary">{nutrition.description}</p>
      </div>

      {/* Macro cards */}
      {nutrition.cycling ? (
        <div className="space-y-3">
          {/* Train Day */}
          <MacroCard
            title="Train Day"
            macros={nutrition.trainDay}
            color={color}
          />

          {/* Rest Day */}
          {nutrition.restDay && (
            <MacroCard
              title="Rest Day"
              macros={nutrition.restDay}
              color="#64748B"
            />
          )}

          {/* Refeed Day */}
          {nutrition.refeedDay && (
            <MacroCard
              title="Refeed Day"
              macros={nutrition.refeedDay}
              color="#10B981"
            />
          )}
        </div>
      ) : (
        <MacroCard
          title="Daily Targets"
          macros={nutrition.trainDay}
          color={color}
        />
      )}

      {/* Timing guidelines */}
      {nutrition.timing.length > 0 && (
        <div className="bg-bg-secondary rounded-xl border border-border-primary p-4 space-y-3">
          <h4 className="text-xs uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1.5">
            <Clock size={14} />
            Timing Guidelines
          </h4>
          <div className="space-y-2">
            {nutrition.timing.map((t, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="shrink-0 font-medium text-text-primary min-w-[120px]">
                  {t.time}
                </span>
                <span className="text-text-secondary">{t.tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key rules */}
      {nutrition.keyRules.length > 0 && (
        <div className="bg-bg-secondary rounded-xl border border-border-primary p-4 space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            Key Rules
          </h4>
          <ul className="space-y-1.5">
            {nutrition.keyRules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span
                  className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                  style={{ backgroundColor: color }}
                />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {nutrition.warnings.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-red-400 font-semibold flex items-center gap-1.5">
            <AlertTriangle size={14} />
            Warnings
          </h4>
          <ul className="space-y-1.5">
            {nutrition.warnings.map((w, i) => (
              <li key={i} className="text-sm text-red-300/80">
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Macro Card helper
// ---------------------------------------------------------------------------

function MacroCard({
  title,
  macros,
  color,
}: {
  title: string;
  macros: { kcal: number; protein: number; carbs: number; fat: number };
  color: string;
}) {
  return (
    <div className="bg-bg-secondary rounded-xl border border-border-primary p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <h4 className="font-medium text-sm text-text-primary">{title}</h4>
      </div>
      <MacroDisplay
        kcal={macros.kcal}
        protein={macros.protein}
        carbs={macros.carbs}
        fat={macros.fat}
        layout="grid"
        size="md"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meal Plan Tab
// ---------------------------------------------------------------------------

interface MealPlanTabProps {
  nutrition: typeof phaseNutrition[number];
  color: string;
  dayType: 'train' | 'rest' | 'refeed';
  setDayType: (t: 'train' | 'rest' | 'refeed') => void;
  currentMealPlan: MealPlan | undefined;
  allRecipes: Recipe[];
  swappedMeals: Record<string, string>;
  swapMeal: (key: string, recipeId: string) => void;
  resetMeal: (key: string) => void;
  activePhase: number;
}

function MealPlanTab({
  nutrition,
  color,
  dayType,
  setDayType,
  currentMealPlan,
  allRecipes,
  swappedMeals,
  swapMeal,
  resetMeal,
  activePhase,
}: MealPlanTabProps) {
  const [swapTarget, setSwapTarget] = useState<string | null>(null);

  const dayTypes = nutrition.cycling
    ? [
        { key: 'train' as const, label: 'Train Day' },
        { key: 'rest' as const, label: 'Rest Day' },
        ...(nutrition.refeedDay
          ? [{ key: 'refeed' as const, label: 'Refeed Day' }]
          : []),
      ]
    : [];

  return (
    <div className="px-4 space-y-4">
      {/* Day type toggle */}
      {dayTypes.length > 0 && (
        <div className="flex gap-2">
          {dayTypes.map((dt) => {
            const isActive = dt.key === dayType;
            return (
              <button
                key={dt.key}
                type="button"
                onClick={() => setDayType(dt.key)}
                className={[
                  'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border',
                  isActive
                    ? 'text-white border-transparent'
                    : 'bg-bg-secondary text-text-muted border-border-primary hover:text-text-secondary',
                ].join(' ')}
                style={isActive ? { backgroundColor: color } : undefined}
              >
                {dt.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Meal slots */}
      {currentMealPlan && currentMealPlan.meals.length > 0 ? (
        <div className="space-y-2">
          {currentMealPlan.meals.map((meal, idx) => {
            const swapKey = `${activePhase + 1}_${dayType}_${idx}`;
            const swappedRecipeId = swappedMeals[swapKey];
            const recipe = swappedRecipeId
              ? allRecipes.find((r) => r.id === swappedRecipeId)
              : allRecipes.find((r) => r.id === meal.recipeId);
            const isSwapped = !!swappedRecipeId;

            return (
              <div
                key={idx}
                className={[
                  'bg-bg-secondary rounded-xl border p-4 space-y-2',
                  isSwapped
                    ? 'border-orange-500/40'
                    : 'border-border-primary',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted font-mono">
                      {meal.time}
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      {meal.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSwapTarget(swapKey)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                      title="Swap meal"
                    >
                      <ArrowRightLeft size={14} />
                    </button>
                    {isSwapped && (
                      <button
                        type="button"
                        onClick={() => resetMeal(swapKey)}
                        className="p-1.5 rounded-lg text-orange-400 hover:text-orange-300 hover:bg-bg-tertiary transition-colors"
                        title="Reset to original"
                      >
                        <RotateCcw size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {recipe ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{recipe.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">
                        {recipe.name}
                      </p>
                      <MacroDisplay
                        kcal={recipe.kcal}
                        protein={recipe.protein}
                        carbs={recipe.carbs}
                        fat={recipe.fat}
                        size="sm"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-text-muted italic">
                    No recipe assigned
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<UtensilsCrossed size={40} />}
          title="No Meal Plan Yet"
          description="Meal plans will be available once recipes are configured for this phase."
        />
      )}

      {/* Shopping List Generator */}
      <ShoppingListGenerator
        phaseId={activePhase + 1}
        dayType={dayType}
        phaseColor={color}
      />

      {/* Meal Swap Modal */}
      <MealSwapModal
        open={!!swapTarget}
        onClose={() => setSwapTarget(null)}
        onSelect={(recipeId) => {
          if (swapTarget) {
            swapMeal(swapTarget, recipeId);
            setSwapTarget(null);
          }
        }}
        recipes={allRecipes}
        phaseColor={color}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recipes Tab
// ---------------------------------------------------------------------------

interface RecipesTabProps {
  filteredRecipes: Recipe[];
  recipeCategory: string;
  setRecipeCategory: (c: string) => void;
  recipeSearch: string;
  setRecipeSearch: (s: string) => void;
  showCooklangImport: boolean;
  setShowCooklangImport: (b: boolean) => void;
  showAIGenerator: boolean;
  setShowAIGenerator: (b: boolean) => void;
  color: string;
}

function RecipesTab({
  filteredRecipes,
  recipeCategory,
  setRecipeCategory,
  recipeSearch,
  setRecipeSearch,
  setShowCooklangImport,
  setShowAIGenerator,
  color,
}: RecipesTabProps) {
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);

  return (
    <div className="px-4 space-y-4">
      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {RECIPE_CATEGORIES.map((cat) => {
          const isActive = cat === recipeCategory;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setRecipeCategory(cat)}
              className={[
                'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
                isActive
                  ? 'text-white border-transparent'
                  : 'bg-bg-secondary text-text-muted border-border-primary hover:text-text-secondary',
              ].join(' ')}
              style={isActive ? { backgroundColor: color } : undefined}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <SearchInput
        value={recipeSearch}
        onChange={setRecipeSearch}
        placeholder="Search recipes..."
      />

      {/* Recipe count */}
      <p className="text-xs text-text-muted">
        {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
      </p>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={<Upload size={14} />}
          onClick={() => setShowCooklangImport(true)}
        >
          Import Recipe
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={<Sparkles size={14} />}
          onClick={() => setShowAIGenerator(true)}
        >
          AI Generate
        </Button>
      </div>

      {/* Recipe grid */}
      {filteredRecipes.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={40} />}
          title="No Recipes"
          description="Import or generate recipes to get started."
          action={
            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles size={14} />}
              onClick={() => setShowAIGenerator(true)}
            >
              Generate Recipe
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              expanded={expandedRecipeId === recipe.id}
              onToggle={() =>
                setExpandedRecipeId((prev) =>
                  prev === recipe.id ? null : recipe.id,
                )
              }
              phaseColor={color}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Inline fallback recipe card (used until RecipeCard component exists)
function RecipeCardFallback({ recipe }: { recipe: Recipe }) {
  return (
    <div className="bg-bg-secondary rounded-xl border border-border-primary p-4 space-y-2">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{recipe.emoji}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-text-primary truncate">
            {recipe.name}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge size="sm">{recipe.category}</Badge>
            <span className="text-[10px] text-text-muted">{recipe.time}</span>
            {recipe.prepFriendly && (
              <Badge size="sm" color="bg-emerald-500/20 text-emerald-400">
                Prep OK
              </Badge>
            )}
            {recipe.aiGenerated && (
              <Badge size="sm" color="bg-purple-500/20 text-purple-400">
                AI
              </Badge>
            )}
          </div>
        </div>
      </div>
      <MacroDisplay
        kcal={recipe.kcal}
        protein={recipe.protein}
        carbs={recipe.carbs}
        fat={recipe.fat}
        size="sm"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sources Tab
// ---------------------------------------------------------------------------

function SourcesTab({
  setShowCooklangImport,
  setActiveTab,
}: {
  setShowCooklangImport: (b: boolean) => void;
  setActiveTab: (t: string) => void;
}) {
  return (
    <div className="px-4 space-y-4">
      <div className="bg-bg-secondary rounded-xl border border-border-primary p-4 space-y-4">
        <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-text-primary">
          Recipe Sources
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="shrink-0 w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted">
              <BookOpen size={16} />
            </span>
            <div>
              <p className="text-sm font-medium text-text-primary">
                Cooklang Recipes
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Import recipes from .cook files using the Cooklang format.
                Great for structured recipe management.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="shrink-0 w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted">
              <Sparkles size={16} />
            </span>
            <div>
              <p className="text-sm font-medium text-text-primary">
                AI-Generated Recipes
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Use Claude AI to generate custom recipes based on your
                macro targets and dietary preferences.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="shrink-0 w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted">
              <ExternalLink size={16} />
            </span>
            <div>
              <p className="text-sm font-medium text-text-primary">
                Community Resources
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Explore community-contributed recipes and meal prep guides
                optimized for strength training and body recomposition.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="secondary"
        size="md"
        fullWidth
        icon={<Upload size={16} />}
        onClick={() => {
          setShowCooklangImport(true);
          setActiveTab('recipes');
        }}
      >
        Import a Recipe
      </Button>
    </div>
  );
}
