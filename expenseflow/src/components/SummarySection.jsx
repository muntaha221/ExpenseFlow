/**
 * SummarySection.jsx
 *
 * A row of stat cards showing key metrics at a glance:
 *  1. Total Spent — sum of all expenses
 *  2. Total Expenses — count of entries
 *  3. Average — mean expense amount
 *  4. Top Category — category with highest spending
 *
 * WHY STAT CARDS?
 * - Gives the user an instant overview without reading the table
 * - Visual hierarchy: big numbers draw the eye first
 * - Each card has a unique accent colour so they're distinguishable
 *
 * Props:
 *   expenses (Array) — all expense objects
 */
import { useMemo } from 'react'
import { getTotalAmount, getAverageAmount, getTopCategory, getThisWeekTotal, getThisMonthTotal } from '../utils/calculations'
import {
  HiOutlineBanknotes,
  HiOutlineReceiptPercent,
  HiOutlineChartBar,
  HiOutlineTrophy,
} from 'react-icons/hi2'

export default function SummarySection({ expenses }) {
  /**
   * useMemo — recalculate stats ONLY when expenses change.
   * Without useMemo, these would re-compute on every render
   * (e.g., when the user toggles dark mode).
   */
  const stats = useMemo(() => {
    const total = getTotalAmount(expenses)
    const count = expenses.length
    const average = getAverageAmount(expenses)
    const top = getTopCategory(expenses)
    const weekTotal = getThisWeekTotal(expenses)
    const monthTotal = getThisMonthTotal(expenses)
    return { total, count, average, top, weekTotal, monthTotal }
  }, [expenses])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const cards = [
    {
      label: 'Total Spent',
      value: formatCurrency(stats.total),
      icon: HiOutlineBanknotes,
      accent: 'text-emerald-400',
      accentBg: 'bg-emerald-400/10',
      accentBorder: 'border-emerald-400/20',
    },
    {
      label: 'Weekly Spend',
      value: formatCurrency(stats.weekTotal),
      icon: HiOutlineChartBar,
      accent: 'text-cyan-400',
      accentBg: 'bg-cyan-400/10',
      accentBorder: 'border-cyan-400/20',
    },
    {
      label: 'Monthly Spend',
      value: formatCurrency(stats.monthTotal),
      icon: HiOutlineChartBar,
      accent: 'text-indigo-400',
      accentBg: 'bg-indigo-400/10',
      accentBorder: 'border-indigo-400/20',
    },
    {
      label: 'Expenses',
      value: stats.count,
      icon: HiOutlineReceiptPercent,
      accent: 'text-blue-400',
      accentBg: 'bg-blue-400/10',
      accentBorder: 'border-blue-400/20',
    },
    {
      label: 'Average',
      value: formatCurrency(stats.average),
      icon: HiOutlineChartBar,
      accent: 'text-purple-400',
      accentBg: 'bg-purple-400/10',
      accentBorder: 'border-purple-400/20',
    },
    {
      label: 'Top Category',
      value: stats.top?.name || '—',
      subValue: stats.top ? formatCurrency(stats.top.total) : null,
      icon: HiOutlineTrophy,
      accent: 'text-amber-400',
      accentBg: 'bg-amber-400/10',
      accentBorder: 'border-amber-400/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" id="summary-section">
      {cards.map((card, i) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="stat-card animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
            id={`stat-${card.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-dm text-gray-500 uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg
                ${card.accentBg} border ${card.accentBorder}`}>
                <Icon className={`w-4 h-4 ${card.accent}`} />
              </div>
            </div>
            <p className={`text-xl font-syne font-bold ${card.accent} truncate`}>
              {card.value}
            </p>
            {card.subValue && (
              <p className="text-xs text-gray-500 mt-1">{card.subValue}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
