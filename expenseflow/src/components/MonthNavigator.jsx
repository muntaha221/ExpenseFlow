/**
 * MonthNavigator.jsx
 *
 * Dedicated month navigation header.
 * Allows quick navigation between November 2026, October 2026, and all other months.
 * When switching months, only that month's entries are shown.
 */
import { useMemo } from 'react'
import { getMonthList, formatMonthLabel } from '../utils/calculations'
import {
  HiOutlineCalendarDays,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineArrowPath,
} from 'react-icons/hi2'

export default function MonthNavigator({
  selectedMonth,
  onMonthChange,
  allExpenses = [],
  currentMonthEntriesCount = 0,
}) {
  const months = useMemo(() => {
    return getMonthList(allExpenses)
  }, [allExpenses])

  const now = new Date()
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const isCurrentMonth = selectedMonth === currentMonthKey

  const currentIndex = months.indexOf(selectedMonth)
  const canGoNewer = currentIndex > 0
  const canGoOlder = currentIndex < months.length - 1

  function handlePrevMonth() {
    if (canGoOlder) onMonthChange(months[currentIndex + 1])
  }

  function handleNextMonth() {
    if (canGoNewer) onMonthChange(months[currentIndex - 1])
  }

  return (
    <div
      className="card p-3 sm:p-4 mb-6 flex flex-wrap items-center justify-between gap-3 border border-indigo-500/20 bg-indigo-950/20"
      id="month-navigator-bar"
    >
      {/* Left: Calendar Icon + Month Dropdown */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <HiOutlineCalendarDays className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-dm uppercase tracking-wider text-indigo-300/70 block">
            Select Month
          </span>
          <div className="relative inline-block">
            <select
              value={selectedMonth}
              onChange={e => onMonthChange(e.target.value)}
              className="bg-transparent text-base sm:text-lg font-syne font-bold text-gray-100 cursor-pointer border-none outline-none pr-5 hover:text-emerald-400 transition-colors"
              id="active-month-select"
            >
              {months.map(key => (
                <option key={key} value={key} className="bg-gray-900 text-gray-100 py-1">
                  {formatMonthLabel(key)}
                  {key === currentMonthKey ? ' (Current)' : ''}
                </option>
              ))}
              <option value="all" className="bg-gray-900 text-gray-100 py-1">
                All Months (All Time)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Right: Quick Arrows & Month Status */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-dm text-gray-400 mr-2 hidden sm:inline">
          {currentMonthEntriesCount} {currentMonthEntriesCount === 1 ? 'entry' : 'entries'}
        </span>

        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={!canGoOlder}
          title="Previous Month (e.g. October)"
          className={`p-2 rounded-lg border text-xs font-dm flex items-center gap-1 transition-all ${
            canGoOlder
              ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
              : 'opacity-30 cursor-not-allowed border-transparent text-gray-600'
          }`}
          id="prev-month-btn"
        >
          <HiOutlineChevronLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Prev Month</span>
        </button>

        <button
          type="button"
          onClick={handleNextMonth}
          disabled={!canGoNewer}
          title="Next Month"
          className={`p-2 rounded-lg border text-xs font-dm flex items-center gap-1 transition-all ${
            canGoNewer
              ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
              : 'opacity-30 cursor-not-allowed border-transparent text-gray-600'
          }`}
          id="next-month-btn"
        >
          <span className="hidden xs:inline">Next Month</span>
          <HiOutlineChevronRight className="w-4 h-4" />
        </button>

        {!isCurrentMonth && (
          <button
            type="button"
            onClick={() => onMonthChange(currentMonthKey)}
            className="px-3 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 text-xs font-dm font-semibold flex items-center gap-1.5 transition-all"
            id="jump-current-month-btn"
          >
            <HiOutlineArrowPath className="w-3.5 h-3.5" />
            <span>Today (Nov)</span>
          </button>
        )}
      </div>
    </div>
  )
}
