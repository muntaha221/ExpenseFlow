/**
 * calculations.js
 *
 * Pure functions for deriving summary statistics and projections.
 */
import { getCategoryById } from './categories'

export function getTotalAmount(expenses) {
  return expenses.reduce((sum, e) => sum + Number(e.amount), 0)
}

export function getAverageAmount(expenses) {
  if (expenses.length === 0) return 0
  return getTotalAmount(expenses) / expenses.length
}

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
 * getDailyUsageData — Daily spending usage for the selected month.
 * Shows every day of the month up to current day (or full month for past months).
 */
export function getDailyUsageData(expenses, selectedMonth) {
  const now = new Date()
  let year, month
  if (selectedMonth && selectedMonth !== 'all') {
    const parts = selectedMonth.split('-').map(Number)
    year = parts[0]
    month = parts[1] - 1
  } else {
    year = now.getFullYear()
    month = now.getMonth()
  }

  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const isCurrentMonth = selectedMonth === currentMonthKey || !selectedMonth

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const maxDay = isCurrentMonth ? Math.max(now.getDate(), 1) : daysInMonth

  // Map dayNumber -> total spend
  const dayMap = new Map()
  expenses.forEach(e => {
    const d = new Date(e.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const dayNum = d.getDate()
      dayMap.set(dayNum, (dayMap.get(dayNum) || 0) + Number(e.amount))
    }
  })

  const data = []
  for (let dayNum = 1; dayNum <= maxDay; dayNum++) {
    const d = new Date(year, month, dayNum)
    const weekdayShort = d.toLocaleDateString('en-US', { weekday: 'short' })
    const monthShort = d.toLocaleDateString('en-US', { month: 'short' })
    const weekdayLong = d.toLocaleDateString('en-US', { weekday: 'long' })
    const amount = dayMap.get(dayNum) || 0

    data.push({
      day: `${weekdayShort} ${dayNum}`,
      fullDate: `${weekdayLong}, ${monthShort} ${dayNum}`,
      dayNum,
      amount,
    })
  }

  return data
}

export function getTopCategory(expenses) {
  if (expenses.length === 0) return null
  const breakdown = getCategoryBreakdown(expenses)
  if (breakdown.length === 0) return null
  return { name: breakdown[0].name, total: breakdown[0].value }
}

export function getRolling7DayStats(expenses) {
  const now = new Date()
  const windowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
  windowStart.setHours(0, 0, 0, 0)
  
  const windowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  windowEnd.setHours(23, 59, 59, 999)

  let total = 0
  let count = 0

  expenses.forEach(e => {
    const d = new Date(e.date)
    if (d >= windowStart && d <= windowEnd) {
      total += Number(e.amount)
      count += 1
    }
  })

  const dailyAvg = total / 7

  return { total, dailyAvg, count }
}

/**
 * getSmartMonthlyProjection — Intelligent Run-Rate Monthly Forecast
 * 
 * Takes recorded daily spend and calculates weekly run-rate.
 * e.g., if Day 1 is 2200 and Day 2 is 350, it averages them to calculate
 * weekly pace (~6k-8k/week) and projects the remaining month smoothly.
 */
export function getSmartMonthlyProjection(expenses, selectedMonth) {
  const now = new Date()
  
  let year, month
  if (selectedMonth && selectedMonth !== 'all') {
    const parts = selectedMonth.split('-').map(Number)
    year = parts[0]
    month = parts[1] - 1
  } else {
    year = now.getFullYear()
    month = now.getMonth()
  }
  
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const isCurrentMonth = selectedMonth === currentMonthKey || !selectedMonth
  
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const currentDay = isCurrentMonth ? now.getDate() : daysInMonth
  const remainingDays = isCurrentMonth ? Math.max(0, daysInMonth - currentDay) : 0

  let mtdTotal = 0
  const dailyTotals = {}
  
  expenses.forEach(e => {
    const amt = Number(e.amount)
    mtdTotal += amt
    
    const d = new Date(e.date)
    const dayNum = d.getDate()
    dailyTotals[dayNum] = (dailyTotals[dayNum] || 0) + amt
  })

  // Days with recorded spending
  const recordedDaysCount = Object.keys(dailyTotals).length
  const elapsedDays = Math.max(1, currentDay)
  
  // Daily average over the days elapsed in this month
  const dailyAvg = mtdTotal > 0 ? mtdTotal / elapsedDays : 0
  // Estimated weekly pace
  const weeklyPace = Math.round(dailyAvg * 7)

  // Smart projection: Current spent + (daily pace * remaining days)
  let projectedTotal = mtdTotal
  if (isCurrentMonth && remainingDays > 0) {
    if (mtdTotal > 0) {
      projectedTotal = Math.round(mtdTotal + (dailyAvg * remainingDays))
    }
  }

  return {
    mtdTotal,
    daysInMonth,
    currentDay,
    remainingDays,
    dailyAvg: Math.round(dailyAvg),
    weeklyPace,
    projectedTotal,
    recordedDaysCount,
  }
}

export function formatPKR(amount) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency', currency: 'PKR',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(Number(amount))
}

export function formatDateShort(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  } catch (e) {
    return dateStr
  }
}

export function formatTimeShort(dateStr) {
  try {
    return new Date(dateStr).toLocaleString('en-US', {
      hour: 'numeric', minute: '2-digit',
    })
  } catch (e) {
    return ''
  }
}

export function getDayName(dateStr) {
  try {
    const d = dateStr ? new Date(dateStr) : new Date()
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-US', { weekday: 'long' })
  } catch (e) {
    return ''
  }
}

/**
 * getMonthList — Generates month keys with guaranteed coverage
 * Includes current month, previous 11 months (October 2026, September 2026, etc.),
 * plus any months found in the user's expense history.
 */
export function getMonthList(expenses = []) {
  const months = []
  const now = new Date()
  
  // Last 12 calendar months (including current Nov 2026 and previous Oct 2026)
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!months.includes(key)) months.push(key)
  }

  // Any additional months present in expenses
  expenses.forEach(e => {
    try {
      const d = new Date(e.date)
      if (!isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (!months.includes(key)) months.push(key)
      }
    } catch {}
  })

  return months.sort((a, b) => b.localeCompare(a))
}

export function formatMonthLabel(key) {
  if (key === 'all') return 'All Months'
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m - 1, 1)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
