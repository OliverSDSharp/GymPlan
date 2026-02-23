import { useState } from 'react';
import { Sparkles, AlertCircle, Loader2, Settings } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { MacroDisplay } from '@/components/common/MacroDisplay';
import { CooklangDisplay } from './CooklangDisplay';
import { useAppStore } from '@/context/AppContext';
import { aiGenerate } from '@/utils/ai-client';
import { generateId } from '@/utils/helpers';
import type { Recipe } from '@/types';

interface AIRecipeGeneratorProps {
  open: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}

const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snack', 'post-workout'] as const;
const CUISINES = [
  'Mexican', 'Italian', 'Japanese', 'Chinese', 'Indian',
  'Mediterranean', 'Thai', 'American', 'Korean', 'Middle Eastern',
] as const;
const DIETS = ['none', 'high-protein', 'low-carb', 'keto', 'vegetarian', 'vegan'] as const;
const DAY_TYPES = ['any', 'training', 'rest', 'refeed'] as const;

interface GeneratedResult {
  name: string;
  emoji: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  cook: string;
}

export function AIRecipeGenerator({ open, onClose, onSave }: AIRecipeGeneratorProps) {
  const aiKeys = useAppStore((s) => s.aiKeys);
  const activeAIProvider = useAppStore((s) => s.activeAIProvider);
  const apiKey = aiKeys[activeAIProvider];

  const [category, setCategory] = useState<string>('lunch');
  const [cuisine, setCuisine] = useState<string>('Mediterranean');
  const [diet, setDiet] = useState<string>('none');
  const [dayType, setDayType] = useState<string>('any');
  const [targetProtein, setTargetProtein] = useState(40);
  const [targetKcal, setTargetKcal] = useState(500);
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<GeneratedResult | null>(null);

  const handleGenerate = async () => {
    if (!apiKey) return;
    setLoading(true);
    setError('');
    setResult(null);

    const prompt = `Generate a ${category} recipe with ${cuisine} cuisine style.
Diet preference: ${diet}.
Day type: ${dayType} day.
Target protein: ~${targetProtein}g.
Target calories: ~${targetKcal} kcal.
${notes ? `Additional notes: ${notes}` : ''}

Respond with ONLY valid JSON (no markdown fences, no extra text):
{
  "name": "Recipe Name",
  "emoji": "single food emoji",
  "kcal": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "cook": "Full CookLang recipe with --- frontmatter ---\\nUse @ingredient{qty%unit} syntax for ingredients, #cookware{} for cookware, ~timer{qty%unit} for timers.\\nEach step on a new line."
}`;

    try {
      const text = await aiGenerate({
        provider: activeAIProvider,
        apiKey,
        prompt,
        maxTokens: 1024,
      });

      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse recipe from response');

      const parsed = JSON.parse(jsonMatch[0]) as GeneratedResult;
      setResult(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;

    const recipe: Recipe = {
      id: `ai_${generateId()}`,
      category,
      name: result.name,
      emoji: result.emoji || '\uD83C\uDF73',
      time: '30 min',
      kcal: result.kcal,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      prepFriendly: false,
      dayType,
      phases: [1, 2, 3, 4],
      cook: result.cook,
      aiGenerated: true,
    };

    onSave(recipe);
    setResult(null);
    onClose();
  };

  // Pill button helper
  const PillGroup = ({
    options,
    value,
    onChange,
  }: {
    options: readonly string[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={[
            'px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize',
            value === opt
              ? 'bg-purple-600 text-white'
              : 'bg-bg-tertiary text-text-secondary hover:text-text-primary',
          ].join(' ')}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title="AI Recipe Generator" maxWidth="max-w-xl">
      <div className="space-y-4">
        {/* No API key warning */}
        {!apiKey && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertCircle size={18} className="text-amber-400 mt-0.5 shrink-0" />
            <div className="text-sm text-amber-200">
              <p className="font-medium">API Key Required</p>
              <p className="text-xs text-amber-300/70 mt-1">
                Add your AI provider API key in{' '}
                <span className="inline-flex items-center gap-1">
                  <Settings size={12} /> Settings
                </span>{' '}
                to use AI recipe generation.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
              Category
            </label>
            <PillGroup options={CATEGORIES} value={category} onChange={setCategory} />
          </div>

          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
              Cuisine
            </label>
            <PillGroup options={CUISINES} value={cuisine} onChange={setCuisine} />
          </div>

          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
              Diet
            </label>
            <PillGroup options={DIETS} value={diet} onChange={setDiet} />
          </div>

          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
              Day Type
            </label>
            <PillGroup options={DAY_TYPES} value={dayType} onChange={setDayType} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wide mb-1">
                Target Protein (g)
              </label>
              <input
                type="number"
                min={0}
                value={targetProtein}
                onChange={(e) => setTargetProtein(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-bg-tertiary border border-border-primary text-text-primary outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wide mb-1">
                Target Kcal
              </label>
              <input
                type="number"
                min={0}
                value={targetKcal}
                onChange={(e) => setTargetKcal(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-bg-tertiary border border-border-primary text-text-primary outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1">
              Additional Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., no dairy, budget-friendly..."
              className="w-full px-3 py-2 text-sm rounded-lg bg-bg-tertiary border border-border-primary text-text-primary placeholder:text-text-muted outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Generate button */}
        <Button
          fullWidth
          disabled={!apiKey || loading}
          onClick={handleGenerate}
          icon={loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          color="bg-purple-600 hover:bg-purple-500"
        >
          {loading ? 'Generating...' : 'Generate Recipe'}
        </Button>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4 border-t border-border-primary pt-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{result.emoji}</span>
              <div>
                <h3 className="font-heading font-bold text-text-primary">
                  {result.name}
                </h3>
                <MacroDisplay
                  kcal={result.kcal}
                  protein={result.protein}
                  carbs={result.carbs}
                  fat={result.fat}
                  size="sm"
                />
              </div>
            </div>

            <div className="bg-bg-tertiary/50 rounded-lg p-3">
              <CooklangDisplay text={result.cook} color="#A855F7" />
            </div>

            <Button
              fullWidth
              onClick={handleSave}
              icon={<Sparkles size={16} />}
              color="bg-purple-600 hover:bg-purple-500"
            >
              Save Recipe
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
