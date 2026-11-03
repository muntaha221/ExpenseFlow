/**
 * App.jsx
 *
 * Root component. Responsible for:
 *  1. Global state — the expenses array (synced to localStorage)
 *  2. Dark / light mode toggle
 *  3. Toast notifications
 *  4. CRUD operations: add, update, delete
 *  5. Current month isolation (starts fresh at 0 on 1st of month)
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocalStorage }  from './hooks/useLocalStorage'
import { getTotalAmount }   from './utils/calculations'
import Header      from './components/Header'
import Toast       from './components/Toast'
import Dashboard   from './pages/Dashboard'
import BackupModal from './components/BackupModal'

function toMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export default function App() {
  const [expenses, setExpenses] = useLocalStorage('expenseflow_v1', [])
  const [darkMode, setDarkMode] = useLocalStorage('expenseflow_dark', true)
  const [isBackupOpen, setIsBackupOpen] = useState(false)

  // Default to current month (e.g. "2026-11")
  const [selectedMonth, setSelectedMonth] = useState(() => toMonthKey(new Date()))

  // Filter expenses to selected month only (or all if selectedMonth is 'all')
  const monthlyExpenses = useMemo(() => {
    if (!selectedMonth || selectedMonth === 'all') return expenses
    return expenses.filter(e => {
      try {
        const d = new Date(e.date)
        return toMonthKey(d) === selectedMonth
      } catch {
        return false
      }
    })
  }, [expenses, selectedMonth])

  // Apply/remove 'dark' class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Request persistent storage on modern browsers
  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {})
    }
  }, [])

  const [toast, setToast] = useState({ message: '', visible: false })

  function showToast(message) {
    setToast({ message, visible: true })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500)
  }

  const handleAdd = useCallback((expense) => {
    setExpenses(prev => [expense, ...prev])
    showToast('✓ Expense added')
  }, [setExpenses])

  const handleUpdate = useCallback((updated) => {
    setExpenses(prev => prev.map(e => e.id === updated.id ? updated : e))
    showToast('✓ Changes saved')
  }, [setExpenses])

  const handleDelete = useCallback((id) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
    showToast('Expense removed')
  }, [setExpenses])

  const handleRestoreExpenses = useCallback((restoredList) => {
    setExpenses(restoredList)
  }, [setExpenses])

  const total = getTotalAmount(monthlyExpenses)

  return (
    <div className="min-h-screen">
      <Header
        total={total}
        count={monthlyExpenses.length}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      <div className="pt-6">
        <Dashboard
          expenses={monthlyExpenses}
          allExpenses={expenses}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        expenses={expenses}
        onRestoreExpenses={handleRestoreExpenses}
        onShowToast={showToast}
      />

      <Toast message={toast.message} visible={toast.visible} />

      <footer className="text-center text-xs text-gray-700 py-8 mt-12">
        ExpenseFlow — Personal Expense Tracker
      </footer>
    </div>
  )
}
