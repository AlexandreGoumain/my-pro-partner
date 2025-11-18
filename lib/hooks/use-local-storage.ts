import { useState, useEffect, useCallback } from "react";

/**
 * Type-safe localStorage hook with SSR support
 * Persists state in localStorage and syncs across tabs
 *
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [value, setValue, remove] tuple
 *
 * @example
 * ```tsx
 * const [viewMode, setViewMode] = useLocalStorage<"grid" | "list">("viewMode", "grid");
 *
 * return (
 *   <button onClick={() => setViewMode(mode => mode === "grid" ? "list" : "grid")}>
 *     Toggle View
 *   </button>
 * );
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.warn(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));

          // Dispatch a custom event to sync across tabs
          window.dispatchEvent(
            new CustomEvent("local-storage", {
              detail: { key, value: valueToStore },
            })
          );
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const remove = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);

        // Dispatch a custom event to sync across tabs
        window.dispatchEvent(
          new CustomEvent("local-storage", {
            detail: { key, value: null },
          })
        );
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sync state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if ("key" in e && e.key && e.key !== key) {
        return;
      }

      if ("detail" in e && e.detail.key !== key) {
        return;
      }

      try {
        const newValue =
          "detail" in e
            ? e.detail.value
            : e.newValue
            ? JSON.parse(e.newValue)
            : initialValue;

        setStoredValue(newValue);
      } catch (error) {
        console.error(`Error syncing localStorage key "${key}":`, error);
      }
    };

    // Listen for changes from other tabs
    window.addEventListener("storage", handleStorageChange as EventListener);

    // Listen for changes from the same tab
    window.addEventListener("local-storage", handleStorageChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange as EventListener);
      window.removeEventListener("local-storage", handleStorageChange as EventListener);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, remove];
}

/**
 * Session storage hook (similar to localStorage but session-scoped)
 * Useful for temporary data that should be cleared when tab is closed
 *
 * @param key - The sessionStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [value, setValue, remove] tuple
 *
 * @example
 * ```tsx
 * const [activeTab, setActiveTab] = useSessionStorage("activeTab", "overview");
 * ```
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error loading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const remove = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(key);
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, remove];
}
