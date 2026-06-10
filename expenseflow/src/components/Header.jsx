/**
 * Header.jsx
 *
 * The app's sticky top bar. Contains:
 *  1. Logo / app name
 *  2. Running total of all expenses
 *  3. Dark/light mode toggle
 *
 * WHY STICKY?
 * - The header shows the total at a glance, always visible
 * - Dark mode toggle should always be accessible
 * - Glassmorphism backdrop-blur looks premium when content scrolls under it
 *
 * Props:
 *   total (number) — sum of all expense amounts
 *   count (number) — number of expenses
 *   darkMode (boolean) — current theme
 *   onToggleDark (function) — callback to flip dark mode
 */
import { HiOutlineSun, HiOutlineMoon, HiOutlineBanknotes } from 'react-icons/hi2'

export default function Header({ total, count, darkMode, onToggleDark }) {
  /**
   * formatCurrency — formats a number as Pakistani Rupees.
   * Using Intl.NumberFormat for locale-aware formatting.
   * We use 'en-PK' to get comma separators.
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <header
      className="sticky top-0 z-40
        bg-gray-950/80 dark:bg-gray-950/80
        backdrop-blur-xl border-b border-white/5
        transition-colors duration-300"
      id="app-header"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9
            bg-emerald-400/15 rounded-xl border border-emerald-400/30">
            <HiOutlineBanknotes className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-syne font-bold text-gray-100 leading-tight">
              ExpenseFlow
            </h1>
            <p className="text-[11px] text-gray-500 font-dm">
              {count} expense{count !== 1 ? 's' : ''} tracked
            </p>
          </div>
        </div>

        {/* Right: Total + Dark Mode */}
        <div className="flex items-center gap-3">
          {/* Total badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5
            bg-emerald-400/10 border border-emerald-400/20 rounded-lg">
            <span className="text-xs text-emerald-400/70 font-dm">Total</span>
            <span className="text-sm font-syne font-bold text-emerald-400">
              {formatCurrency(total)}
            </span>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            className="flex items-center justify-center w-9 h-9
              bg-gray-800/80 hover:bg-gray-700/80
              border border-gray-700/50 rounded-xl
              text-gray-400 hover:text-gray-200
              transition-all duration-200"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            id="dark-mode-toggle"
          >
            {darkMode
              ? <HiOutlineSun className="w-4.5 h-4.5" />
              : <HiOutlineMoon className="w-4.5 h-4.5" />
            }
          </button>
        </div>
      </div>
    </header>
  )
}
