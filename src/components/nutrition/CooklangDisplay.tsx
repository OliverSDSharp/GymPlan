import { parseCooklang, type CooklangToken } from '@/utils/cooklang';

interface CooklangDisplayProps {
  text: string;
  color?: string;
}

const TOKEN_STYLES: Record<CooklangToken['type'], string> = {
  text: '',
  ingredient: 'text-amber-400 font-semibold',
  cookware: 'text-sky-400 font-medium',
  timer: 'text-emerald-400 font-medium',
};

function TokenSpan({ token }: { token: CooklangToken }) {
  const className = TOKEN_STYLES[token.type];
  if (token.type === 'text') {
    return <>{token.value}</>;
  }

  return (
    <span className={className}>
      {token.value}
      {token.detail && (
        <span className="text-text-muted font-normal text-xs ml-0.5">
          ({token.detail})
        </span>
      )}
    </span>
  );
}

export function CooklangDisplay({ text, color }: CooklangDisplayProps) {
  const parsed = parseCooklang(text);
  const hasHighlightedSteps = parsed.highlightedSteps.length > 0;

  return (
    <div className="space-y-4">
      {/* Metadata */}
      {Object.keys(parsed.metadata).length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {Object.entries(parsed.metadata).map(([key, value]) => (
            <span key={key}>
              <span className="text-text-muted">{key}:</span>{' '}
              <span className="text-text-muted font-medium">{value}</span>
            </span>
          ))}
        </div>
      )}

      {/* Two-column grid: ingredients + steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ingredients */}
        {parsed.ingredients.length > 0 && (
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-wide mb-2"
              style={color ? { color } : undefined}
            >
              Ingredients
            </h4>
            <ul className="space-y-1">
              {parsed.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-1.5 text-sm">
                  <span className="text-text-muted mt-1.5 shrink-0 w-1 h-1 rounded-full bg-text-muted inline-block" />
                  <span>
                    <span className="font-bold text-amber-400">{ing.name}</span>
                    {(ing.qty || ing.unit) && (
                      <span className="text-text-secondary ml-1">
                        {ing.qty}
                        {ing.unit && ` ${ing.unit}`}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Steps — with syntax highlighting */}
        {hasHighlightedSteps ? (
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-wide mb-2"
              style={color ? { color } : undefined}
            >
              Steps
            </h4>
            <ol className="space-y-2">
              {parsed.highlightedSteps.map((tokens, i) => (
                <li key={i} className="flex gap-2 text-sm text-text-primary">
                  <span
                    className="shrink-0 font-mono text-xs font-bold mt-0.5"
                    style={color ? { color } : undefined}
                  >
                    {i + 1}.
                  </span>
                  <span>
                    {tokens.map((token, j) => (
                      <TokenSpan key={j} token={token} />
                    ))}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : parsed.steps.length > 0 ? (
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-wide mb-2"
              style={color ? { color } : undefined}
            >
              Steps
            </h4>
            <ol className="space-y-2">
              {parsed.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm text-text-primary">
                  <span
                    className="shrink-0 font-mono text-xs font-bold mt-0.5"
                    style={color ? { color } : undefined}
                  >
                    {i + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>

      {/* Timers */}
      {parsed.timers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
            Timers:
          </span>
          {parsed.timers.map((timer, i) => (
            <span
              key={i}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 text-xs text-emerald-400 font-medium"
            >
              {timer.qty}
              {timer.unit && ` ${timer.unit}`}
            </span>
          ))}
        </div>
      )}

      {/* Cookware */}
      {parsed.cookware.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
            Cookware:
          </span>
          {parsed.cookware.map((cw, i) => (
            <span
              key={i}
              className="bg-sky-500/10 border border-sky-500/20 rounded-full px-2 py-0.5 text-xs text-sky-400 font-medium"
            >
              {cw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
