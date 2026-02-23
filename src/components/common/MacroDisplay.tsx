import { ProgressBar } from './ProgressBar';

interface MacroDisplayProps {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  layout?: 'row' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  targets?: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface MacroItem {
  key: 'kcal' | 'protein' | 'carbs' | 'fat';
  label: string;
  unit: string;
  color: string;
  textColor: string;
}

const MACROS: MacroItem[] = [
  { key: 'kcal', label: 'Kcal', unit: '', color: 'bg-macro-kcal', textColor: 'text-macro-kcal' },
  { key: 'protein', label: 'Protein', unit: 'g', color: 'bg-macro-protein', textColor: 'text-macro-protein' },
  { key: 'carbs', label: 'Carbs', unit: 'g', color: 'bg-macro-carbs', textColor: 'text-macro-carbs' },
  { key: 'fat', label: 'Fat', unit: 'g', color: 'bg-macro-fat', textColor: 'text-macro-fat' },
];

const textSizeClasses: Record<string, { value: string; label: string }> = {
  sm: { value: 'text-xs', label: 'text-[10px]' },
  md: { value: 'text-sm', label: 'text-xs' },
  lg: { value: 'text-lg', label: 'text-sm' },
};

export function MacroDisplay({
  kcal,
  protein,
  carbs,
  fat,
  layout = 'row',
  size = 'md',
  targets,
}: MacroDisplayProps) {
  const values = { kcal, protein, carbs, fat };
  const sizeClasses = textSizeClasses[size];

  if (layout === 'row') {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        {MACROS.map((macro, i) => (
          <div key={macro.key} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="text-border-secondary mr-1.5 hidden sm:inline">/</span>
            )}
            <span className={`${sizeClasses.label} text-text-muted uppercase tracking-wide`}>
              {macro.label}
            </span>
            <span className={`font-mono ${sizeClasses.value} tabular-nums ${macro.textColor}`}>
              {Math.round(values[macro.key])}
              {macro.unit && (
                <span className="text-text-muted">{macro.unit}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Grid layout
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {MACROS.map((macro) => {
        const val = values[macro.key];
        const target = targets?.[macro.key];

        return (
          <div
            key={macro.key}
            className="rounded-lg bg-bg-tertiary/50 p-3 flex flex-col gap-1.5"
          >
            <span className={`${sizeClasses.label} text-text-muted uppercase tracking-wide`}>
              {macro.label}
            </span>
            <span className={`font-mono ${sizeClasses.value} font-semibold tabular-nums ${macro.textColor}`}>
              {Math.round(val)}
              {macro.unit && (
                <span className="text-text-muted font-normal">{macro.unit}</span>
              )}
              {target != null && (
                <span className="text-text-muted font-normal">
                  {' '}
                  / {Math.round(target)}
                </span>
              )}
            </span>
            {target != null && (
              <ProgressBar
                value={val}
                max={target}
                color={macro.color}
                height="h-1.5"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
