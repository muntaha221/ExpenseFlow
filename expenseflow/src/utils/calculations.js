/**
 * calculations.js
 *
 * Pure functions for deriving summary statistics from expense data.
 * WHY PURE FUNCTIONS?
 * - Easy to test: input in, output out, no side effects
 * - Can be memoized in React with useMemo
 * - Decoupled from rendering logic
 */
import { getCategoryById } from './categories'

/**
 * getTotalAmount — sums all expense amounts.
 * Uses reduce for a single pass through the array.
 * @param {Array} expenses - The array of expense objects
 * @returns {number} Total amount spent
 */
export function getTotalAmount(expenses) {
  return expenses.reduce((sum, e) => sum + Number(e.amount), 0)
}

/**
 * getAverageAmount — total / count, or 0 if no expenses.
 * The guard against division-by-zero is critical.
 * @param {Array} expenses
 * @returns {number}
 */
export function getAverageAmount(expenses) {
  if (expenses.length === 0) return 0
  return getTotalAmount(expenses) / expenses.length
}

/**
 * getCategoryBreakdown — groups expenses by category.
 * Returns an array of { name, value, hex, id } for Recharts PieChart.
 *
 * Approach:
 * 1. Build a Map of category_id → total_amount
 * 2. Convert to the shape Recharts expects
 * 3. Sort descending so the largest slice is first
 *
 * @param {Array} expenses
 * @returns {Array<{name: string, value: number, hex: string, id: string}>}
 */
export function getCategoryBreakdown(expenses) {
  const map = new Map()

  expenses.forEach(e => {
    const current = map.get(e.category) || 0
    map.set(e.category, current + Number(e.amount))
  })

  return Array.from(map.entries())
    .map(([catId, total]) => {
      const cat = getCategoryById(catId)
      return { name: cat.name, value: total, hex: cat.hex, id: catId }
    })
    .sort((a, b) => b.value - a.value)
}

/**
 * getMonthlyBreakdown — groups expenses by month.
 * Returns data shaped for Recharts BarChart: { month, amount }
 *
 * We show the last 6 months to keep the chart readable.
 * Months with no expenses still appear (with amount 0)
 * so the x-axis is continuous.
 *
 * @param {Array} expenses
 * @returns {Array<{month: string, amount: number}>}
 */
export function getMonthlyBreakdown(expenses) {
  // Build last 6 months
  const months = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    months.push({ key, label, amount: 0 })
  }

  // Fill in amounts
  expenses.forEach(e => {
    const date = new Date(e.date)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthEntry = months.find(m => m.key === key)
    if (monthEntry) {
      monthEntry.amount += Number(e.amount)
    }
  })

  return months.map(m => ({ month: m.label, amount: m.amount }))
}

export function getDailyBreakdown(expenses) {
  // Last 7 days
  const days = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    // Local date string for matching
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
    days.push({ key, label, amount: 0 })
  }

  expenses.forEach(e => {
    const d = new Date(e.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const dayEntry = days.find(d => d.key === key)
    if (dayEntry) {
      dayEntry.amount += Number(e.amount)
    }
  })

  return days.map(d => ({ month: d.label, amount: d.amount })) // reusing "month" key for Recharts XAxis
}

export function getWeeklyBreakdown(expenses) {
  // Last 6 weeks
  const weeks = []
  const now = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i * 7))
    end.setHours(23, 59, 59, 999)
    const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 6)
    start.setHours(0, 0, 0, 0)
    
    const label = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    weeks.push({ start, end, label, amount: 0 })
  }

  expenses.forEach(e => {
    const d = new Date(e.date)
    const weekEntry = weeks.find(w => d >= w.start && d <= w.end)
    if (weekEntry) {
      weekEntry.amount += Number(e.amount)
    }
  })

  return weeks.map(w => ({ month: w.label, amount: w.amount }))
}
/**
 * getTopCategory — finds the category with the highest total spending.
 * Returns the category object (from categories.js) or null.
 *
 * @param {Array} expenses
 * @returns {{ name: string, total: number } | null}
 */
export function getTopCategory(expenses) {
  if (expenses.length === 0) return null
  const breakdown = getCategoryBreakdown(expenses)
  if (breakdown.length === 0) return null
  return { name: breakdown[0].name, total: breakdown[0].value }
}

export function getThisWeekTotal(expenses) {
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  startOfWeek.setHours(0,0,0,0)
  
  return expenses.reduce((sum, e) => {
    const d = new Date(e.date)
    return d >= startOfWeek ? sum + Number(e.amount) : sum
  }, 0)
}

export function getThisMonthTotal(expenses) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  return expenses.reduce((sum, e) => {
    const d = new Date(e.date)
    return d >= startOfMonth ? sum + Number(e.amount) : sum
  }, 0)
}

/**
 * formatPKR — formats a number as PKR currency without fractional digits.
 * Used by small components to keep formatting consistent across the app.
 */
export function formatPKR(amount) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency', currency: 'PKR',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(Number(amount))
}

/**
 * formatDate — human-friendly short date formatter used in lists/cards.
 */
export function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  } catch (e) {
    return dateStr
  }
}

/**
 * formatDateTime — includes day of week, date, and time.
 */
export function formatDateTime(dateStr) {
  try {
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    })
  } catch (e) {
    return dateStr
  }
}
