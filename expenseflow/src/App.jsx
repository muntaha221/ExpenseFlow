/**
 * App.jsx
 *
 * Root component. Responsible for:
 *  1. Global state — the expenses array (synced to localStorage)
 *  2. Dark / light mode toggle (applies 'dark' class to <html>)
 *  3. Toast notifications
 *  4. CRUD operations: add, update, delete
 *
 * WHY KEEP CRUD HERE?
 * Because any component in the tree might trigger a CRUD action.
 * Lifting state to the root means we have ONE place where the
 * data lives — this is the "single source of truth" principle.
 * Child components receive the data and callbacks as props.
 *
 * DATA FLOW (simplified):
 *   App (state) → Dashboard → ExpenseForm / ExpenseList
 *                           → user action → callback → App updates state
 *                           → re-render propagates down
 */

import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage }  from './hooks/useLocalStorage'
import { getTotalAmount }   from './utils/calculations'
import Header    from './components/Header'
import Toast     from './components/Toast'
import Dashboard from './pages/Dashboard'

export default function App() {
  // ── Persistent expense data ──
  // useLocalStorage works like useState but auto-saves to localStorage
  const [expenses, setExpenses] = useLocalStorage('expenseflow_v1', [])

  // ── Dark mode ──
  // Also persist the user's preference
  const [darkMode, setDarkMode] = useLocalStorage('expenseflow_dark', true)

  // Apply/remove 'dark' class on <html> whenever darkMode changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // ── Toast state ──
  const [toast, setToast] = useState({ message: '', visible: false })

  function showToast(message) {
    setToast({ message, visible: true })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500)
  }

  // ── CRUD Operations ──

  // ADD — appends a new expense to the array
  const handleAdd = useCallback((expense) => {
    setExpenses(prev => [expense, ...prev])
    showToast('✓ Expense added')
  }, [setExpenses])

  // UPDATE — replaces the expense with matching id
  const handleUpdate = useCallback((updated) => {
    setExpenses(prev => prev.map(e => e.id === updated.id ? updated : e))
    showToast('✓ Changes saved')
  }, [setExpenses])

  // DELETE — removes the expense with matching id
  const handleDelete = useCallback((id) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
    showToast('Expense removed')
  }, [setExpenses])

  const total = getTotalAmount(expenses)

  return (
    // The 'dark' class on <html> (set in useEffect) enables Tailwind dark mode.
    // Here we just ensure minimum page height and background.
    <div className="min-h-screen">

      <Header
        total={total}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
      />

      <Dashboard
        expenses={expenses}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      <Toast message={toast.message} visible={toast.visible} />

      {/* Footer */}
      <footer className="text-center text-xs text-gray-700 py-8 mt-12">
        ExpenseFlow — Personal Expense Tracker
      </footer>
    </div>
  )
}
