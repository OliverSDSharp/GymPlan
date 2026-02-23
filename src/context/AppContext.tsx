import { createContext, useContext, useRef, type ReactNode } from 'react';
import { create, useStore, type StoreApi } from 'zustand';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import type { Recipe } from '@/types';
import type { AIProvider } from '@/types/ai';

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface AppState {
  // Phase & day selection
  activePhase: number;
  activeDay: number;
  setActivePhase: (p: number) => void;
  setActiveDay: (d: number) => void;

  // Exercise swaps: key = "phaseId_dayIdx_exIdx"
  swappedDays: Record<string, Record<string, unknown>>;
  swapExercise: (key: string, exercise: Record<string, unknown>) => void;
  resetExercise: (key: string) => void;
  resetAllExercises: () => void;

  // Meal swaps: key = "phaseId_dayType_mealIdx"
  swappedMeals: Record<string, string>;
  swapMeal: (key: string, recipeId: string) => void;
  resetMeal: (key: string) => void;

  // Day workouts: key = "phaseId_dayIdx"
  dayWorkouts: Record<string, string>;
  assignWorkout: (key: string, workoutId: string) => void;
  resetDayWorkout: (key: string) => void;

  // Custom recipes
  customRecipes: Recipe[];
  addCustomRecipe: (recipe: Recipe) => void;
  deleteCustomRecipe: (id: string) => void;
  setCustomRecipes: (recipes: Recipe[]) => void;

  // Settings – AI providers
  aiKeys: Record<AIProvider, string>;
  activeAIProvider: AIProvider;
  setAIKey: (provider: AIProvider, key: string) => void;
  setActiveAIProvider: (provider: AIProvider) => void;

  // Phase start date (ISO string) for weekly variation tracking
  phaseStartDate: string | null;
  setPhaseStartDate: (d: string | null) => void;

  // Settings – general
  userHeight: number;
  setUserHeight: (h: number) => void;
}

// ---------------------------------------------------------------------------
// localStorage keys
// ---------------------------------------------------------------------------

const KEYS = {
  customRecipes: 'custom_recipes',
  dayWorkouts: 'day_workouts',
  swappedMeals: 'swapped_meals',
  swappedDays: 'swapped_days',
  aiKeys: 'ai_keys',
  activeAIProvider: 'active_ai_provider',
  userHeight: 'user_height',
  activePhase: 'active_phase',
  activeDay: 'active_day',
  phaseStartDate: 'phase_start_date',
} as const;

// ---------------------------------------------------------------------------
// Persist helper: writes to localStorage on every change
// ---------------------------------------------------------------------------

function persist<T>(key: string, value: T): void {
  setStorageItem(key, value);
}

// ---------------------------------------------------------------------------
// Store factory
// ---------------------------------------------------------------------------

function createAppStore(): StoreApi<AppState> {
  return create<AppState>((set) => ({
    // --- Phase & day ---
    activePhase: getStorageItem<number>(KEYS.activePhase, 0),
    activeDay: getStorageItem<number>(KEYS.activeDay, 0),

    setActivePhase: (p) =>
      set(() => {
        persist(KEYS.activePhase, p);
        persist(KEYS.activeDay, 0);
        const startDate = new Date().toISOString().slice(0, 10);
        persist(KEYS.phaseStartDate, startDate);
        return { activePhase: p, activeDay: 0, phaseStartDate: startDate };
      }),

    setActiveDay: (d) =>
      set(() => {
        persist(KEYS.activeDay, d);
        return { activeDay: d };
      }),

    // --- Exercise swaps ---
    swappedDays: getStorageItem<Record<string, Record<string, unknown>>>(
      KEYS.swappedDays,
      {},
    ),

    swapExercise: (key, exercise) =>
      set((state) => {
        const next = { ...state.swappedDays, [key]: exercise };
        persist(KEYS.swappedDays, next);
        return { swappedDays: next };
      }),

    resetExercise: (key) =>
      set((state) => {
        const next = { ...state.swappedDays };
        delete next[key];
        persist(KEYS.swappedDays, next);
        return { swappedDays: next };
      }),

    resetAllExercises: () =>
      set(() => {
        persist(KEYS.swappedDays, {});
        return { swappedDays: {} };
      }),

    // --- Meal swaps ---
    swappedMeals: getStorageItem<Record<string, string>>(
      KEYS.swappedMeals,
      {},
    ),

    swapMeal: (key, recipeId) =>
      set((state) => {
        const next = { ...state.swappedMeals, [key]: recipeId };
        persist(KEYS.swappedMeals, next);
        return { swappedMeals: next };
      }),

    resetMeal: (key) =>
      set((state) => {
        const next = { ...state.swappedMeals };
        delete next[key];
        persist(KEYS.swappedMeals, next);
        return { swappedMeals: next };
      }),

    // --- Day workouts ---
    dayWorkouts: getStorageItem<Record<string, string>>(
      KEYS.dayWorkouts,
      {},
    ),

    assignWorkout: (key, workoutId) =>
      set((state) => {
        const next = { ...state.dayWorkouts, [key]: workoutId };
        persist(KEYS.dayWorkouts, next);
        return { dayWorkouts: next };
      }),

    resetDayWorkout: (key) =>
      set((state) => {
        const next = { ...state.dayWorkouts };
        delete next[key];
        persist(KEYS.dayWorkouts, next);
        return { dayWorkouts: next };
      }),

    // --- Custom recipes ---
    customRecipes: getStorageItem<Recipe[]>(KEYS.customRecipes, []),

    addCustomRecipe: (recipe) =>
      set((state) => {
        const next = [...state.customRecipes, recipe];
        persist(KEYS.customRecipes, next);
        return { customRecipes: next };
      }),

    deleteCustomRecipe: (id) =>
      set((state) => {
        const next = state.customRecipes.filter((r) => r.id !== id);
        persist(KEYS.customRecipes, next);
        return { customRecipes: next };
      }),

    setCustomRecipes: (recipes) =>
      set(() => {
        persist(KEYS.customRecipes, recipes);
        return { customRecipes: recipes };
      }),

    // --- Phase start date ---
    phaseStartDate: getStorageItem<string | null>(KEYS.phaseStartDate, null),

    setPhaseStartDate: (d) =>
      set(() => {
        persist(KEYS.phaseStartDate, d);
        return { phaseStartDate: d };
      }),

    // --- Settings – AI providers ---
    aiKeys: getStorageItem<Record<AIProvider, string>>(KEYS.aiKeys, {
      anthropic: '',
      google: '',
      openai: '',
      xai: '',
    }),

    activeAIProvider: getStorageItem<AIProvider>(KEYS.activeAIProvider, 'anthropic'),

    setAIKey: (provider, key) =>
      set((state) => {
        const next = { ...state.aiKeys, [provider]: key };
        persist(KEYS.aiKeys, next);
        return { aiKeys: next };
      }),

    setActiveAIProvider: (provider) =>
      set(() => {
        persist(KEYS.activeAIProvider, provider);
        return { activeAIProvider: provider };
      }),

    // --- Settings – general ---
    userHeight: getStorageItem<number>(KEYS.userHeight, 180),

    setUserHeight: (h) =>
      set(() => {
        persist(KEYS.userHeight, h);
        return { userHeight: h };
      }),
  }));
}

// ---------------------------------------------------------------------------
// React context wrapping the Zustand store
// ---------------------------------------------------------------------------

const AppStoreContext = createContext<StoreApi<AppState> | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Provides the Zustand store to the component tree.
 * The store is created once and never recreated.
 */
export function AppProvider({ children }: AppProviderProps) {
  const storeRef = useRef<StoreApi<AppState> | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createAppStore();
  }

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook: subscribe to the whole store (or a slice via selector)
// ---------------------------------------------------------------------------

/**
 * Access the app store from any component.
 *
 * Usage:
 *   const activePhase = useAppStore(s => s.activePhase);
 *   const { setActivePhase, setActiveDay } = useAppStore(s => ({
 *     setActivePhase: s.setActivePhase,
 *     setActiveDay: s.setActiveDay,
 *   }));
 */
export function useAppStore<T>(selector: (state: AppState) => T): T {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error('useAppStore must be used within an <AppProvider>');
  }
  return useStore(store, selector);
}

/**
 * Get direct access to the store API (for use outside React or in callbacks).
 * Must be called within an <AppProvider>.
 */
export function useAppStoreApi(): StoreApi<AppState> {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error('useAppStoreApi must be used within an <AppProvider>');
  }
  return store;
}
