/**
 * CookLang and Markdown recipe parsers.
 * Ported from the monolith (lines 21-90) with full TypeScript types.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CooklangIngredient {
  name: string;
  qty: string;
  unit: string;
  fixed: boolean;
}

export interface CooklangTimer {
  qty: string;
  unit: string;
}

export interface CooklangResult {
  metadata: Record<string, string>;
  ingredients: CooklangIngredient[];
  cookware: string[];
  timers: CooklangTimer[];
  steps: string[];
  highlightedSteps: CooklangToken[][];
  raw: string;
}

export interface CooklangToken {
  type: 'text' | 'ingredient' | 'cookware' | 'timer';
  value: string;
  detail?: string; // e.g. "200 g" for ingredients
}

export interface MarkdownRecipe {
  title: string;
  ingredients: string[];
  steps: string[];
}

// ---------------------------------------------------------------------------
// parseCooklang  (monolith lines 21-56)
// ---------------------------------------------------------------------------

export function parseCooklang(text: string): CooklangResult {
  const result: CooklangResult = {
    metadata: {},
    ingredients: [],
    cookware: [],
    timers: [],
    steps: [],
    highlightedSteps: [],
    raw: text,
  };

  const lines = text.split('\n');
  let inFrontMatter = false;
  let frontMatterDone = false;
  const content: string[] = [];

  lines.forEach((line, i) => {
    const t = line.trim();

    // Front-matter delimiters
    if (t === '---' && i === 0) {
      inFrontMatter = true;
      return;
    }
    if (t === '---' && inFrontMatter && !frontMatterDone) {
      inFrontMatter = false;
      frontMatterDone = true;
      return;
    }

    // Front-matter key:value
    if (inFrontMatter) {
      const colonIdx = t.indexOf(':');
      if (colonIdx > -1) {
        result.metadata[t.slice(0, colonIdx).trim()] = t.slice(colonIdx + 1).trim();
      }
      return;
    }

    // Inline metadata (>> key: value)
    if (t.startsWith('>>')) {
      const colonIdx = t.indexOf(':');
      if (colonIdx > -1) {
        result.metadata[t.slice(2, colonIdx).trim()] = t.slice(colonIdx + 1).trim();
      }
      return;
    }

    // Skip comments and block quotes
    if (t && !t.startsWith('--') && !t.startsWith('>')) {
      content.push(t);
    }
  });

  const seen = new Set<string>();

  content.forEach((line) => {
    // --- Ingredients ---
    // Two alternatives: with braces (multi-word name OK) or bare @word (single word).
    // Making {…} required in the first alt forces the lazy quantifier to extend past
    // spaces until it finds the opening brace, fixing multi-word names like @ground beef{1 lb}.
    const ingredientRe = /@([\w -]+?)\{([^}]*)\}(?=[\s,.!?;:]|$)|@([\w-]+)(?=[\s,.!?;:]|$)/g;
    let m: RegExpExecArray | null;

    while ((m = ingredientRe.exec(line)) !== null) {
      const name = (m[1] || m[3] || '').trim();
      const raw = m[2] || '';
      const isFixed = raw.startsWith('=');
      const qStr = isFixed ? raw.slice(1) : raw;
      const [qty = '', unit = ''] = qStr.includes('%')
        ? qStr.split('%')
        : [qStr, ''];

      if (!seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        result.ingredients.push({
          name,
          qty: qty.trim(),
          unit: unit.trim(),
          fixed: isFixed,
        });
      }
    }

    // --- Cookware ---
    const cookwareRe = /#([\w -]+?)\{[^}]*\}(?=[\s,.!?;:]|$)|#([\w-]+)(?=[\s,.!?;:]|$)/g;
    while ((m = cookwareRe.exec(line)) !== null) {
      result.cookware.push((m[1] || m[2] || '').trim());
    }

    // --- Timers ---
    const timerRe = /~(?:[\w ]*?)\{([^}]+)\}/g;
    while ((m = timerRe.exec(line)) !== null) {
      const [q = '', u = ''] = m[1].includes('%')
        ? m[1].split('%')
        : [m[1], ''];
      result.timers.push({ qty: q.trim(), unit: u.trim() });
    }

    // --- Steps (plain text with annotations stripped) ---
    const step = line
      .replace(
        /@([\w -]+?)\{[^}]*\}(?=[\s,.!?;:]|$)|@([\w-]+)(?=[\s,.!?;:]|$)/g,
        (_, n1: string, n2: string) => (n1 || n2 || '').trim(),
      )
      .replace(
        /#([\w -]+?)\{[^}]*\}(?=[\s,.!?;:]|$)|#([\w-]+)(?=[\s,.!?;:]|$)/g,
        (_, n1: string, n2: string) => (n1 || n2 || '').trim(),
      )
      .replace(/~([\w ]*?)\{([^}]+)\}/g, (_, _n: string, t: string) => {
        const [q, u] = t.split('%');
        return `${q}${u ? ' ' + u : ''}`.trim();
      })
      .trim();

    if (step) {
      result.steps.push(step);
    }

    // --- Highlighted steps (tokenized with inline annotations) ---
    const tokens = tokenizeLine(line);
    if (tokens.length > 0) {
      result.highlightedSteps.push(tokens);
    }
  });

  return result;
}

// ---------------------------------------------------------------------------
// tokenizeLine — produce tokens for syntax highlighting
// ---------------------------------------------------------------------------

function tokenizeLine(line: string): CooklangToken[] {
  const tokens: CooklangToken[] = [];
  // Combined regex to match all CookLang annotations in order.
  // Ingredients & cookware each have two alternatives:
  //   1. With braces: name can be multi-word (lazy extends to find {)
  //   2. Bare: single-word only (no spaces)
  // This prevents the lazy quantifier from stopping at a space before the braces.
  //
  // Groups:
  //   m[1]  = whole ingredient match
  //   m[2]  = ingredient name (with-braces alt)
  //   m[3]  = ingredient detail (content inside {})
  //   m[4]  = ingredient bare name (no-braces alt)
  //   m[5]  = whole cookware match
  //   m[6]  = cookware name (with-braces alt)
  //   m[7]  = cookware bare name (no-braces alt)
  //   m[8]  = whole timer match
  //   m[9]  = timer content
  const re = /(@([\w -]+?)\{([^}]*)\}(?=[\s,.!?;:]|$)|@([\w-]+)(?=[\s,.!?;:]|$))|(#([\w -]+?)\{[^}]*\}(?=[\s,.!?;:]|$)|#([\w-]+)(?=[\s,.!?;:]|$))|(~(?:[\w ]*?)\{([^}]+)\})/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(line)) !== null) {
    // Push preceding plain text
    if (m.index > lastIdx) {
      const text = line.slice(lastIdx, m.index);
      if (text) tokens.push({ type: 'text', value: text });
    }

    if (m[1] != null) {
      // Ingredient: @name{qty%unit} or @name
      const name = (m[2] || m[4] || '').trim();
      const rawDetail = m[3] || '';
      const isFixed = rawDetail.startsWith('=');
      const qStr = isFixed ? rawDetail.slice(1) : rawDetail;
      const [qty = '', unit = ''] = qStr.includes('%') ? qStr.split('%') : [qStr, ''];
      const detail = [qty.trim(), unit.trim()].filter(Boolean).join(' ');
      tokens.push({ type: 'ingredient', value: name, detail: detail || undefined });
    } else if (m[5] != null) {
      // Cookware: #name{...} or #name
      const name = (m[6] || m[7] || '').trim();
      tokens.push({ type: 'cookware', value: name });
    } else if (m[8] != null) {
      // Timer: ~name{qty%unit}
      const [q = '', u = ''] = m[9].includes('%') ? m[9].split('%') : [m[9], ''];
      const timerText = [q.trim(), u.trim()].filter(Boolean).join(' ');
      tokens.push({ type: 'timer', value: timerText });
    }

    lastIdx = m.index + m[0].length;
  }

  // Trailing text
  if (lastIdx < line.length) {
    const text = line.slice(lastIdx);
    if (text.trim()) tokens.push({ type: 'text', value: text });
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// parseMarkdownRecipe  (monolith lines 60-75)
// ---------------------------------------------------------------------------

export function parseMarkdownRecipe(md: string): MarkdownRecipe {
  const lines = md.split('\n');
  let title = '';
  const ingredients: string[] = [];
  const steps: string[] = [];
  let cur: 'ing' | 'steps' | null = null;

  lines.forEach((l) => {
    const t = l.trim();

    if (t.startsWith('# ')) {
      title = t.slice(2).trim();
    } else if (/^#{2,3}\s+(ingredients?|what\s+you'?ll?\s+need)/i.test(t)) {
      cur = 'ing';
    } else if (/^#{2,3}\s+(directions?|instructions?|steps?|method|how)/i.test(t)) {
      cur = 'steps';
    } else if (t.startsWith('## ') || t.startsWith('### ')) {
      cur = null;
    } else if (
      cur === 'ing' &&
      (t.startsWith('-') || t.startsWith('*') || /^\d+\./.test(t))
    ) {
      ingredients.push(
        t.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, ''),
      );
    } else if (
      cur === 'steps' &&
      (t.startsWith('-') || t.startsWith('*') || /^\d+\./.test(t))
    ) {
      steps.push(
        t.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, ''),
      );
    }
  });

  return { title, ingredients, steps };
}

// ---------------------------------------------------------------------------
// mdToCooklang  (monolith lines 76-90)
// ---------------------------------------------------------------------------

export function mdToCooklang(recipe: MarkdownRecipe): string {
  const ingAnnotated = recipe.ingredients.map((ing) => {
    const parts = ing.match(
      /^([\d/\u00BC\u00BD\u00BE\u2153\u2154\u215B\u215C\u215D\u215E.]+(?:\s*(?:lb|lbs|oz|g|kg|ml|l|cup|cups|tbsp|tsp|tablespoon|teaspoon|pound|ounce|gram|liter|litre|clove|cloves|strip|strips|slice|slices|bunch|head|can|cans)s?)?)\s+(.+)/i,
    );

    if (parts) {
      const qty = parts[1].replace(/\s+/g, ' ').trim();
      const name = parts[2].trim();
      const qp = qty.match(
        /^([\d/\u00BC\u00BD\u00BE\u2153\u2154\u215B\u215C\u215D\u215E.]+)\s*(.*)/,
      );
      if (qp) {
        return `@${name}{${qp[1]}%${qp[2].trim() || ''}}`.replace(/%$/, '{}');
      }
      return `@${name}{${qty}}`;
    }
    return `@${ing}{}`;
  });

  // ingAnnotated is built but the original function only uses steps in output
  void ingAnnotated;

  const stepText = recipe.steps.map((s) => `\n${s}`).join('\n');
  return `---\ntitle: ${recipe.title || 'Imported Recipe'}\ntags: [imported]\n---\n${stepText}`;
}
