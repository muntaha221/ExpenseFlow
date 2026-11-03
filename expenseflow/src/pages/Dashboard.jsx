/**
 * Dashboard.jsx
 *
 * Main page assembling the form, summary metrics, filters, table, and daily chart.
 */

import { useState, useMemo } from 'react'
import ExpenseForm    from '../components/ExpenseForm'
import FilterPanel    from '../components/FilterPanel'
import ExpenseList    from '../components/ExpenseList'
import SummarySection from '../components/SummarySection'
import ExpenseChart   from '../components/ExpenseChart'
import ConfirmModal   from '../components/ConfirmModal'

const DEFAULT_FILTERS = {
  search:   '',
  category: '',
  from:     '',
  to:       '',
  sortBy:   'date',
  sortDir:  'desc',
}

export default function Dashboard({
  expenses,
  allExpenses = [],
  onAdd,
  onUpdate,
  onDelete,
  selectedMonth,
  onMonthChange,
}) {
  const [editingExpense, setEditingExpense] = useState(null)
  const [filters, setFilters]               = useState(DEFAULT_FILTERS)
  const [confirmId, setConfirmId]           = useState(null)

  // ── Filtering + Sorting ──
  const filtered = useMemo(() => {
    let list = [...expenses]

    // Search by title
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(e => e.title.toLowerCase().includes(q))
    }

    // Filter by category
    if (filters.category) {
      list = list.filter(e => e.category === filters.category)
    }

    // Filter by date range
    if (filters.from) list = list.filter(e => e.date >= filters.from)
    if (filters.to)   list = list.filter(e => e.date <= filters.to)

    // Sorting
    list.sort((a, b) => {
      let cmp = 0
      if (filters.sortBy === 'date') {
        cmp = a.date.localeCompare(b.date)
      } else if (filters.sortBy === 'amount') {
        cmp = a.amount - b.amount
      }
      return filters.sortDir === 'asc' ? cmp : -cmp
    })

    return list
  }, [expenses, filters])

  function handleEdit(expense) {
    setEditingExpense(expense)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDeleteRequest(id) {
    setConfirmId(id)
  }

  function handleDeleteConfirmed() {
    onDelete(confirmId)
    setConfirmId(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      {/* Summary Cards */}
      <SummarySection expenses={expenses} selectedMonth={selectedMonth} />

      {/* Main layout: Form (left) + Table & Daily Chart (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px,1fr] gap-6 items-start">

        {/* ── Left: Add/Edit Form ── */}
        <div className="lg:sticky lg:top-6">
          <ExpenseForm
            onAdd={expense => { onAdd(expense); }}
            editingExpense={editingExpense}
            onUpdate={expense => { onUpdate(expense); setEditingExpense(null); }}
            onCancelEdit={() => setEditingExpense(null)}
          />
        </div>

        {/* ── Right: Filters + Table + Daily Bar Chart ── */}
        <div>
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(DEFAULT_FILTERS)}
            selectedMonth={selectedMonth}
            onMonthChange={onMonthChange}
            allExpenses={allExpenses}
          />
          <ExpenseList
            expenses={filtered}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
          <ExpenseChart
            expenses={expenses}
            selectedMonth={selectedMonth}
          />
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={confirmId !== null}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  )
}
