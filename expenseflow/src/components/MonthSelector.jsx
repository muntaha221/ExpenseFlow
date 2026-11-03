/**
 * MonthSelector.jsx
 *
 * Dropdown to navigate between months.
 * Shows only months that have data, plus the current month (always).
 * When the user switches months, the dashboard filters to that month's expenses only.
 */
import { useMemo } from 'react'
import { HiOutlineCalendarDays, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2'

/**
 * Build a "YYYY-MM" key from a Date object.
 */
function toMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Parse a "YYYY-MM" key into { year, month (0-based) }
 */
function parseMonthKey(key) {
  const [y, m] = key.split('-').map(Number)
  return { year: y, month: m - 1 }
}

/**
 * Format "YYYY-MM" → "November 2026"
 */
function formatMonthLabel(key) {
  const { year, month } = parseMonthKey(key)
  const d = new Date(year, month, 1)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function MonthSelector({ selectedMonth, onMonthChange, expenses }) {
  // Build sorted list of all months that have data + current month
  const availableMonths = useMemo(() => {
    const monthSet = new Set()

    // Always include current month
    const now = new Date()
    monthSet.add(toMonthKey(now))

    // Add all months that have expense entries
    expenses.forEach(e => {
      try {
        const d = new Date(e.date)
        if (!isNaN(d.getTime())) {
          monthSet.add(toMonthKey(d))
        }
      } catch {}
    })

    // Sort descending (newest first)
    return Array.from(monthSet).sort((a, b) => b.localeCompare(a))
  }, [expenses])

  const currentIdx = availableMonths.indexOf(selectedMonth)
  const canGoNewer = currentIdx > 0
  const canGoOlder = currentIdx < availableMonths.length - 1

  function goNewer() {
    if (canGoNewer) onMonthChange(availableMonths[currentIdx - 1])
  }
  function goOlder() {
    if (canGoOlder) onMonthChange(availableMonths[currentIdx + 1])
  }

  const now = new Date()
  const isCurrentMonth = selectedMonth === toMonthKey(now)

  return (
    <div className="flex items-center justify-between mb-5 px-1" id="month-selector">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 bg-indigo-400/10 rounded-lg border border-indigo-400/20">
          <HiOutlineCalendarDays className="w-4 h-4 text-indigo-400" />
        </div>
        <div>
          <p className="text-[10px] text-gray-500 font-dm uppercase tracking-wider leading-none mb-0.5">
            Viewing Month
          </p>
          <select
            value={selectedMonth}
            onChange={e => onMonthChange(e.target.value)}
            className="bg-transparent text-sm font-syne font-bold text-gray-100 cursor-pointer
              border-none outline-none appearance-none pr-4
              hover:text-emerald-400 transition-colors"
            id="month-dropdown"
          >
            {availableMonths.map(key => (
              <option key={key} value={key} className="bg-gray-900 text-gray-200">
                {formatMonthLabel(key)}
                {key === toMonthKey(new Date()) ? ' (Current)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Arrow nav */}
        <button
          onClick={goOlder}
          disabled={!canGoOlder}
          className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-all
            ${canGoOlder
              ? 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/10'
              : 'bg-transparent border-transparent text-gray-700 cursor-not-allowed'
            }`}
          title="Previous month"
        >
          <HiOutlineChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={goNewer}
          disabled={!canGoNewer}
          className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-all
            ${canGoNewer
              ? 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/10'
              : 'bg-transparent border-transparent text-gray-700 cursor-not-allowed'
            }`}
          title="Next month"
        >
          <HiOutlineChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Quick "Today" button if not on current month */}
        {!isCurrentMonth && (
          <button
            onClick={() => onMonthChange(toMonthKey(new Date()))}
            className="ml-1 px-2.5 py-1 text-[11px] font-dm font-medium rounded-lg
              bg-emerald-500/15 border border-emerald-500/30 text-emerald-400
              hover:bg-emerald-500/25 transition-all"
          >
            Current Month
          </button>
        )}
      </div>
    </div>
  )
}

// Export helper so App.jsx can compute the current month key
export { toMonthKey }
