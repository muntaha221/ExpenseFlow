/**
 * FilterPanel.jsx
 *
 * Filter toolbar with search, category, month, and sorting.
 */
import { useMemo } from 'react'
import { CATEGORIES } from '../utils/categories'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
} from 'react-icons/hi2'

function toMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function formatMonthLabel(key) {
  if (key === 'all') return 'All Months'
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m - 1, 1)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function FilterPanel({
  filters,
  onChange,
  onClear,
  selectedMonth,
  onMonthChange,
  allExpenses = [],
}) {
  function updateFilter(key, value) {
    onChange({ ...filters, [key]: value })
  }

  // Available months from actual data + current month
  const availableMonths = useMemo(() => {
    const set = new Set()
    const nowKey = toMonthKey(new Date())
    set.add(nowKey)

    allExpenses.forEach(e => {
      try {
        const d = new Date(e.date)
        if (!isNaN(d.getTime())) set.add(toMonthKey(d))
      } catch {}
    })

    return Array.from(set).sort((a, b) => b.localeCompare(a))
  }, [allExpenses])

  const activeCount = [
    filters.search,
    filters.category,
    filters.from,
    filters.to,
  ].filter(Boolean).length

  return (
    <div className="card p-4 mb-5 animate-fade-in-up" id="filter-panel">
      <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by day or title..."
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            className="input-base pl-9 text-xs"
            id="filter-search"
          />
        </div>

        {/* Month Selector in Filter Bar (clean & non-intrusive) */}
        {onMonthChange && (
          <select
            value={selectedMonth || ''}
            onChange={e => onMonthChange(e.target.value)}
            className="input-base sm:w-36 text-xs font-semibold text-emerald-400"
            id="filter-month"
            title="Filter by Month"
          >
            {availableMonths.map(key => (
              <option key={key} value={key} className="bg-gray-900 text-gray-200">
                {formatMonthLabel(key)}
                {key === toMonthKey(new Date()) ? ' (Current)' : ''}
              </option>
            ))}
            <option value="all" className="bg-gray-900 text-gray-200">All Months</option>
          </select>
        )}

        {/* Category */}
        <select
          value={filters.category}
          onChange={e => updateFilter('category', e.target.value)}
          className="input-base sm:w-36 text-xs"
          id="filter-category"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Sorting */}
        <div className="flex items-center gap-1.5">
          <select
            value={filters.sortBy}
            onChange={e => updateFilter('sortBy', e.target.value)}
            className="input-base text-xs sm:w-28"
            id="filter-sortby"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
          <select
            value={filters.sortDir}
            onChange={e => updateFilter('sortDir', e.target.value)}
            className="input-base text-xs sm:w-24"
            id="filter-sortdir"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>

        {/* Clear filters */}
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="btn-secondary whitespace-nowrap text-xs py-2 px-3"
            id="filter-clear"
          >
            <HiOutlineXMark className="w-3.5 h-3.5" />
            Clear ({activeCount})
          </button>
        )}
      </div>
    </div>
  )
}
