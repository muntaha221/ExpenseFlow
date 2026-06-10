/**
 * useLocalStorage.js
 *
 * Custom hook: works exactly like useState, but persists
 * the value to localStorage automatically.
 *
 * WHY A CUSTOM HOOK?
 * - Encapsulates the localStorage read/write logic
 * - Components just call useLocalStorage('key', default)
 *   and get [value, setValue] back — same API as useState
 * - Handles JSON serialisation, error recovery, and
 *   cross-tab synchronisation (via the 'storage' event)
 *
 * TRADE-OFFS:
 * - localStorage is synchronous and limited (~5 MB)
 * - For a personal expense tracker, this is more than enough
 * - If data grew large, we'd migrate to IndexedDB
 */
import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage(key, initialValue) {
  // Lazy initialiser: reads from localStorage ONCE on mount.
  // If the key doesn't exist or JSON is corrupt, falls back to initialValue.
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Wrapped setter: updates both React state AND localStorage.
  // Supports functional updates (like useState's callback form).
  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.warn(`Error writing localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Listen for changes from OTHER tabs (e.g., if the user has two windows open).
  // The 'storage' event only fires for changes made in OTHER documents.
  useEffect(() => {
    function handleStorageChange(e) {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch {
          // Ignore corrupt data from other tabs
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}
