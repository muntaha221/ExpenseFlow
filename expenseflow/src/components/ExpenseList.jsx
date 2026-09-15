/**
 * ExpenseList.jsx
 *
 * Container component that renders expenses as either:
 *  - A responsive table (on md+ screens)
 *  - A stack of ExpenseCards (on small screens)
 *
 * WHY TWO LAYOUTS?
 * - Tables work great on desktop: compact, scannable, sortable
 * - Cards work better on mobile: full-width, tappable targets
 * - We detect screen size with a simple state + resize listener
 *
 * Props:
 *   expenses (Array) — filtered + sorted expense list
 *   onEdit (function) — called with the expense to edit
 *   onDelete (function) — called with the expense id to delete
 */
import { useState, useEffect } from 'react'
import ExpenseCard from './ExpenseCard'
import CategoryBadge from './CategoryBadge'
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineInboxStack,
  HiOutlineCalendar,
} from 'react-icons/hi2'

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  /**
   * useIsMobile — track whether the viewport is < 768px.
   * We use matchMedia for efficiency (no constant measuring).
   */
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)
    function handler(e) { setIsMobile(e.matches) }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  // ── Formatting helpers ──
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency', currency: 'PKR',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    })
  }

  // ── Empty state ──
  if (expenses.length === 0) {
    return (
      <div className="card p-12 text-center animate-fade-in-up" id="expense-list-empty">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4
          bg-gray-800 rounded-2xl border border-gray-700">
          <HiOutlineInboxStack className="w-7 h-7 text-gray-500" />
        </div>
        <h3 className="text-base font-syne font-bold text-gray-300 mb-1">
          No expenses found
        </h3>
        <p className="text-sm text-gray-500 font-dm">
          Try adjusting your filters or add a new expense
        </p>
      </div>
    )
  }

  // ── Mobile: Card layout ──
  if (isMobile) {
    return (
      <div className="space-y-3" id="expense-list">
        {expenses.map((expense, i) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
            index={i}
          />
        ))}
      </div>
    )
  }

  // ── Desktop: Table layout ──
  return (
    <div className="card overflow-hidden animate-fade-in-up" id="expense-list">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-xs font-dm font-medium text-gray-500
                uppercase tracking-wider px-5 py-3">Title</th>
              <th className="text-left text-xs font-dm font-medium text-gray-500
                uppercase tracking-wider px-5 py-3">Category</th>
              <th className="text-left text-xs font-dm font-medium text-gray-500
                uppercase tracking-wider px-5 py-3">Date</th>
              <th className="text-right text-xs font-dm font-medium text-gray-500
                uppercase tracking-wider px-5 py-3">Amount</th>
              <th className="text-right text-xs font-dm font-medium text-gray-500
                uppercase tracking-wider px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, i) => (
              <tr
                key={expense.id}
                className="border-b border-gray-800/50 last:border-0
                  hover:bg-gray-800/30 transition-colors duration-150
                  animate-fade-in-up"
                style={{ animationDelay: `${i * 40}ms` }}
                id={`expense-row-${expense.id}`}
              >
                {/* Title + Notes */}
                <td className="px-5 py-3.5">
                  <p className="text-sm font-dm font-medium text-gray-200">
                    {expense.title}
                  </p>
                  {expense.notes && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">
                      {expense.notes}
                    </p>
                  )}
                </td>

                {/* Category */}
                <td className="px-5 py-3.5">
                  <CategoryBadge categoryId={expense.category} />
                </td>

                {/* Date */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <HiOutlineCalendar className="w-3.5 h-3.5" />
                    <span className="text-sm">{formatDateTime(expense.date)}</span>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-5 py-3.5 text-right">
                  <span className="text-sm font-syne font-bold text-emerald-400 tabular-nums">
                    {formatCurrency(expense.amount)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className="btn-edit"
                      aria-label={`Edit ${expense.title}`}
                      id={`edit-expense-${expense.id}`}
                    >
                      <HiOutlinePencilSquare className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="btn-delete"
                      aria-label={`Delete ${expense.title}`}
                      id={`delete-expense-${expense.id}`}
                    >
                      <HiOutlineTrash className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
