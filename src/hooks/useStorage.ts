import { useState, useEffect, useCallback } from 'react';

/**
 * Generic localStorage hook with SSR safety.
 *
 * Reads the initial value from localStorage (falling back to `initialValue`),
 * and persists every update back to localStorage.
 *
 * Supports both direct values and updater functions:
 *   const [val, setVal] = useStorage('key', 0);
 *   setVal(42);
 *   setVal(prev => prev + 1);
 */
export function useStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  // Lazy initializer: read from localStorage only once
  const [storedValue, setStoredValue] = useState<T>(() => {
    // SSR safety check
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Persist to localStorage whenever storedValue changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Quota exceeded -- silently ignore
    }
  }, [key, storedValue]);

  // Stable setter that accepts both raw values and updater fns
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue =
          value instanceof Function ? value(prev) : value;
        return nextValue;
      });
    },
    [],
  );

  return [storedValue, setValue];
}
