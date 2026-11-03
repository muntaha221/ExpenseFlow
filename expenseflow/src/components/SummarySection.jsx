/**
 * SummarySection.jsx
 *
 * Clean, non-redundant stat cards for the selected month:
 *  1. Total Spent (for selected month)
 *  2. Projected Month End (intelligent run-rate projection)
 *  3. Daily Average
 *  4. Rolling 7-Day Spend
 *  5. Top Category
 *  6. Total Entries
 */
import { useMemo } from 'react'
import {
  getTotalAmount,
  getTopCategory,
  getRolling7DayStats,
  getSmartMonthlyProjection,
  formatPKR,
} from '../utils/calculations'
import {
  HiOutlineBanknotes,
  HiOutlineReceiptPercent,
  HiOutlineChartBar,
  HiOutlineTrophy,
  HiOutlineArrowTrendingUp,
  HiOutlineCalculator,
} from 'react-icons/hi2'

export default function SummarySection({ expenses, selectedMonth }) {
  const stats = useMemo(() => {
    const total = getTotalAmount(expenses)
    const count = expenses.length
    const top = getTopCategory(expenses)
    const rolling7 = getRolling7DayStats(expenses)
    const projection = getSmartMonthlyProjection(expenses, selectedMonth)

    return { total, count, top, rolling7, projection }
  }, [expenses, selectedMonth])

  const now = new Date()
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const isPastMonth = selectedMonth && selectedMonth !== 'all' && selectedMonth !== currentMonthKey

  const cards = [
    {
      label: 'Total Spent',
      value: formatPKR(stats.total),
      subValue: isPastMonth ? 'Full month finalized' : `${stats.count} total records`,
      icon: HiOutlineBanknotes,
      accent: 'text-emerald-400',
      accentBg: 'bg-emerald-400/10',
      accentBorder: 'border-emerald-400/20',
    },
    {
      label: isPastMonth ? 'Final Total' : 'Projected Month End',
      value: isPastMonth ? formatPKR(stats.total) : formatPKR(stats.projection.projectedTotal),
      subValue: isPastMonth
        ? 'Final month end'
        : `Weekly pace: ~${formatPKR(stats.projection.weeklyPace)}/wk`,
      icon: HiOutlineArrowTrendingUp,
      accent: 'text-pink-400',
      accentBg: 'bg-pink-400/10',
      accentBorder: 'border-pink-400/20',
      tooltip: 'Intelligent forecast based on average daily and weekly spending',
    },
    {
      label: 'Daily Average',
      value: formatPKR(stats.projection.dailyAvg),
      subValue: isPastMonth
        ? `Over ${stats.projection.daysInMonth} days`
        : `Across ${stats.projection.currentDay} days so far`,
      icon: HiOutlineCalculator,
      accent: 'text-indigo-400',
      accentBg: 'bg-indigo-400/10',
      accentBorder: 'border-indigo-400/20',
    },
    {
      label: 'Rolling 7-Day Spend',
      value: formatPKR(stats.rolling7.total),
      subValue: `Avg ${formatPKR(stats.rolling7.dailyAvg)} / day`,
      icon: HiOutlineChartBar,
      accent: 'text-cyan-400',
      accentBg: 'bg-cyan-400/10',
      accentBorder: 'border-cyan-400/20',
      tooltip: 'Trailing 7 continuous days (never resets on Monday)',
    },
    {
      label: 'Top Category',
      value: stats.top?.name || '—',
      subValue: stats.top ? formatPKR(stats.top.total) : 'No data yet',
      icon: HiOutlineTrophy,
      accent: 'text-amber-400',
      accentBg: 'bg-amber-400/10',
      accentBorder: 'border-amber-400/20',
    },
    {
      label: 'Total Entries',
      value: stats.count,
      subValue: isPastMonth ? 'records in this month' : `${stats.rolling7.count} in last 7 days`,
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
            style={{ animationDelay: `${i * 50}ms` }}
            id={`stat-${card.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            title={card.tooltip || ''}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-dm text-gray-400 uppercase tracking-wider truncate mr-1">
                  {card.label}
                </span>
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${card.accentBg} border ${card.accentBorder}`}
                >
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
