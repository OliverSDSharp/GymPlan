#!/usr/bin/env node
/**
 * Scrape TheMealDB free API and generate CookLang-formatted recipes
 * for the gym app.
 *
 * Usage:  node scripts/fetch-meals.mjs
 * Output: src/data/recipes-mealdb.ts
 */

import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// TheMealDB API (free tier, key = "1")
// ---------------------------------------------------------------------------

const BASE = 'https://www.themealdb.com/api/json/v1/1';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------------------------------------------------------------------------
// Category → app category mapping
// ---------------------------------------------------------------------------

const categoryMap = {
  Breakfast: 'breakfast',
  Chicken: 'dinner',
  Beef: 'dinner',
  Lamb: 'dinner',
  Pork: 'dinner',
  Goat: 'dinner',
  Seafood: 'dinner',
  Pasta: 'dinner',
  Vegetarian: 'lunch',
  Vegan: 'lunch',
  Side: 'snack',
  Starter: 'snack',
  Miscellaneous: 'dinner',
  Dessert: 'snack',
};

// ---------------------------------------------------------------------------
// Emoji mapping
// ---------------------------------------------------------------------------

const emojiMap = {
  Breakfast: '\u{1F373}',    // 🍳
  Chicken: '\u{1F357}',      // 🍗
  Beef: '\u{1F969}',         // 🥩
  Lamb: '\u{1F356}',         // 🍖
  Pork: '\u{1F953}',         // 🥓
  Goat: '\u{1F356}',         // 🍖
  Seafood: '\u{1F41F}',      // 🐟
  Pasta: '\u{1F35D}',        // 🍝
  Vegetarian: '\u{1F957}',   // 🥗
  Vegan: '\u{1F331}',        // 🌱
  Side: '\u{1F96A}',         // 🥪
  Starter: '\u{1F958}',      // 🍘→🥘
  Miscellaneous: '\u{1F37D}\u{FE0F}', // 🍽️
  Dessert: '\u{1F370}',      // 🍰
};

// ---------------------------------------------------------------------------
// Rough macro estimates per category (TheMealDB has no nutrition data)
// ---------------------------------------------------------------------------

const macroDefaults = {
  Chicken:       { kcal: 500, protein: 45, carbs: 30, fat: 15 },
  Beef:          { kcal: 600, protein: 48, carbs: 25, fat: 28 },
  Lamb:          { kcal: 600, protein: 48, carbs: 25, fat: 28 },
  Goat:          { kcal: 600, protein: 48, carbs: 25, fat: 28 },
  Pork:          { kcal: 550, protein: 42, carbs: 25, fat: 24 },
  Seafood:       { kcal: 400, protein: 38, carbs: 20, fat: 14 },
  Pasta:         { kcal: 580, protein: 25, carbs: 70, fat: 16 },
  Vegetarian:    { kcal: 420, protein: 18, carbs: 50, fat: 16 },
  Vegan:         { kcal: 380, protein: 14, carbs: 55, fat: 12 },
  Breakfast:     { kcal: 450, protein: 22, carbs: 45, fat: 18 },
  Side:          { kcal: 250, protein: 10, carbs: 25, fat: 12 },
  Starter:       { kcal: 250, protein: 10, carbs: 25, fat: 12 },
  Dessert:       { kcal: 350, protein: 6,  carbs: 50, fat: 14 },
  Miscellaneous: { kcal: 500, protein: 30, carbs: 40, fat: 18 },
};

// ---------------------------------------------------------------------------
// Cookware detection keywords
// ---------------------------------------------------------------------------

const cookwarePatterns = [
  { regex: /\b(oven)\b/i, name: 'oven' },
  { regex: /\b(skillet|frying pan)\b/i, name: 'skillet' },
  { regex: /\b(saucepan)\b/i, name: 'saucepan' },
  { regex: /\b(baking (pan|dish|tray|sheet))\b/i, name: 'baking tray' },
  { regex: /\b(wok)\b/i, name: 'wok' },
  { regex: /\b(pot)\b/i, name: 'pot' },
  { regex: /\b(grill)\b/i, name: 'grill' },
  { regex: /\b(mixing bowl)\b/i, name: 'mixing bowl' },
  { regex: /\b(blender|food processor)\b/i, name: 'blender' },
  { regex: /\b(casserole dish)\b/i, name: 'casserole dish' },
];

// ---------------------------------------------------------------------------
// Extract ingredients from a TheMealDB meal object
// ---------------------------------------------------------------------------

function extractIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = (meal[`strIngredient${i}`] || '').trim();
    const measure = (meal[`strMeasure${i}`] || '').trim();
    if (name) {
      ingredients.push({ name, measure });
    }
  }
  return ingredients;
}

// ---------------------------------------------------------------------------
// Convert to CookLang format
// ---------------------------------------------------------------------------

function toCookLang(meal, ingredients, appCategory) {
  const title = meal.strMeal;
  const area = meal.strArea || '';
  const tags = [appCategory];
  if (area) tags.push(area.toLowerCase());
  if (meal.strTags) {
    meal.strTags.split(',').forEach((t) => {
      const trimmed = t.trim().toLowerCase();
      if (trimmed && !tags.includes(trimmed)) tags.push(trimmed);
    });
  }

  // Frontmatter
  let cook = `---\ntitle: ${title}\nservings: 2\ntags: [${tags.join(', ')}]\n`;
  if (meal.strMealThumb) {
    cook += `image: ${meal.strMealThumb}\n`;
  }
  if (area) {
    cook += `source: TheMealDB (${area})\n`;
  }
  cook += `---\n`;

  // Process instructions
  let instructions = (meal.strInstructions || '').trim();

  // Normalize line endings
  instructions = instructions.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Remove step numbers like "STEP 1\n", "step 1\n", "Step 1.", etc.
  instructions = instructions.replace(/^step\s*\d+\.?\s*\n?/gim, '');

  // Split into steps by double newlines or numbered patterns
  let steps = instructions
    .split(/\n{2,}/)
    .map((s) => s.replace(/\n/g, ' ').trim())
    .filter((s) => s.length > 0);

  // If only one giant block, try splitting by sentences (period + space + uppercase)
  if (steps.length === 1 && steps[0].length > 300) {
    const sentences = steps[0].split(/(?<=\.)\s+(?=[A-Z])/);
    if (sentences.length >= 3) {
      // Group into ~2-3 sentence steps
      steps = [];
      let buf = '';
      for (const s of sentences) {
        buf += (buf ? ' ' : '') + s;
        if (buf.length > 120) {
          steps.push(buf);
          buf = '';
        }
      }
      if (buf) steps.push(buf);
    }
  }

  // Track which ingredients have been placed
  const placed = new Set();

  // For each step, try to inject ingredient annotations
  const annotatedSteps = steps.map((step) => {
    let annotated = step;

    for (let idx = 0; idx < ingredients.length; idx++) {
      if (placed.has(idx)) continue;

      const { name, measure } = ingredients[idx];
      // Build CookLang annotation
      const annotation = measure
        ? `@${name.toLowerCase()}{${measure}}`
        : `@${name.toLowerCase()}{}`;

      // Try to find ingredient name in the step (case insensitive, whole word)
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const nameRegex = new RegExp(`\\b${escapedName}\\b`, 'i');

      if (nameRegex.test(annotated)) {
        // Replace first occurrence with CookLang annotation
        annotated = annotated.replace(nameRegex, annotation);
        placed.add(idx);
      }
    }

    // Detect cookware in the step
    for (const { regex, name } of cookwarePatterns) {
      if (regex.test(annotated)) {
        // Only annotate if not already annotated
        if (!annotated.includes(`#${name}{}`)) {
          annotated = annotated.replace(regex, `#${name}{}`);
        }
      }
    }

    return annotated;
  });

  // Collect unplaced ingredients → add as "Gather" preamble
  const unplaced = ingredients
    .filter((_, idx) => !placed.has(idx))
    .map(({ name, measure }) =>
      measure ? `@${name.toLowerCase()}{${measure}}` : `@${name.toLowerCase()}{}`
    );

  if (unplaced.length > 0) {
    const gatherStep = `Gather ${unplaced.join(', ')}.`;
    annotatedSteps.unshift(gatherStep);
  }

  cook += annotatedSteps.join('\n');

  return cook;
}

// ---------------------------------------------------------------------------
// Load existing recipes to deduplicate
// ---------------------------------------------------------------------------

function loadExistingRecipeNames() {
  try {
    const recipesPath = resolve(__dirname, '../src/data/recipes.ts');
    const content = readFileSync(recipesPath, 'utf-8');
    // Extract all name:"..." patterns
    const names = new Set();
    const regex = /name:\s*["']([^"']+)["']/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      names.add(match[1].toLowerCase().trim());
    }
    return names;
  } catch {
    return new Set();
  }
}

// ---------------------------------------------------------------------------
// Escape strings for TypeScript output
// ---------------------------------------------------------------------------

function escapeTS(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Fetching TheMealDB categories...');
  const { categories } = await fetchJSON(`${BASE}/categories.php`);
  console.log(`Found ${categories.length} categories`);

  const existingNames = loadExistingRecipeNames();
  console.log(`Existing recipes: ${existingNames.size} names loaded for dedup`);

  const allRecipes = [];
  let skipped = 0;
  let totalFetched = 0;

  for (const cat of categories) {
    const catName = cat.strCategory;
    console.log(`\n--- Category: ${catName} ---`);

    // Get all meal IDs in this category
    const { meals } = await fetchJSON(`${BASE}/filter.php?c=${encodeURIComponent(catName)}`);
    if (!meals || meals.length === 0) {
      console.log(`  No meals found`);
      continue;
    }
    console.log(`  ${meals.length} meals`);

    for (const mealSummary of meals) {
      const mealId = mealSummary.idMeal;
      const mealName = mealSummary.strMeal;

      // Check dedup by name
      if (existingNames.has(mealName.toLowerCase().trim())) {
        skipped++;
        continue;
      }

      // Fetch full details
      await sleep(80); // rate-limit kindness
      try {
        const { meals: details } = await fetchJSON(`${BASE}/lookup.php?i=${mealId}`);
        if (!details || details.length === 0) continue;

        const meal = details[0];
        const ingredients = extractIngredients(meal);
        if (ingredients.length === 0) continue;

        const appCategory = categoryMap[catName] || 'dinner';
        const cookLang = toCookLang(meal, ingredients, appCategory);
        const macros = macroDefaults[catName] || macroDefaults.Miscellaneous;
        const emoji = emojiMap[catName] || '\u{1F37D}\u{FE0F}';

        allRecipes.push({
          id: `mdb-${mealId}`,
          category: appCategory,
          name: meal.strMeal,
          emoji,
          time: '30 min',
          kcal: macros.kcal,
          protein: macros.protein,
          carbs: macros.carbs,
          fat: macros.fat,
          prepFriendly: true,
          dayType: 'any',
          phases: [1, 2, 3, 4],
          cook: cookLang,
        });

        totalFetched++;
        if (totalFetched % 50 === 0) {
          console.log(`  ... ${totalFetched} recipes fetched so far`);
        }
      } catch (err) {
        console.warn(`  Failed to fetch meal ${mealId}: ${err.message}`);
      }
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total fetched: ${totalFetched}`);
  console.log(`Skipped (duplicates): ${skipped}`);
  console.log(`Final count: ${allRecipes.length}`);

  // --- Write TypeScript output ---
  const outPath = resolve(__dirname, '../src/data/recipes-mealdb.ts');

  let ts = `// Auto-generated from TheMealDB — do not edit manually\n`;
  ts += `// Generated on: ${new Date().toISOString()}\n`;
  ts += `// Source: https://www.themealdb.com/api.php (free tier)\n\n`;
  ts += `import type { Recipe } from '../types';\n\n`;
  ts += `export const MEALDB_RECIPES: Recipe[] = [\n`;

  for (const r of allRecipes) {
    ts += `  {`;
    ts += `id:${JSON.stringify(r.id)},`;
    ts += `category:${JSON.stringify(r.category)},`;
    ts += `name:${JSON.stringify(r.name)},`;
    ts += `emoji:${JSON.stringify(r.emoji)},`;
    ts += `time:${JSON.stringify(r.time)},`;
    ts += `kcal:${r.kcal},`;
    ts += `protein:${r.protein},`;
    ts += `carbs:${r.carbs},`;
    ts += `fat:${r.fat},`;
    ts += `prepFriendly:${r.prepFriendly},`;
    ts += `dayType:${JSON.stringify(r.dayType)},`;
    ts += `phases:${JSON.stringify(r.phases)},`;
    ts += `cook:\`${escapeTS(r.cook)}\``;
    ts += `},\n`;
  }

  ts += `];\n`;

  writeFileSync(outPath, ts, 'utf-8');
  console.log(`\nWrote ${allRecipes.length} recipes to ${outPath}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
