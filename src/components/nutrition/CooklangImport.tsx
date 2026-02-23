import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { CooklangDisplay } from './CooklangDisplay';
import { mdToCooklang, parseMarkdownRecipe } from '@/utils/cooklang';
import { generateId } from '@/utils/helpers';
import type { Recipe } from '@/types';

interface CooklangImportProps {
  open: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}

type ImportMode = 'cooklang' | 'markdown';

const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snack', 'post-workout'] as const;

export function CooklangImport({ open, onClose, onSave }: CooklangImportProps) {
  const [mode, setMode] = useState<ImportMode>('cooklang');
  const [rawText, setRawText] = useState('');
  const [cookText, setCookText] = useState('');

  // Metadata form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('lunch');
  const [kcal, setKcal] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [phases, setPhases] = useState<number[]>([1, 2, 3, 4]);

  const previewText = mode === 'cooklang' ? rawText : cookText;

  const handleConvert = () => {
    const parsed = parseMarkdownRecipe(rawText);
    const converted = mdToCooklang(parsed);
    setCookText(converted);
    if (parsed.title && !name) {
      setName(parsed.title);
    }
  };

  const togglePhase = (p: number) => {
    setPhases((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p].sort(),
    );
  };

  const handleSave = () => {
    const finalCook = mode === 'cooklang' ? rawText : cookText;
    if (!finalCook.trim() || !name.trim()) return;

    const recipe: Recipe = {
      id: `custom_${generateId()}`,
      category,
      name: name.trim(),
      emoji: '\uD83C\uDF73',
      time: '30 min',
      kcal,
      protein,
      carbs,
      fat,
      prepFriendly: false,
      dayType: 'any',
      phases,
      cook: finalCook,
    };

    onSave(recipe);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setRawText('');
    setCookText('');
    setName('');
    setCategory('lunch');
    setKcal(0);
    setProtein(0);
    setCarbs(0);
    setFat(0);
    setPhases([1, 2, 3, 4]);
    setMode('cooklang');
  };

  return (
    <Modal open={open} onClose={onClose} title="Import Recipe">
      <div className="space-y-4">
        {/* Mode tabs */}
        <div className="flex gap-2">
          {(['cooklang', 'markdown'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={[
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
                mode === m
                  ? 'bg-blue-600 text-white'
                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              {m === 'cooklang' ? 'CookLang' : 'Markdown'}
            </button>
          ))}
        </div>

        {/* Raw input */}
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={
            mode === 'cooklang'
              ? 'Paste your CookLang recipe here...'
              : 'Paste your Markdown recipe here...'
          }
          className="w-full min-h-[200px] p-3 text-sm rounded-lg bg-bg-tertiary border border-border-primary text-text-primary placeholder:text-text-muted outline-none resize-y focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
        />

        {/* Convert button for markdown mode */}
        {mode === 'markdown' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleConvert}
            disabled={!rawText.trim()}
          >
            Convert to CookLang
          </Button>
        )}

        {/* Metadata form */}
        <div className="space-y-3 border-t border-border-primary pt-4">
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1">
              Recipe Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Recipe"
              className="w-full px-3 py-2 text-sm rounded-lg bg-bg-tertiary border border-border-primary text-text-primary outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            />
          </div>

          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-bg-tertiary border border-border-primary text-text-primary outline-none focus:border-blue-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Macro inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              { label: 'Kcal', value: kcal, setter: setKcal },
              { label: 'Protein (g)', value: protein, setter: setProtein },
              { label: 'Carbs (g)', value: carbs, setter: setCarbs },
              { label: 'Fat (g)', value: fat, setter: setFat },
            ] as const).map((m) => (
              <div key={m.label}>
                <label className="block text-xs text-text-muted uppercase tracking-wide mb-1">
                  {m.label}
                </label>
                <input
                  type="number"
                  min={0}
                  value={m.value}
                  onChange={(e) => m.setter(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-bg-tertiary border border-border-primary text-text-primary outline-none focus:border-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Phase checkboxes */}
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1">
              Phases
            </label>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((p) => (
                <label
                  key={p}
                  className="flex items-center gap-1.5 text-sm text-text-primary cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={phases.includes(p)}
                    onChange={() => togglePhase(p)}
                    className="rounded border-border-primary text-blue-600 focus:ring-blue-500"
                  />
                  Phase {p}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Live preview */}
        {previewText.trim() && (
          <div className="border-t border-border-primary pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wide text-text-muted mb-2">
              Preview
            </h4>
            <div className="bg-bg-tertiary/50 rounded-lg p-3">
              <CooklangDisplay text={previewText} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!previewText.trim() || !name.trim()}
          >
            Save Recipe
          </Button>
        </div>
      </div>
    </Modal>
  );
}
