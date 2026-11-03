/**
 * FilterPanel.jsx
 *
 * Filter toolbar with search, category, date, and sorting.
 */
import { CATEGORIES } from '../utils/categories'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
} from 'react-icons/hi2'

export default function FilterPanel({ filters, onChange, onClear }) {
  function updateFilter(key, value) {
    onChange({ ...filters, [key]: value })
  }

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

        {/* Category */}
        <select
          value={filters.category}
          onChange={e => updateFilter('category', e.target.value)}
          className="input-base sm:w-40 text-xs"
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
