/**
 * ExpenseList.jsx
 *
 * Container component that renders expenses as either:
 *  - A responsive table (on md+ screens)
 *  - A stack of ExpenseCards (on small screens)
 */
import { useState, useEffect } from 'react'
import ExpenseCard from './ExpenseCard'
import CategoryBadge from './CategoryBadge'
import { formatDateShort, formatTimeShort, formatPKR } from '../utils/calculations'
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineInboxStack,
  HiOutlineCalendar,
} from 'react-icons/hi2'

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)
    function handler(e) { setIsMobile(e.matches) }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  // ── Empty state ──
  if (expenses.length === 0) {
    return (
      <div className="card p-12 text-center animate-fade-in-up" id="expense-list-empty">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-2xl border border-gray-700">
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
    <div className="card overflow-hidden animate-fade-in-up mb-6" id="expense-list">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-xs font-dm font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                Day / Title
              </th>
              <th className="text-left text-xs font-dm font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                Category
              </th>
              <th className="text-right text-xs font-dm font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                Amount
              </th>
              <th className="text-right text-xs font-dm font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, i) => {
              const dateStr = formatDateShort(expense.date)
              const timeStr = formatTimeShort(expense.date)

              return (
                <tr
                  key={expense.id}
                  className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 transition-colors duration-150 animate-fade-in-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                  id={`expense-row-${expense.id}`}
                >
                  {/* Title is Day (with date below) */}
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-dm font-semibold text-gray-100">
                      {expense.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                      <HiOutlineCalendar className="w-3 h-3 text-emerald-400" />
                      <span>{dateStr} · {timeStr}</span>
                    </div>
                    {expense.notes && (
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-[240px]">
                        {expense.notes}
                      </p>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3.5">
                    <CategoryBadge categoryId={expense.category} />
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-syne font-bold text-emerald-400 tabular-nums">
                      {formatPKR(expense.amount)}
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
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
