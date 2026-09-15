/**
 * FilterPanel.jsx
 *
 * A filter toolbar that lets the user narrow down expenses by:
 *  - Text search (title contains...)
 *  - Category (select one or all)
 *  - Date range (from date, to date)
 *
 * WHY CLIENT-SIDE FILTERING?
 * - No backend — all data is in memory
 * - Instant results as the user types/selects
 * - Simple to implement with Array.filter()
 *
 * FILTER STATE LIVES IN DASHBOARD:
 * - Dashboard manages the filter state and passes it here
 * - This component is a controlled input — it displays and edits
 *   the filter values, but doesn't own them
 *
 * Props:
 *   filters (object) — { search, category, from, to }
 *   onChange (function) — called with updated filter object
 *   onClear (function) — called to reset filters
 */
import { CATEGORIES } from '../utils/categories'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineXMark,
} from 'react-icons/hi2'

export default function FilterPanel({ filters, onChange, onClear }) {
  /**
   * updateFilter — helper to update a single filter field.
   * Spreads the existing filters and overrides one key.
   */
  function updateFilter(key, value) {
    onChange({ ...filters, [key]: value })
  }

  // Count active filters (for the badge)
  const activeCount = [
    filters.search,
    filters.category,
    filters.from,
    filters.to,
  ].filter(Boolean).length

  return (
    <div className="card p-4 animate-fade-in-up" id="filter-panel">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2
            w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            className="input-base pl-9"
            id="filter-search"
          />
        </div>

        {/* Category */}
        <select
          value={filters.category}
          onChange={e => updateFilter('category', e.target.value)}
          className="input-base sm:w-44"
          id="filter-category"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Date From */}
        <input
          type="date"
          value={filters.from || ''}
          onChange={e => updateFilter('from', e.target.value)}
          className="input-base sm:w-36"
          placeholder="From"
          id="filter-date-from"
        />

        {/* Sorting */}
        <div className="flex items-center gap-2">
          <select
            value={filters.sortBy}
            onChange={e => updateFilter('sortBy', e.target.value)}
            className="input-base sm:w-32"
            id="filter-sortby"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
          <select
            value={filters.sortDir}
            onChange={e => updateFilter('sortDir', e.target.value)}
            className="input-base sm:w-28"
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
            className="btn-secondary whitespace-nowrap"
            id="filter-clear"
          >
            <HiOutlineXMark className="w-4 h-4" />
            Clear ({activeCount})
          </button>
        )}
      </div>
    </div>
  )
}
