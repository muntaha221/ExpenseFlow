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
import {
  getTotalAmount,
  getTopCategory,
  getRolling7DayStats,
  getSmartMonthlyProjection,
} from '../utils/calculations'
import {
  HiOutlineBanknotes,
  HiOutlineReceiptPercent,
  HiOutlineChartBar,
  HiOutlineTrophy,
  HiOutlineArrowTrendingUp,
  HiOutlineCalendarDays,
} from 'react-icons/hi2'

export default function SummarySection({ expenses }) {
  /**
   * useMemo — recalculate stats ONLY when expenses change.
   */
  const stats = useMemo(() => {
    const total = getTotalAmount(expenses)
    const count = expenses.length
    const top = getTopCategory(expenses)
    const rolling7 = getRolling7DayStats(expenses)
    const projection = getSmartMonthlyProjection(expenses)

    return { total, count, top, rolling7, projection }
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
      subValue: `${stats.count} total records`,
      icon: HiOutlineBanknotes,
      accent: 'text-emerald-400',
      accentBg: 'bg-emerald-400/10',
      accentBorder: 'border-emerald-400/20',
    },
    {
      label: 'Rolling 7-Day Spend',
      value: formatCurrency(stats.rolling7.total),
      subValue: `Avg ${formatCurrency(stats.rolling7.dailyAvg)} / day`,
      icon: HiOutlineChartBar,
      accent: 'text-cyan-400',
      accentBg: 'bg-cyan-400/10',
      accentBorder: 'border-cyan-400/20',
      tooltip: 'Trailing 7 continuous days (never resets on Monday)',
    },
    {
      label: 'This Month (MTD)',
      value: formatCurrency(stats.projection.mtdTotal),
      subValue: `Day ${stats.projection.currentDay} of ${stats.projection.daysInMonth}`,
      icon: HiOutlineCalendarDays,
      accent: 'text-indigo-400',
      accentBg: 'bg-indigo-400/10',
      accentBorder: 'border-indigo-400/20',
    },
    {
      label: 'Projected Month End',
      value: formatCurrency(stats.projection.projectedTotal),
      subValue: `Pace: ${formatCurrency(stats.projection.dailyBurnRate)}/day`,
      icon: HiOutlineArrowTrendingUp,
      accent: 'text-pink-400',
      accentBg: 'bg-pink-400/10',
      accentBorder: 'border-pink-400/20',
      tooltip: 'Smart estimate based on rolling daily burn rate',
    },
    {
      label: 'Top Category',
      value: stats.top?.name || '—',
      subValue: stats.top ? formatCurrency(stats.top.total) : 'No data yet',
      icon: HiOutlineTrophy,
      accent: 'text-amber-400',
      accentBg: 'bg-amber-400/10',
      accentBorder: 'border-amber-400/20',
    },
    {
      label: 'Total Entries',
      value: stats.count,
      subValue: `${stats.rolling7.count} in last 7 days`,
      icon: HiOutlineReceiptPercent,
      accent: 'text-purple-400',
      accentBg: 'bg-purple-400/10',
      accentBorder: 'border-purple-400/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6" id="summary-section">
      {cards.map((card, i) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="stat-card animate-fade-in-up flex flex-col justify-between"
            style={{ animationDelay: `${i * 60}ms` }}
            id={`stat-${card.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            title={card.tooltip || ''}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-dm text-gray-400 uppercase tracking-wider truncate mr-1">
                  {card.label}
                </span>
                <div className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0
                  ${card.accentBg} border ${card.accentBorder}`}>
                  <Icon className={`w-3.5 h-3.5 ${card.accent}`} />
                </div>
              </div>
              <p className={`text-lg sm:text-xl font-syne font-bold ${card.accent} truncate`}>
                {card.value}
              </p>
            </div>
            {card.subValue && (
              <p className="text-[11px] text-gray-500 mt-2 truncate font-dm">
                {card.subValue}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
