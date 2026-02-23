import { ChevronDown, Trash2 } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { MacroDisplay } from '@/components/common/MacroDisplay';
import { Button } from '@/components/common/Button';
import { CooklangDisplay } from './CooklangDisplay';
import type { Recipe } from '@/types';

interface RecipeCardProps {
  recipe: Recipe;
  expanded?: boolean;
  onToggle: () => void;
  onDelete?: () => void;
  phaseColor?: string;
}

export function RecipeCard({
  recipe,
  expanded = false,
  onToggle,
  onDelete,
  phaseColor,
}: RecipeCardProps) {
  const isCustom = !recipe.id.startsWith('r');
  const isAI = recipe.aiGenerated === true;

  return (
    <div
      className={[
        'bg-bg-secondary rounded-xl border border-border-primary p-4 cursor-pointer transition-colors',
        expanded ? 'ring-1 ring-blue-500/30' : 'hover:border-border-secondary',
      ].join(' ')}
      onClick={onToggle}
    >
      {/* Collapsed header */}
      <div className="flex items-center gap-3">
        <span className="text-2xl shrink-0">{recipe.emoji}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-heading font-bold text-text-primary truncate">
              {recipe.name}
            </span>
            {isCustom && (
              <Badge color="bg-emerald-600/20 text-emerald-400" size="sm">
                CUSTOM
              </Badge>
            )}
            {isAI && (
              <Badge color="bg-purple-600/20 text-purple-400" size="sm">
                AI
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge size="sm">{recipe.category}</Badge>
            {recipe.time && (
              <Badge variant="outline" size="sm">
                {recipe.time}
              </Badge>
            )}
          </div>
        </div>

        <div className="hidden sm:block">
          <MacroDisplay
            kcal={recipe.kcal}
            protein={recipe.protein}
            carbs={recipe.carbs}
            fat={recipe.fat}
            size="sm"
          />
        </div>

        <ChevronDown
          size={18}
          className={[
            'shrink-0 text-text-muted transition-transform duration-200',
            expanded ? 'rotate-180' : '',
          ].join(' ')}
        />
      </div>

      {/* Mobile macro row */}
      <div className="sm:hidden mt-2">
        <MacroDisplay
          kcal={recipe.kcal}
          protein={recipe.protein}
          carbs={recipe.carbs}
          fat={recipe.fat}
          size="sm"
        />
      </div>

      {/* Expanded content */}
      {expanded && (
        <div
          className="mt-4 pt-4 border-t border-border-primary space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {recipe.cook && (
            <CooklangDisplay text={recipe.cook} color={phaseColor} />
          )}

          {isCustom && onDelete && (
            <div className="flex justify-end pt-2">
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 size={14} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                Delete Recipe
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
