/**
 * Safe client-side storage utility for sandboxed iframe compatibility
 */

const memoryFallback: Record<string, string> = {};

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Access to localStorage denied in sandboxed iframe or private window
    }
    return memoryFallback[key] ?? null;
  },

  setItem: (key: string, value: string): void => {
    memoryFallback[key] = value;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Access to localStorage denied in sandboxed iframe or private window
    }
  },

  removeItem: (key: string): void => {
    delete memoryFallback[key];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Access to localStorage denied
    }
  },
};
