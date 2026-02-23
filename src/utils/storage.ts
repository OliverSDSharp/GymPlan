/**
 * localStorage wrapper with typed async and sync versions.
 * Ported from the monolith's storage shim (lines 3-14).
 *
 * The async API mirrors the original window.storage interface.
 * The sync helpers are for use in hooks and Zustand middleware.
 */

// ---------------------------------------------------------------------------
// Async API (mirrors original window.storage interface)
// ---------------------------------------------------------------------------

export interface StorageGetResult<T> {
  value: T;
}

export const storage = {
  get: async <T>(key: string): Promise<StorageGetResult<T> | null> => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      // Try JSON parse first; fall back to raw string
      try {
        return { value: JSON.parse(raw) as T };
      } catch {
        return { value: raw as unknown as T };
      }
    } catch {
      return null;
    }
  },

  set: async <T>(key: string, value: T): Promise<void> => {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch {
      // Quota exceeded or other localStorage error -- silently fail
    }
  },

  delete: async (key: string): Promise<void> => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail
    }
  },
};

// ---------------------------------------------------------------------------
// Sync helpers (for hooks, Zustand middleware, etc.)
// ---------------------------------------------------------------------------

/**
 * Read a value from localStorage synchronously.
 * Attempts JSON.parse; returns `fallback` on any failure.
 */
export function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Write a value to localStorage synchronously.
 * Serializes via JSON.stringify.
 */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded -- silently fail
  }
}

/**
 * Remove a key from localStorage synchronously.
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently fail
  }
}
